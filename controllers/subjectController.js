const Subject = require('../models/Course'); // Import the Subject model

// Create a new subject
const createSubject = async (req, res) => {
    const { name, teacher } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({ error: "Subject name is required" });
    }

    try {
        const newSubject = new Subject({
            name,
            teacher: teacher || null,
        });

        await newSubject.save(); // Save to the database

        res.status(201).json({ message: "Subject created successfully", subject: newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve all subjects
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find(); // Retrieve all subjects from the database
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSubject,
    getSubjects
};
