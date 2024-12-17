const express = require('express');
const router = express.Router()
const multer = require('multer'); // Import Multer for file uploads

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controllers
const { createStudent, loginStudent, assignClassToStudent, singleStudentProfile, getAllStudent, updateStudentProfile, requestPasswordReset, resetPassword,  deleteStudent } = require("../controllers/studentController");

// MULTER middleware configuration setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary local upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

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
router.post("/student/register", authMiddleware, adminMiddleware, upload.single('image'),  createStudent);
router.get("/students", authMiddleware, adminMiddleware, getAllStudent);
router.patch("/assign-Class", authMiddleware, adminMiddleware, assignClassToStudent);
router.delete("/delete/:studentId", authMiddleware, adminMiddleware, deleteStudent); // Delete Student


module.exports = router;
