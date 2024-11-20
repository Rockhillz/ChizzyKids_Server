const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const generateEmployeeID = require("../utilities/employeeIDGen");
const generateEmail = require("../utilities/generateSchoolEmail");

// Create a new Teacher.
exports.createTeacher = async (req, res) => {
  // Destructure teacher model.
  const {
    fullname,
    password,
    image,
    department,
    address,
    phone,
    gender,
    contact_no,
    qualification,
    previous_school,
    dateOfBirth,
  } = req.body;

  try {
    // Check if teacher already exists.
    const existingFullname = await Teacher.findOne({ fullname });
    if (existingFullname) {
      return res.status(400).json({ message: "User  already exists" });
    }

    // Generate unique employeeID and teacher Email.
    const employeeID = generateEmployeeID(new Date().getFullYear());
    const email = generateEmail(fullname);

    // Create a new teacher
    const newTeacher = new Teacher({
      fullname,
      password,
      image,
      department,
      address,
      phone,
      gender,
      contact_no,
      qualification,
      previous_school,
      dateOfBirth,
      employeeID,
      email,
    });

    await newTeacher.save();
    res
      .status(200)
      .json({ message: "Teacher created successfully", newTeacher });
  } catch (error) {
    console.log("Catch error: ", error);
  }
};

// Login a Teacher.
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if teacher exists.
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare hashed password with user password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ teacherId: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: `Login successful`, token, teacher });
  } catch (err) {
    console.log("Error: ", err);
  }
};

// Get all Teachers

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ teachers });
  } catch (error) {
    console.log("Unexpected error: ", error);
  }
};

// Assign TEacher to subject schema
// Not working yet. Will circle back
exports.assignTeacher = async (req, res) => {
  const { teacherId, subjectId } = req.body;

  try {
    // Check if teacher and subject exist
      const teacher = await Teacher.findById(teacherId);
      const subject = await Course.findById(subjectId);
    if (!teacher || !subject) {
      return res.status(404).json({ message: "Teacher or subject not found" });
    }

    // Assign the teacher to the subject
    subject.teacher = teacher._id;
    await subject.save();
    res.status(200).json({ message: "Teacher assigned successfully", subject });
  } catch (err) {
    console.log("Error: ", err);
  }
};