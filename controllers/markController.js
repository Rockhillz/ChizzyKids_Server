const Mark = require("../models/Mark");
const Term = require("../models/Term");

// Create or Update Marks..... Working
exports.updateMarks = async (req, res) => {
  const { student, subject, firstAssessment, secondAssessment, exam, term } =
    req.body;


  try {
    // Ensure term is provided
    if (!term) {
      return res.status(400).json({ error: "Term is required" });
    }

    let mark = await Mark.findOne({ student, subject, term });

    if (!mark) {
      // If mark record doesn't exist, create it
      mark = new Mark({ student, subject, term });
    }

    // Update the scores if provided
    if (firstAssessment !== undefined) mark.firstAssessment = firstAssessment;
    if (secondAssessment !== undefined)
      mark.secondAssessment = secondAssessment;
    if (exam !== undefined) mark.exam = exam;

    // Save the updated record
    await mark.save();

    res.status(200).json({ message: "Marks updated successfully", mark });
  } catch (err) {
    console.log("An error: ", err);
    res
      .status(500)
      .json({ message: "Failed to update marks", error: err.message });
  }
};

//Finalize marks ....... Working
exports.finalizeMarks = async (req, res) => {
  const { student, subject, grade, term } = req.body;

  try {
    const mark = await Mark.findOne({ student, subject, term });

    if (!mark) {
      return res
        .status(404)
        .json({ message: "Marks not found for the student and subject" });
    }

    if (mark.finalized) {
      return res.status(400).json({ message: "Marks are already finalized" });
    }

    // Calculate total
    mark.total = mark.firstAssessment + mark.secondAssessment + mark.exam;
    mark.grade = grade;
    mark.finalized = true;

    // Save the finalized mark
    await mark.save();
    res.status(200).json({ message: "Marks finalized successfully", mark });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to finalize marks", error: err.message });
  }
};

// Unfinalize marks.... Working
exports.unfinalizeMarks = async (req, res) => {
  const { student, subject, term } = req.body;

  try {
    const mark = await Mark.findOne({ student, subject, term });

    if (!mark) {
      return res
        .status(404)
        .json({ message: "Marks not found for the student and subject" });
    }

    if (!mark.finalized) {
      return res.status(400).json({ message: "Marks are not finalized" });
    }

    mark.finalized = false;

    // Save the unfinalized mark
    await mark.save();
    res.status(200).json({ message: "Marks unfinalized successfully", mark });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to unfinalize marks", error: err.message });
  }
};

// Reset marks if there is a new term
exports.resetMarks = async (req, res) => {
  const { termId, subjectId } = req.body;

  if (!termId || !subjectId) {
    return res.status(400).json({ error: "termId and subjectId are required." });
  }

  try {
    // Update marks where term and subject match
    const result = await Mark.updateMany(
      { term: termId, subject: subjectId },
      { $set: { firstAssessment: null, secondAssessment: null, exam: null } }
    );

    res.status(200).json({
      message: "Marks reset successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error resetting marks:", error);
    res.status(500).json({ error: "Failed to reset marks. Please try again." });
  }
};

exports.getMarksBySubject = async (req, res) => {
  const { subject } = req.params;

  try {
    const marks = await Mark.find({ subject }).populate(
      "student",
      "fullname _id"
    );

    res.status(200).json({ message: "Marks fetched successfully", marks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch marks", error: err.message });
  }
};

// Fetch all subjects with marks and grades for a specific student.... Working
exports.getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Step 1: Find the active (current) term (we can fetch it without the student)
    const currentTerm = await Term.findOne({ isCurrentTerm: true });
    if (!currentTerm) {
      return res.status(404).json({ message: "No active term found" });
    }

    // Step 2: Find the marks for the student for the current term
    const marks = await Mark.find({ student: studentId, term: currentTerm._id })
      .populate("subject", "name")  // Populate the subject name
      .exec();

    if (marks.length === 0) {
      return res.status(200).json([]);  // Return an empty array if no marks are found
    }

    res.status(200).json(marks);  // Return the marks for the current term
  } catch (error) {
    res.status(500).json({ message: "Error fetching grades", error });
  }
};

exports.studentsSubjectMarks = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { termId } = req.query; // Extract termId from query params

    if (!termId) {
      return res.status(400).json({ message: "Term ID is required" });
    }

    const marks = await Mark.find({ subject: subjectId, term: termId });

    res.status(200).json({ success: true, marks });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Server error while fetching marks" });
  }
}