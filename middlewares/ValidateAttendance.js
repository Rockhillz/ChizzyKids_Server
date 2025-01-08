exports.validateAttendance = (req, res, next) => {
  const { classroomId, attendance } = req.body;

  if (!classroomId || typeof attendance !== "object") {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const isValidAttendance = Object.values(attendance).every((status) =>
    ['Present', 'Absent'].includes(status)
  );

  if (!isValidAttendance) {
    return res.status(400).json({ success: false, message: "Invalid attendance status" });
  }

  next();
};
