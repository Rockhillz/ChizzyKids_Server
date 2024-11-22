const Subject = require('../models/Subject'); // Import the Subject model

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

//Assign teacher 

