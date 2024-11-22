const mongoose = require('mongoose');

// Define the schema for a subject
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',        
    }],
    
    teacher: {
        type: String,
        default: null, // Teacher is optional
    },
}, { timestamps: true });

// Create the model based on the schema
module.exports = mongoose.model('Subject', subjectSchema);