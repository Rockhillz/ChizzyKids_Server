const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const generateEmployeeID = require("../utilities/employeeIDGen");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const generateEmail = require("../utilities/generateSchoolEmail");
const cloudinary = require("../utilities/cloudinary");
const fs = require("fs");

// Create a new Teacher.........Working
exports.createTeacher = async (req, res) => {
  // Destructure teacher model.
  const {
    fullname,
    password,
    image,
    email,
    department,
    address,
    phone,
    gender,
    qualification,
    previous_school,
    dateOfBirth,
  } = req.body;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  try {
    // Check if teacher already exists.
    const existingFullname = await Teacher.findOne({ fullname });
    if (existingFullname) {
      return res.status(400).json({ message: "User  already exists" });
    }

    // Upload image to Cloudinary (from memory buffer)
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "ChizzyKids_DB/teachers", resource_type: "image" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(req.file.buffer);
        });
    
        const image = uploadResult.secure_url;

    // Generate unique employeeID and teacher Email.
    const employeeID = generateEmployeeID(new Date().getFullYear());
    // const email = generateEmail(fullname);

    // Create a new teacher
    const newTeacher = new Teacher({
      fullname,
      password,
      image,
      department,
      address,
      phone,
      gender,
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
    console.error("Catch error: ", error);
  }
};

// Login a Teacher........Working
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
    const token = jwt.sign(
      { teacherId: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    

    res.status(200).json({ message: `Login successful`, token, teacher });
  } catch (err) {
    console.error("Error: ", err);
  }
};

// Update Teacher profile
exports.updateTeacherProfile = async (req, res) => {
  // Destructure
  const { fullname, image, address, phone, qualification } = req.body;
  const { teacherId } = req.params;

  try {
    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        fullname,
        image,
        address,
        phone,
        qualification,
      },
      { new: true }
    );

    if (!updateTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res
      .status(200)
      .json({ message: "Teacher profile updated successfully", updateTeacher });
  } catch (err) {
    console.error("Error: ", err);
  }
};

// Get all Teachers..........Working
exports.getAllTeachers = async (req, res) => {
  try {

    const teachers = await Teacher.find().populate(
      "classroom",
      "className"
    );
    
    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

// Assign TEacher to subject......Working
exports.assignteeSub = async (req, res) => {
  const { teacherId, subjectId } = req.body;

  try {
    // Check if teacher exists
    const teacherObj = await Teacher.findById(teacherId);
    if (!teacherObj) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if subject exists
    const subjectObj = await Subject.findById(subjectId);
    if (!subjectObj) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Check if the subject has already been assigned to a teacher
    if (subjectObj.teacher) {
      return res.status(400).json({ message: "This subject is already assigned to another teacher" });
    }

    // Validate if the subject is already in the teacher's subjects array
    if (teacherObj.subjects.includes(subjectId)) {
      return res.status(400).json({ message: "This subject is already assigned to the teacher" });
    }

    // Assign subject to the teacher's subjects array
    teacherObj.subjects.push(subjectObj._id);
    await teacherObj.save();

    // Assign the teacher to the subject's teacher field
    subjectObj.teacher = teacherObj._id;
    await subjectObj.save();

    res.status(200).json({ message: "Teacher assigned to subject successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An unexpected error occurred", error: error.message });
  }
};



// Remove assigned teacher... Not added to the routes yet
exports.removeAssignedTeacher = async (req, res) => {
  const { teeId, subId} = req.body;

  try {
    // Check if teacher and subject exist
    const teacherObj = await Teacher.findById(teeId);
    if (!teacherObj) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const subjectObj = await Subject.findById(subId);
    if (!subjectObj) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Remove teacher from subject
    teacherObj.subjects = teacherObj.subjects.filter((subject) => subject.toString()!== subId);
    await teacherObj.save();
    res.status(200).json({ message: "Teacher removed from subject successfully" });

 } catch (error) {
   console.log("Error: ", error);
 }
}

// delete teacher..............Working
exports.deleteTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

// get single teacher.....Working
exports.singleTeacherProfile = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findById(teacherId)
  .populate("classroom", "className") // Populate classroom with only className
  .populate("subjects", "name"); // Populate subjects with only subjectName

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: `Teacher Profile fetched successfully`, teacher });
    } catch (error) {
    console.error("Unexpected error: ", error);
    }
}

//Forget Password endpoint
//First request token.
// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the plain resetToken in the database
    teacher.resetPasswordToken = resetToken;
    // student.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

    await teacher.save();
    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email service
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: teacher.email,
      subject: "Password Reset Token",
      text: `Your password reset token is: ${resetToken}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "Reset token sent successfully" });

  } catch (error) {;
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "User not found" });
    }
   

    // Validate the token
    if (teacher.resetPasswordToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Update the password
    // console.log(password);
    teacher.password = password;
    // console.log("Hashed password: ",student.password);
    teacher.resetPasswordToken = undefined; // Clear the token after use

    await teacher.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Email to principal
exports.sendMail = async (req, res) => {
  const { fullName, phone, subject, message } = req.body;

  if (!fullName || !phone || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: "izuchukwualaneme@gmail.com",
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #4a90e2;">📩 New Enquiry Submission</h2>
          <p><strong>Parent Name:</strong> ${fullName}</p>
          <p><strong>Parent Phone:</strong> ${phone}</p>
          <hr />
          <p style="white-space: pre-line;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email. Try again later." });
  }
};
