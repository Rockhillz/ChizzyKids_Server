const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
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
    console.log("role: ", teacher.role);
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
    console.log("Teacher Role at Login:", teacher.role);

    res.status(200).json({ message: `Login successful`, token, teacher });
  } catch (err) {
    console.log("Error: ", err);
  }
};

//Logout Teacher
exports.logoutTeacher = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    // Decode the token to verify its validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Store the token in a blacklist
    await TokenBlacklist.create({ token });

    // Send a success response
    return res
      .status(200)
      .json({ message: "Teacher successfully logged out." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while logging out." });
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

// Assign TEacher to subject
exports.assignteeSub = async (req, res) => {
  const {teeId, subId} = req.body;

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

    // Validate if the subject is already in the teacher's subjects array
    if (teacherObj.subjects.includes(subId)) {
      return res.status(400).json({ message: "This subject is already assigned to the teacher" });
  }
    
    // Assign teacher to subject
    teacherObj.subjects.push(subjectObj._id);
    await teacherObj.save();
    res.status(200).json({ message: "Teacher assigned to subject successfully" });

 } catch (error) {
   console.log("Error: ", error);
 }
}

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

// delete teacher
exports.deleteTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.log("Unexpected error: ", error);
  }
};

// get single teacher
exports.singleTeacherProfile = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: `Teacher Profile fetched successfully`, teacher });
    } catch (error) {
    console.log("Unexpected error: ", error);
    }
}