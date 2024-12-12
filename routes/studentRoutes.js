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
router.get("/single-student/:studentId", singleStudentProfile); // Get Single Student Profile

router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/students", getAllStudent);

// Admin routes
router.post("/student/register", authMiddleware, adminMiddleware,  createStudent);
// router.get("/students", authMiddleware, adminMiddleware, getAllStudent); commented out for now
router.patch("/assign-Class", authMiddleware, adminMiddleware, assignClassToStudent);
router.delete("/delete/:studentId", authMiddleware, adminMiddleware, deleteStudent); // Delete Student


module.exports = router;
