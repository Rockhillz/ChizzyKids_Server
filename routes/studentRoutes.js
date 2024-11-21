const express = require('express');
const router = express.Router()

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controllers
const { createStudent, loginStudent, assignClassToStudent, getAllStudent, updateStudentProfile, logoutStudent } = require("../controllers/studentController");


// Creating Endpoints for students.
router.post("/student/login", loginStudent);  // Login Student
router.patch("/update-Student/:studentId", authMiddleware, updateStudentProfile); // Update Student Profile
router.post("/student/logout", authMiddleware, logoutStudent); // Logout 




// Admin routes
router.post("/student/register", authMiddleware, adminMiddleware,  createStudent);
router.get("/students", authMiddleware, adminMiddleware, getAllStudent);
router.patch("/assign-Class", authMiddleware, adminMiddleware, assignClassToStudent);


module.exports = router;
