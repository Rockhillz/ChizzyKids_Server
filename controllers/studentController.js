const Student = require("../models/Student");
const Classroom = require("../models/Classroom");
const generateStudentID = require("../utilities/studentIDGenerator");
// const generateEmail = require("../utilities/generateSchoolEmail")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require('../utilities/cloudinary');



// Creating Endpoints for students.

// Create a new student
exports.createStudent = async (req, res) => {
  // get the student properties
  const {
    fullname,
    password,
    email,
    address,
    parents_name,
    parent_no,
    gender,
    dateOfBirth,
  } = req.body;

  const imgFile = req.file?.path; // Image file uploaded via Multer


  try {
    // Check if user already exists
    const existingFullname = await Student.findOne({ fullname });
    if (existingFullname) {
      return res.status(400).json({ message: "User  already exists" });
    }

    // Upload image to Cloudinary
    let image = '';
    if (imgFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile, {
        folder: 'students',
        resource_type: 'image',
      });
      image = uploadResult.secure_url; // Get the image URL from Cloudinary
    }

    //Generate unique email and Student ID
    // const email = generateEmail(fullname);
    const studentID = generateStudentID(new Date().getFullYear());

    // Create new user
    const newStudent = new Student({
      fullname,
      password,
      image,
      email,
      studentID,
      address,
      parents_name,
      parent_no,
      gender,
      dateOfBirth,
    });

    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student created successfully", newStudent });
  } catch (error) {
    console.log("Error occuring: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all students
exports.getAllStudent = async (req, res) => {
  try {
    const students = await Student.find({}).populate("classroom", "className");

    res.status(200).json({ students });
  } catch (error) {
    console.log("Error occuring: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login student
exports.loginStudent = async (req, res) => {
  //Destructure
  const { email, password } = req.body;

  try {
    // check student in database
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare hashed password with user password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: `Login successful`, token, student });
  } catch (error) {}
};

//Update student profile
exports.updateStudentProfile = async (req, res) => {
  // Destructure
  const { fullname, image, address, parents_name, parent_no, dateOfBirth } =
    req.body;
  const { studentId } = req.params;

  try {
    //find and update
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        fullname,
        image,
        address,
        parents_name,
        parent_no,
        dateOfBirth,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Send updated student data
    res
      .status(200)
      .json({
        message: "Student profile updated successfully",
        updatedStudent,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Assign student to a class
exports.assignClassToStudent = async (req, res) => {
  const { studentId, classId } = req.body; // Change 'studentID' to 'studentId'

  try {
    // Find the student using their object ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Find the class and populate the subjects
    const classroom = await Classroom.findById(classId).populate("subjects");
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Assign the class to the student
    student.classroom = classroom._id;

    // Add class subjects to the student (avoiding duplicates)
    const classSubjects = classroom.subjects.map((subject) => subject._id);
    student.subjects = [...new Set([...student.subjects, ...classSubjects])];

    await student.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({
        message: "Student assigned to classroom and subjects updated",
        student,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error u" });
  }
};

//delete student.
exports.deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find and delete the student
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Student deleted successfully", deletedStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// single student profile
exports.singleStudentProfile = async (req, res) => {
  //Destructure
  const { studentId } = req.params;

  try {
    // find and update
    const student = await Student.findById(studentId).populate(
      "classroom",
      "className"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Send updated student data
    res
      .status(200)
      .json({ message: "Student profile fetched successfully", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Forget Password endpoint
//First request token.
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the plain resetToken in the database
    student.resetPasswordToken = resetToken;
    // student.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

    await student.save();
    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email service
      auth: {
        user: "alasizuchukwu@gmail.com",
        pass: "vmso exyv rpkr lotd",
      },
    });

    await transporter.sendMail({
      from: "Alasizuchukwu@gmail.com",
      to: student.email,
      subject: "Password Reset Token",
      text: `Your password reset token is: ${resetToken}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "Reset token sent successfully" });

    // Send the token to the user via email or other means
    console.log(`Token sent: ${resetToken}`); // For debugging

  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(student)

    // Validate the token
    if (student.resetPasswordToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Update the password
    // console.log(password);
    student.password = password;
    // console.log("Hashed password: ",student.password);
    student.resetPasswordToken = undefined; // Clear the token after use

    await student.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
