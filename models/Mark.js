const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },

  firstAssessment: {
    type: Number,
    default: 0,
    min: 0,
    max: 20,
  },

  secondAssessment: {
    type: Number,
    default: 0,
    min: 0,
    max: 20,
  },

  exam: {
    type: Number,
    default: 0,
    min: 0,
    max: 60,
  },

  total: {
    type: Number,
    default: 0,
  },

  finalized: {
    type: Boolean,
    default: false,
  },

  grade: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F"],
    default: "F",
  },

  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true,
  },

  remark: {
    type: String,
    default: 'Needs Improvement',
  }

}, { timestamps: true });

// Pre-save middleware to update the report based on grade
markSchema.pre('save', function (next) {
  if (this.grade === 'A') {
    this.report = 'Excellent performance! Keep it up!';
  } else if (this.grade === 'B') {
    this.report = 'Good job! You can do even better!';
  } else if (this.grade === 'C') {
    this.report = 'Satisfactory, but room for improvement.';
  } else if (this.grade === 'D') {
    this.report = 'Below average. Needs more effort.';
  } else if (this.grade === 'E') {
    this.report = 'Poor performance. Consider extra help.';
  } else {
    this.report = 'Fail. Urgent improvement needed.';
  }
  
  next();
});

module.exports = mongoose.model('Mark', markSchema);
