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

      address: {
        type: String,
        required: true
      },

      parents_name: {
        type: String,
        required: true
      },

      parent_no: {
        type: String,
        required: true
      },

      gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
      },

      dateOfBirth: {
        type: Date,
        required: true
      },

      studentID: {
        type: String,
        required: true,
        unique: true
      },

      image: {
      type: String,
      default: 'https://res.cloudinary.com/dx6w1g03t/image/upload/v1692666382/Profile-Picture/blank-profile-picture-973460_640_qqg5d1.jpg'
      },

      classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
      },

      subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
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


// Both Redundant due to the logic being created in the controller for speed and control
// Generate unique enrollment number
// studentSchema.pre('save', async function (next) {
//   if (!this.studentID) {
//     this.studentID = generateStudentID(this.yearEnrolled);
//   };
//   next();
// })


// // Generate email for student
// studentSchema.pre('save', function (next) {
//   if (!this.email) {
//      this.email = generateSchoolEmail(this.fullname);
//   };
//   next();
// });


module.exports = mongoose.model('Student', studentSchema);