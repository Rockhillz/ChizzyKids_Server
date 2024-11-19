const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const employeeID = require("../utilities/employeeIDGen");

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
      enum: ['teacher', 'admin', 'super_admin'],
      default: 'teacher'
    },

    profilePicture: {
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