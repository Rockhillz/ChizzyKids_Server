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

    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
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
      enum: ['male', 'female'],
      required: true
    },

    contact_no: {
      type: String,
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

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
});


// Hash Password before saving
teacherSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);