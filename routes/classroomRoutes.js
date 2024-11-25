const express = require('express');
const router = express.Router()

// import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// import controllers
const { createClassroom, getAllClassrooms, assignTeacher, removeTeacherFromClassroom } = require("../controllers/classroomController");

//Creating All admin Endpoints for classrooms
router.post('/create-classroom', authMiddleware, adminMiddleware, createClassroom);
router.get('/classrooms', authMiddleware, adminMiddleware, getAllClassrooms);
router.patch('/assign-Teacher', assignTeacher)

router.delete('/delete-teacher', removeTeacherFromClassroom);



module.exports = router