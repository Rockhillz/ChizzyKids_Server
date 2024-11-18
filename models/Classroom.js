const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },

    students: [{type: mongoose.Schema.Types.ObjectId,
             ref: 'Student'}],

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    
    }]
    

})

module.exports = mongoose.model('Classroom', classSchema);