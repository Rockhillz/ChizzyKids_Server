const express = require('express');
const router = express.Router()

const { createTeacher, loginTeacher } = require('../controllers/TeacherController')

// Creating endpoints for teachers.
router.post('/createTeacher', createTeacher);
router.post('/loginTeacher', loginTeacher);

module.exports = router