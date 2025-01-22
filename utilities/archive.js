const Mark = require('../models/Mark');
const Attendance = require('../models/Attendance'); 
const Archive = require('../models/Archive');

// Archive Marks and Attendance for a specific term
const archiveTermData = async (termId) => {
  try {
    // Archive Marks data
    const marks = await Mark.find({ term: termId });
    if (marks.length > 0) {
      await Archive.insertMany(
        marks.map(mark => ({
          termId,
          type: 'Mark',
          data: mark.toObject(),  // Archive the Mark data
        }))
      );
    }

    // Archive Attendance data
    const attendanceRecords = await Attendance.find({ term: termId });
    if (attendanceRecords.length > 0) {
      await Archive.insertMany(
        attendanceRecords.map(record => ({
          termId,
          type: 'Attendance',
          data: record.toObject(),  // Archive the Attendance data
        }))
      );
    }

    console.log(`Data archived for term ${termId}`);
  } catch (error) {
    console.error("Error archiving term data:", error);
    throw error;  // Re-throw the error if archiving fails
  }
};

module.exports = { archiveTermData };
