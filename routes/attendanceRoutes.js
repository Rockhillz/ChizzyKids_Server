
const express = require('express');
const router = express.Router();

// Importing middleware
const { validateAttendance } = require('../middlewares/ValidateAttendance');

// Importing controllers
const {  getStudentAttendance, getClassAttendance, getAllAttendance, submitAttendance } = require('../controllers/attendanceController');

// Defining routes for attendance management
router.post('/attendance', validateAttendance, submitAttendance);
router.get('/getAllAttendance', getAllAttendance);
router.get('/student/:id', getStudentAttendance);
router.get('/class/:id', getClassAttendance);

module.exports = router;
