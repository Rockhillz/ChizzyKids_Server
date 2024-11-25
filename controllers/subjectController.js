const Subject = require('../models/Subject'); // Import the Subject model
const Classroom = require('../models/Classroom'); // Import the Classroom

// Create a new subject
exports.createSubject = async (req, res) => {
    const { name } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({ error: "Subject name is required" });
    }

    try {
        const newSubject = new Subject({
            name
        });

        await newSubject.save(); // Save to the database

        res.status(201).json({ message: "Subject created successfully", subject: newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve all subjects
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find(); // Retrieve all subjects from the database
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(400).json({ message: "Subject is already assigned to this class" });
        }

        // Assign the teacher to the subject
        subjectObj.teacher = teacherObj._id;
        await subjectObj.save();
        res.status(200).json({ message: "Teacher assigned successfully", subject: subjectObj });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


