const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => !isNaN(new Date(value).getTime()), // Checks if it's a valid date
      message: 'Invalid date format.',
    },
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('Attendance', attendanceSchema);
