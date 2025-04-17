const express = require('express');
const router = express.Router()

const multer = require('multer'); // Import Multer for file uploads
const fs = require('fs');
const path = require('path');

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import controllers
const { createTeacher, loginTeacher, getAllTeachers, singleTeacherProfile, updateTeacherProfile, assignteeSub, deleteTeacher, requestPasswordReset, resetPassword, sendMail} = require('../controllers/TeacherController')


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



// Creating endpoints for teachers routes.
router.post('/loginTeacher', loginTeacher);  // loginTeacher
router.patch('/updateTeacher/:teacherId', authMiddleware, updateTeacherProfile); // updateTeacher

// Forgot Password route
router.post("/teacher/request-reset", requestPasswordReset);
router.post("/teacher/reset-password", resetPassword);


// Admin endpoints routes
router.get('/singleTeacher/:teacherId', authMiddleware, singleTeacherProfile);  // Get single teacher profile by id
router.post('/register/teacher', authMiddleware, adminMiddleware, upload.single('image'), createTeacher);
router.patch('/assign/Teacher-To-Subject', authMiddleware, adminMiddleware, assignteeSub)  // Assign teacher to a subject
router.get('/getAllTeachers', authMiddleware, adminMiddleware, getAllTeachers);
router.delete('/deleteTeacher/:teacherId', authMiddleware, adminMiddleware, deleteTeacher);

router.post('/send-mail', sendMail)



module.exports = router