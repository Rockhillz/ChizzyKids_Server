exports.validateAttendance = (req, res, next) => {
  const { classroomId, attendance } = req.body;

  if (!classroomId || typeof attendance !== "object") {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  next();
};
