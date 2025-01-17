const mongoose = require('mongoose');
const Attendance = require('../models/Attendance'); 
const Term = require('../models/Term');


// POST /attendance/mark: Mark attendance.... Working

exports.submitAttendance = async (req, res) => {
  try {
    const { classroomId, attendance, term } = req.body;
   

    // Validate inputs
    if (!classroomId || !attendance || !term) {
      return res.status(400).json({ success: false, message: 'Invalid input. Classroom ID, attendance, and term are required.' });
    }

    // Validate the term ID
    const termExists = await Term.findById(term);
    if (!termExists) {
      return res.status(404).json({ success: false, message: 'Invalid term ID.' });
    }

    // Prepare attendance records
    const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      classroomId,
      term, // Include the term ID in the attendance record
      date: new Date(),
      status,
    }));

    // Insert the attendance records into the database
    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({ success: true, message: 'Attendance recorded successfully.' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ success: false, message: 'Server error. Unable to record attendance.' });
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
    const { studentId } = req.params; // Extract studentId from the route parameters

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
