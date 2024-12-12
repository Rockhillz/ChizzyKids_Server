const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const teacherSchema = new mongoose.Schema({
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

    employeeID: {
      type: String,
      required: true,
      unique: true
    },

    role: {
      type: String,
      enum: ['teacher', 'admin'],
      default: 'teacher'
    },

    image: {
    type: String,
    default: 'https://res.cloudinary.com/dx6w1g03t/image/upload/v1692666382/Profile-Picture/blank-profile-picture-973460_640_qqg5d1.jpg'
    },

    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }],

    department: {
      type: String
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    previous_school: {
      type: String,
      required: true
    },

    qualification: [{
      type: String,
      required: true
    }],

    yearEnrolled: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear()
    },
    
    resetPasswordToken: { 
      type: String, 
      // select: false 
    },
    
  }, { timestamps: true } );


// Hash Password before saving

teacherSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('Teacher', teacherSchema);