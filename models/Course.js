const mongoose = require('mongoose');

// Define the schema for a subject
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        default: null, // Teacher is optional
    },
}, { timestamps: true });

// Create the model based on the schema
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
