const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },

      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
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