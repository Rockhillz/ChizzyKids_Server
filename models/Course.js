const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    teacher: {
        type: String,
        default: null
    },

    students: [{
        type: String
    }],

    
})