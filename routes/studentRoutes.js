const express = require('express');
const router = express.Router()
const multer = require('multer'); // Import Multer for file uploads
const fs = require('fs');
const path = require('path');



//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controllers
const { createStudent, loginStudent, assignClassToStudent, singleStudentProfile, getAllStudent, updateStudentProfile, requestPasswordReset, resetPassword,  deleteStudent } = require("../controllers/studentController");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// MULTER middleware configuration setup for file uploads
const storage = multer.memoryStorage(); // Use memory storage

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);
    }
  },
});

// --------------------------  MULTER --------------------------------


// Creating Endpoints for students.
router.post("/student/login", loginStudent);  // Login Student
router.patch("/update-Student/:studentId", authMiddleware, updateStudentProfile); // Update Student Profile

// Forgot Password routes
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


// Admin routes
router.get("/single-student/:studentId", authMiddleware, singleStudentProfile); // Get Single Student Profile
router.post("/register/student", authMiddleware, adminMiddleware, upload.single('image'),  createStudent);
router.get("/students", authMiddleware, adminMiddleware, getAllStudent);
router.patch("/assign-Class", authMiddleware, adminMiddleware, assignClassToStudent);
router.delete("/delete/:studentId", authMiddleware, adminMiddleware, deleteStudent); // Delete Student


module.exports = router;
