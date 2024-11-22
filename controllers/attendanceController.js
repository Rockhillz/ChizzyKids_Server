const mongoose = require('mongoose');
const Attendance = require('../models/Attendance'); 
const Classroom = require ("../models/Classroom");


// POST /attendance/mark: Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, remarks } = req.body;

    // Ensure required fields are provided
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate the date format
    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    if (!isValidDate(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use a valid date.' });
    }

    // Create and save the attendance record
    const attendance = new Attendance({
      studentId,
      classId,
      date,
      status,
      remarks,
    });

    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

// fetch all attendance information
exports.getAllAttendance = async ( req, res ) => { 
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).json({ success: true, attendanceRecords });;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all attendance', error });
  }
}

// GET /attendance/student/:id: Get student attendance by ID
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id; // Extract studentId from the route parameters

    // Validate if studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid studentId provided' });
    }

    // Fetch attendance records for the given student
    const attendanceRecords = await Attendance.find({ studentId }).populate('classId');

    // Check if any attendance records exist
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ success: false, message: 'No attendance records found for this student' });
    }

    res.status(200).json({ success: true, attendanceRecords });
  } catch (error) {
    console.error('Error retrieving student attendance:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error retrieving student attendance', error });
  }
};



// GET /attendance/class/:id: Get class attendance by ID
exports.getClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id;

    // Fetch attendance records for the given class
    const attendanceRecords = await Attendance.find({ classId }).populate(
      'studentId',
    
    );
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving class attendance', error });
  }
};

module.exports = exports;
