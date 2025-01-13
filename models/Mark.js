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
    enum: ["A", "B", "C", "D", "E", "F"],  // Enum to allow only letter grades
    default: "F",  // Default to "F" if not set
  },

  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true,
  }

  // will add remark here later with a post save middleware


}, { timestamps: true });

module.exports = mongoose.model('Mark', markSchema);
