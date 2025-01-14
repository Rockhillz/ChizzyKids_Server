exports.validateAttendance = (req, res, next) => {
  const { classroomId, attendance, term } = req.body;

  if (!classroomId || !term || typeof attendance !== "object") {
    return res.status(400).json({ success: false, message: "Invalid data. Classroom ID, term, and attendance are required." });
  }

  const isValidAttendance = Object.values(attendance).every((status) =>
    ['Present', 'Absent'].includes(status)
  );

  if (!isValidAttendance) {
    return res.status(400).json({ success: false, message: "Invalid attendance status. Only 'Present' or 'Absent' are allowed." });
  }

  next();
};
