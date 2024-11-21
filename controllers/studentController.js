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
    const { fullname, password, image, address, parents_name, contact_no, gender, dateOfBirth } = req.body

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
        const newStudent = new Student({ fullname, password, image, email, studentID, address, parents_name, contact_no, gender, dateOfBirth  });
       
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
    const { fullname, image, address, parents_name, contact_no, dateOfBirth } = req.body;
    const { studentId } = req.params

    try {
        const student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        } 

        // Update student profile
        student.fullname = fullname;
        student.image = image;
        student.address = address;
        student.parents_name = parents_name;
        student.contact_no = contact_no;
        student.dateOfBirth = dateOfBirth;

        await student.save();
        res.status(200).json({ message: "Student profile updated successfully", student });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }

}

//Assign student to a class
exports.assignClassToStudent = async (req, res) => {
    // Destructure
    const { studentID, classId } = req.body;

    try {
        // Check if student exists
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Check if classroom exists
        const classroom = await Classroom.findOne({className: classId});
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        
        // Assign classroom to student
        student.classroom = classroom._id;
        await student.save();

        // Add the student to the classroom's student list
        classroom.students.push(student._id);

        await classroom.save();

        res.status(200).json({ message: "Student assigned to classroom successfully" }); 


    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({ message: "Server error" });
    }
}

