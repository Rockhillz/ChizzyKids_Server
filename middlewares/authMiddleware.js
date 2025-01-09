// const jwt = require('jsonwebtoken');

// // Middleware for verifying JWT token
// exports.authMiddleware = (req, res, next) => {
//     // Retrieve token from Authorization header

//   const authHeader = req.header('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
//   console.log('Authorization Token:', token);

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded JWT:", decoded);
//     req.teacher = decoded; // Attach decoded user info to request
//     console.log(req.user);
    
//     next();
    
//   } catch (err) {
//     console.error('JWT Verification Error:', err.message);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// }

const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); // Import Teacher model
const Student = require('../models/Student'); // Import Student model

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; 
  console.log('Authorization Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // Check if the user is a teacher
    const teacher = await Teacher.findById(decoded.teacherId);
    if (teacher) {
      req.teacher = teacher; 
      console.log(req.teacher);
      return next();
    }

    // Check if the user is a student
    const student = await Student.findById(decoded.userId);
    if (student) {
      req.student = student;
      return next();
    }

    // If neither teacher nor student found
    res.status(403).json({ message: 'Unauthorized role' });

  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
