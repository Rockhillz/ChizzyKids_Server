
// Importing routes
const express = require('express');
const { markAttendance, getStudentAttendance, getClassAttendance, getAllAttendance } = require('../controllers/attendanceController');
const router = express.Router();

// Defining routes for attendance management
// router.post('/mark', markAttendance);
// router.get('/getAll', getAllAttendance);
// router.get('/student/:id', getStudentAttendance);
// router.get('/class/:id', getClassAttendance);

module.exports = router;
