exports.adminMiddleware = (req, res, next) => {
    try {
     if (req.teacher.role !== 'admin') {
      console.log("req.teacher:", req.teacher);
       return res.status(401).json({ message: 'Unauthorized Access' });
     }
     next();
    }
    catch (err) {
     console.error(err);
     res.status(500).json({ message: "Server error" });
    }
 } 