const Student = require("../models/Student");
const Mark = require("../models/Mark");
const Classroom = require("../models/Classroom");
const Term = require("../models/Term");
const Attendance = require("../models/Attendance");
const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf-node");

exports.generateStudentReport = async (req, res) => {
  try {
    const { studentId, termId } = req.params;

    // Fetch the term details
    const term = await Term.findById(termId).populate("session");
    if (!term) {
      return res.status(404).json({ error: "Term not found" });
    }

    // Fetch student and populate classroom and teacher
    const student = await Student.findById(studentId)
      .populate({
        path: "classroom",
        populate: { path: "teacher", select: "fullname" },
      })
      .populate("subjects");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Fetch marks for the student in the given term
    const marks = await Mark.find({ student: studentId, term: termId }).populate("subject");
    if (!marks.length) {
      return res.status(404).json({ error: "No marks found for this term" });
    }

    // Fetch attendance records
    const attendanceRecords = await Attendance.find({ studentId, term: termId });

    // Calculate attendance percentage
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((a) => a.status === "Present").length;
    const attendancePercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : "N/A";

    // Get classroom teacher's name
    const teacherName = student.classroom?.teacher?.fullname || "N/A";

    // Calculate total score and average score
    const totalScore = marks.reduce((sum, mark) => sum + mark.total, 0);
    const averageScore = (totalScore / marks.length).toFixed(2);
    const overallGrade = getOverallGrade(marks);

    // Get teacher's comment
    const teacherComment = generateTeacherComment(student.fullname, overallGrade);

    // Path to the local logo file - create directories if they don't exist
    const assetsDir = path.resolve(__dirname, "../assets");
    await fs.ensureDir(assetsDir);
    
    const logoFileName = "pngtree-school-logo-png-image_3972196.png";
    const logoFilePath = path.resolve(assetsDir, logoFileName);
    let logoPath;
    
    // Check if the logo file exists locally
    if (await fs.pathExists(logoFilePath)) {
      // Convert logo to base64 data URI
      const logoBase64 = (await fs.readFile(logoFilePath)).toString('base64');
      logoPath = `data:image/png;base64,${logoBase64}`;
    } else {
      // Fallback to a basic data URI (empty transparent PNG)
      logoPath = "https://pngtree.pngtree.com/png-vector/20211006/ourmid/pngtree-school-logo-png-image_3972196.png";
    }
    
    // Render the HTML template
    const templatePath = path.resolve(__dirname, "../views/reportTemplate.ejs");
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error("EJS template file not found!");
    }
    
    const template = await fs.readFile(templatePath, "utf-8");
    
    // Format date of birth safely
    const formattedDOB = student.dateOfBirth 
      ? new Date(student.dateOfBirth).toLocaleDateString()
      : "N/A";
    
    // Render EJS
    const html = ejs.render(template, {
      logoPath,
      term,
      student,
      teacherName,
      totalScore,
      averageScore,
      overallGrade,
      totalDays,
      presentDays,
      attendancePercentage,
      marks,
      formattedDOB,
      teacherComment
    });
    
    // Create logs directory if it doesn't exist
    const logsDir = path.resolve(__dirname, "../logs");
    await fs.ensureDir(logsDir);
    
    // Debug: Save HTML
    await fs.writeFile(path.join(logsDir, "debug.html"), html);
    
    // Generate PDF using html-pdf-node
    const options = { 
      format: 'A4',
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      printBackground: true,
      preferCSSPageSize: true,
      path: path.join(logsDir, "debug.pdf") // This will save a copy for debugging
    };
    
    const file = { content: html };
    
    const pdfBuffer = await htmlPdf.generatePdf(file, options)
      .catch(err => {
        console.error("PDF generation error:", err);
        throw new Error(`Failed to generate PDF: ${err.message}`);
      });
    
    // Send PDF response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${encodeURIComponent(student.fullname)}-report.pdf`,
      "Cache-Control": "private, max-age=3600" // Cache for 1 hour
    });
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("Error generating report:", error.message, error.stack);
    res.status(500).json({ 
      error: "Server error while generating report", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Function to determine overall grade based on average score
function getOverallGrade(marks) {
  const avg = marks.reduce((sum, mark) => sum + mark.total, 0) / marks.length;
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  if (avg >= 40) return "E";
  return "F";
}

// Function to generate a dynamic teacher comment based on performance
function generateTeacherComment(studentName, grade) {
  grade = grade.toUpperCase().trim(); // Ensure grade is uppercase and trimmed

  const comments = {
    A: `${studentName} has performed excellently this term. Keep up the outstanding work!`,
    B: `${studentName} has shown commendable effort and achieved good results. Continue to work hard.`,
    C: `${studentName} has made satisfactory progress this term. With more focus, you can improve further.`,
    D: `${studentName} needs to put in more effort and focus on areas of weakness. Regular practice will help.`,
    E: `${studentName} requires significant improvement in most subjects. Please arrange for extra support.`,
    F: `${studentName} has underperformed this term. Immediate intervention and support are necessary.`
  };

  const comment = comments[grade] || `${studentName} needs to improve and put in more effort in their studies.`;
  return comment;
}