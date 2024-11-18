const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    teacher: {
        type: String,
        required: true
    },

    students: [{
        type: String
    }],

    
})