const express = require('express');
const router = express.Router()

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controllers
const { createStudent, loginStudent, assignClassToStudent, singleStudentProfile, getAllStudent, updateStudentProfile, requestPasswordReset, resetPassword,  deleteStudent } = require("../controllers/studentController");


// Creating Endpoints for students.
router.post("/student/login", loginStudent);  // Login Student
router.patch("/update-Student/:studentId", authMiddleware, updateStudentProfile); // Update Student Profile

// Forgot Password routes
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


// Admin routes
router.get("/single-student/:studentId", authMiddleware, singleStudentProfile); // Get Single Student Profile
router.post("/student/register", authMiddleware, adminMiddleware,  createStudent);
router.get("/students", authMiddleware, adminMiddleware, getAllStudent);
router.patch("/assign-Class", authMiddleware, adminMiddleware, assignClassToStudent);
router.delete("/delete/:studentId", authMiddleware, adminMiddleware, deleteStudent); // Delete Student


module.exports = router;
