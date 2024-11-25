const express = require('express');
const router = express.Router()

//import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import controllers
const { createTeacher, loginTeacher, getAllTeachers, logoutTeacher, updateTeacherProfile, assignteeSub,assignTeacherToSubject} = require('../controllers/TeacherController')

// Creating endpoints for teachers routes.
router.post('/loginTeacher', loginTeacher);  // loginTeacher
router.post('/logoutTeacher', authMiddleware, logoutTeacher);  //logoutTeacher
router.patch('/updateTeacher/:teacherId', authMiddleware, updateTeacherProfile); // updateTeacher

router.patch('/assignTeeSub', assignteeSub)  // Assign teacher to a subject


// Admin endpoints routes
router.post('/createTeacher', authMiddleware, adminMiddleware, createTeacher);
router.get('/getAllTeachers', authMiddleware, adminMiddleware, getAllTeachers);




module.exports = router