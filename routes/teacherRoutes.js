const express = require('express');
const router = express.Router()

const { createTeacher, loginTeacher, getAllTeachers, assignTeacher} = require('../controllers/TeacherController')

// Creating endpoints for teachers.
router.post('/createTeacher', createTeacher);
router.post('/loginTeacher', loginTeacher);
router.get('/getAllTeachers', getAllTeachers);

// Assigning teacher to a classroom
router.post('/subjects/assign-teacher', assignTeacher);




module.exports = router