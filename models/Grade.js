const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },

      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },

      grade: {
        type: String,
        required: true
      },

      remarks: {
        type: String
      },

      createdAt: {
        type: Date,
        default: Date.now
      },

      updatedAt: {
        type: Date,
        default: Date.now
      }

})

module.exports = mongoose.model('Grade', courseSchema);