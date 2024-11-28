const Student = require("../models/Student");
const Classroom = require("../models/Classroom");
const generateStudentID = require("../utilities/studentIDGenerator");
const generateEmail = require("../utilities/generateSchoolEmail")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



// Creating Endpoints for students.

// Create a new student
exports.createStudent = async (req, res) => {
    // get the student properties
    const { fullname, password, image, address, parents_name, parent_no, gender, dateOfBirth } = req.body

    try {
        // Check if user already exists
        const existingFullname = await Student.findOne({ fullname });
        if (existingFullname) {
            return res.status(400).json({ message: "User  already exists" });
        }

        //Generate unique email and Student ID
        const email = generateEmail(fullname);
        const studentID = generateStudentID(new Date().getFullYear());

        // Create new user
        const newStudent = new Student({ fullname, password, image, email, studentID, address, parents_name, parent_no, gender, dateOfBirth  });
       
        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully', newStudent });

    } catch (error) {
        console.log("Error occuring: ",error)
        res.status(500).json({ message: "Server error" });
    }
}

// Get all students
exports.getAllStudent = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({ students });
    } catch (error) {
        console.log("Error occuring: ", error)
        res.status(500).json({ message: "Server error" });
    }
}

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
        const token = jwt.sign(
            { studentId: student._id},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: `Login successful`, token, student });
    } catch (error) {
        
    }
}

//logout student
exports.logoutStudent = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];

        // Decode the token to verify its validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Store the token in a blacklist
        await TokenBlacklist.create({ token });

        // Send a success response
        return res.status(200).json({ message: 'Student successfully logged out.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while logging out.' });
    }
}

//Update student profile
exports.updateStudentProfile = async (req, res) => {
    // Destructure
    const { fullname, image, address, parents_name, parent_no, dateOfBirth } = req.body;
    const { studentId } = req.params

    try {

        //find and update
        const updatedStudent = await Student.findByIdAndUpdate(studentId, {
            fullname, 
            image, 
            address, 
            parents_name, 
            parent_no, 
            dateOfBirth
        }, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Send updated student data
        res.status(200).json({ message: "Student profile updated successfully", updatedStudent });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }

}

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
        const classroom = await Classroom.findById(classId).populate('subjects');
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Assign the class to the student
        student.classroom = classroom._id;

        // Add class subjects to the student (avoiding duplicates)
        const classSubjects = classroom.subjects.map(subject => subject._id);
        student.subjects = [...new Set([...student.subjects, ...classSubjects])];

        await student.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Student assigned to classroom and subjects updated", student });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error u" });
    }
};


//Forget Password 