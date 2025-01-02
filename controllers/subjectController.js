const Subject = require("../models/Subject"); // Import the Subject model
const Classroom = require("../models/Classroom"); // Import the Classroom
const Student = require("../models/Student"); // Import the Student

// Create a new subject...... Working
exports.createSubject = async (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  try {
    const newSubject = new Subject({
      name,
    });

    await newSubject.save(); // Save to the database

    res
      .status(201)
      .json({ message: "Subject created successfully", subject: newSubject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all subjects..... Working

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teacher", "fullname") // Populate teacher with fullname field only
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    // Add the number of students for each subject
    const subjectsWithStudentCount = subjects.map((subject) => ({
      ...subject,
      studentCount: subject.students.length, // Calculate the number of students
    }));

    res.status(200).json(subjectsWithStudentCount);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Assign subjects to a class.
exports.assignSubjectToClass = async (req, res) => {
  const { classId, subjectId } = req.body;

  try {
    // Check if class and subject exist
    const classObj = await Classroom.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subjectObj = await Subject.findById(subjectId);
    if (!subjectObj) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Validate if subject is already assigned to the class
    if (classObj.subjects.includes(subjectId)) {
      return res
        .status(400)
        .json({ message: "Subject is already assigned to this class" });
    }

    // Assign the subject to the class
    classObj.subjects.push(subjectId);
    await classObj.save();

    res
      .status(200)
      .json({
        message: "Subject assigned to class successfully",
        class: classObj,
        subject: subjectObj,
      });
  } catch (error) {
    console.error("Error assigning subject to class:", error);
    return res.status(500).json({ error: error.message });
  }
};

// delete a subject
exports.deleteSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subject.findByIdAndDelete(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all subjects done by a single student

exports.getSubjectsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId).populate({
      path: "subjects",
      populate: {
        path: "teacher", // Populate the teacher field in each subject
        select: "fullname",
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects: student.subjects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Fetch single subject
exports.singleSubject = async (req, res) => {
  const { subjectId } = req.params; // Get the subject ID from the URL params

  try {
    // Fetch the subject by ID and populate the references (students and teacher)
    const subject = await Subject.findById(subjectId)
      .populate("students") // Populate the students field with the actual student data
      .populate("teacher"); // Populate the teacher field with the actual teacher data

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Return the populated subject
    return res.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// subjects assigned to teacher.. working
exports.getSubjectsAssignedToTeacher = async (req, res) => {
  try {
    // Get the teacher's ID from the decoded token (available in req.teacher)
    const teacherId = req.teacher.teacherId;

    // Find subjects assigned to the teacher
    const subjects = await Subject.find({ teacher: teacherId });

    if (!subjects || subjects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No subjects found for the teacher" });
    }

    // Respond with the array of subjects directly
    res.status(200).json({
      success: true,
      subjects: subjects.map((subject) => ({
        _id: subject._id,
        name: subject.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching subjects for teacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// gets students assigned to a subject.

exports.getStudentsBySubject = async (req, res) => {
  try {
    // Get the subjectId from the URL params
    const { subjectId } = req.params;

    // Find the subject and populate the students field
    const subject = await Subject.findById(subjectId)
      .populate("students", "fullname") // Adjust fields as needed
      .populate("teacher", "fullname"); // Optional, if you want to return teacher's name too

      console.log(subject)

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Return the subject data along with the students assigned to it
    res.status(200).json({
      success: true,
      subject: subject.name,
      students: subject.students.map(student => ({
        id: student._id,
        name: student.fullname,
      })),
    });
  } catch (error) {
    console.error("Error fetching students for subject:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};