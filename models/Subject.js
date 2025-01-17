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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },

    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    }

    
}, { timestamps: true });


// Create the model based on the schema
module.exports = mongoose.model('Subject', subjectSchema);