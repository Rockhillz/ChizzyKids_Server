const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },

      academicYear: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AcademicYear', 
        required: true 
      },

      term: { 
        type: String, 
        enum: ['First Term', 'Second Term', 'Third Term'], 
        required: true 
      },

      marks: {
        type: Number,
        required: true,
      },

      maxMarks: {
        type: Number,
        default: 100,
      },

      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
      },

      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
      },

      grade: {
        type: String
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

// Helper function to calculate grade
const calculateGrade = (marks, maxMarks) => {
  const percentage = (marks / maxMarks) * 100;

  if (percentage >= 86) return 'A+';
  if (percentage >= 76) return 'A';
  if (percentage >= 66) return 'B';
  if (percentage >= 56) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

gradeSchema.pre('save', function (next) {
  if (this.marks && this.maxMarks) {
      this.grade = calculateGrade(this.marks, this.maxMarks);
  }
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);