const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const generateStudentID = require('../utilities/studentIDGenerator');
const generateSchoolEmail = require('../utilities/generateSchoolEmail');

const studentSchema = mongoose.Schema({
      fullname: {
          type: String,
          required: true
      },

      email: {
        type: String,
        required: true,
        unique: true
      },

      password: {
          type: String,
          required: true
      },

      studentID: {
        type: String,
        required: true,
        unique: true
      },

      profilePicture: {
      type: String,
      default: 'https://res.cloudinary.com/dx6w1g03t/image/upload/v1692666382/Profile-Picture/blank-profile-picture-973460_640_qqg5d1.jpg'
      },

      classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
      },

      courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }],

      grades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade'
      }],

      yearEnrolled: {
        type: String,
        required: true,
        default: () => new Date().getFullYear()
      },

      // b

      createdAt: {
        type: Date,
        default: Date.now
      },
      
      updatedAt: {
        type: Date,
        default: Date.now
      }
});

// hash password before saving
studentSchema.pre('save', async function (next) {
  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
  } catch (error) {
      next(error);
  }
});

// Generate unique enrollment number
studentSchema.pre('save', async function (next) {
  if (!this.studentID) {
    this.studentID = generateStudentID(this.yearEnrolled);
  };
  next();
})


// Generate email for student
studentSchema.pre('save', function (next) {
  if (!this.email) {
     this.email = generateSchoolEmail(this.fullname);
  };
  next();
});


module.exports = mongoose.model('Student', studentSchema);