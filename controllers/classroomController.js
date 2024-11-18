const Classroom = require("../models/Classroom");
const Teacher = require("../models/Teacher");

// Create classrooms
exports.createClassroom = async (req, res) => {
    const { className } = req.body;

    try {
        //Check if classroom exist
        const existingClassroom = await Classroom.findOne({ className });
        if (existingClassroom) {
            return res.status(400).json({ message: "Classroom already exists" });
        }
        
        // Create a new classroom
        const newClassroom = new Classroom({ className });
        await newClassroom.save();
        res.status(200).json({ message: "Classroom successfully created", newClassroom });
    } catch (error) {
        console.log("Unexpected error: ",error)
    }
}

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.status(200).json({ classrooms });
    } catch (error) {
        console.log("Unexpected error: ", error);
    }
}

// Assign a Teacher to the classroom
exports.assignTeacher = async (req, res) => {
    const { teacherId, classroomId } = req.body;

    try {
        // Check if teacher and classroom exist
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        
        // Assign the teacher to the classroom
        classroom.teacher = teacherId;
        await classroom.save();
        res.status(200).json({ message: "Teacher assigned successfully", classroom });


    } catch (error) {
        console.log("Unexpected error: ", error);
    }
}