const express = require('express');
const router = express.Router()

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import controllers
const { createTeacher, loginTeacher, getAllTeachers, singleTeacherProfile, updateTeacherProfile, assignteeSub, deleteTeacher, requestPasswordReset, resetPassword} = require('../controllers/TeacherController')

// Creating endpoints for teachers routes.
router.post('/loginTeacher', loginTeacher);  // loginTeacher
router.patch('/updateTeacher/:teacherId', authMiddleware, updateTeacherProfile); // updateTeacher

// Forgot Password route
router.post("/teacher/request-reset", requestPasswordReset);
router.post("/teacher/reset-password", resetPassword);



// Admin endpoints routes
router.get('/singleTeacher/:teacherId', authMiddleware, singleTeacherProfile);  // Get single teacher profile by id
router.post('/createTeacher', authMiddleware, adminMiddleware, createTeacher);
router.patch('/assignTeeSub', authMiddleware, adminMiddleware, assignteeSub)  // Assign teacher to a subject
router.get('/getAllTeachers', authMiddleware, adminMiddleware, getAllTeachers);
router.delete('/deleteTeacher/:teacherId', authMiddleware, adminMiddleware, deleteTeacher);



module.exports = router