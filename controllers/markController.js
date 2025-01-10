const Mark = require('../models/Mark');

// Create or Update Marks..... Working
exports.updateMarks = async (req, res) => {
  const { student, subject, firstAssessment, secondAssessment, exam } = req.body;

  try {
    let mark = await Mark.findOne({ student, subject });

    if (!mark) {
      // If mark record doesn't exist, create it
      mark = new Mark({ student, subject });
    }

    // Update the scores if provided
    if (firstAssessment !== undefined) mark.firstAssessment = firstAssessment;
    if (secondAssessment !== undefined) mark.secondAssessment = secondAssessment;
    if (exam !== undefined) mark.exam = exam;

    // Save the updated record
    await mark.save();

    res.status(200).json({ message: 'Marks updated successfully', mark });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update marks', error: err.message });
  }
};

//Finalize marks ....... Working
exports.finalizeMarks = async (req, res) => {
    const { student, subject, grade } = req.body;
  
    try {
      const mark = await Mark.findOne({ student, subject });
  
      if (!mark) {
        return res.status(404).json({ message: 'Marks not found for the student and subject' });
      }
  
      if (mark.finalized) {
        return res.status(400).json({ message: 'Marks are already finalized' });
      }
  
      // Calculate total
      mark.total = mark.firstAssessment + mark.secondAssessment + mark.exam;
      mark.grade = grade;
      mark.finalized = true;
  
      // Save the finalized mark
      await mark.save();
      res.status(200).json({ message: 'Marks finalized successfully', mark });
    } catch (err) {
      res.status(500).json({ message: 'Failed to finalize marks', error: err.message });
    }
};

// Unfinalize marks.... Working
 exports.unfinalizeMarks = async (req, res) => {
    const { student, subject } = req.body;
  
    try {
      const mark = await Mark.findOne({ student, subject });
  
      if (!mark) {
        return res.status(404).json({ message: 'Marks not found for the student and subject' });
      }
  
      if (!mark.finalized) {
        return res.status(400).json({ message: 'Marks are not finalized' });
      }
  
      mark.finalized = false;
  
      // Save the unfinalized mark
      await mark.save();
      res.status(200).json({ message: 'Marks unfinalized successfully', mark });
    } catch (err) {
      res.status(500).json({ message: 'Failed to unfinalize marks', error: err.message });
    }
};



exports.getMarksBySubject = async (req, res) => {
    const { subject } = req.params;
  
    try {
        const marks = await Mark.find({ subject }).populate('student', 'fullname _id');

        res.status(200).json({ message: 'Marks fetched successfully', marks });
        
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch marks', error: err.message });
    }
};


// Fetch all subjects with marks and grades for a specific student.... Working
exports.getGradesByStudent = async (req, res) => {
  try {

    const {studentId} = req.params; 

    const marks = await Mark.find({ student: studentId })
      .populate('subject', 'name') // Populating subject name
      .exec();

    res.status(200).json(marks);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error });
    res.status(400).json({ message: 'Bad Request', error });

  }
};