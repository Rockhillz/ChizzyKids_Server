const express = require('express');
const router = express.Router()

// import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// import controllers
const { createClassroom, getAllClassrooms, assignTeacher, assignSubjectsToClass, removeTeacherFromClassroom, removeSubjectsFromClass, deleteClassroom, getClassroomById, getClassroomAssignedToTeacher, getSubjectsOfClass } = require("../controllers/classroomController");

//Creating All admin Endpoints for classrooms
router.post('/create-classroom', authMiddleware, adminMiddleware, createClassroom);
router.get('/classrooms', authMiddleware, adminMiddleware, getAllClassrooms);
router.get('/classroom/:classroomId', authMiddleware, adminMiddleware, getClassroomById);
router.patch('/assign-Teacher', authMiddleware, adminMiddleware, assignTeacher)

router.patch('/assign-subjects-classroom', authMiddleware, adminMiddleware, assignSubjectsToClass)
router.patch('/remove-subjects-classroom', authMiddleware, adminMiddleware, removeSubjectsFromClass);

router.delete('/delete-classroom/:ClassroomId', authMiddleware, adminMiddleware, deleteClassroom);

router.get('/subjects-of-class/:ClassroomId', authMiddleware, adminMiddleware, getSubjectsOfClass);

router.get('/classrooms-assigned-to-teacher', authMiddleware, getClassroomAssignedToTeacher);

router.patch('/classroom/remove-teacher', removeTeacherFromClassroom);



module.exports = router