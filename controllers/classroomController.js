const Classroom = require("../models/Classroom");
const Teacher = require("../models/Teacher");

// Create classrooms........Working
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

// Get all classrooms....... Working
exports.getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate('teacher', 'fullname') // Populate teacher field with the fullname field
            .populate('students', '_id')    // Optionally, you can just get student IDs if you don't need more data
            .populate('subjects', '_id');   // Optionally, you can just get subject IDs if you don't need more data

        // Transform classrooms to include counts for students and subjects
        const transformedClassrooms = classrooms.map(classroom => ({
            _id: classroom._id,
            className: classroom.className,
            teacher: classroom.teacher, // This will already contain the teacher's populated details
            studentsCount: classroom.students.length,
            subjectsCount: classroom.subjects.length,
        }));

        res.status(200).json({ classrooms: transformedClassrooms });
    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).json({ message: "Failed to fetch classrooms" });
    }
};


// Assign a Teacher to the classroom...... working
exports.assignTeacher = async (req, res) => {
    const { teacherId, classroomId } = req.body;

    try {
        // Check if teacher exists
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Check if classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Validate if the classroom already has a teacher assigned
        if (classroom.teacher) {
            return res.status(400).json({ message: "This classroom already has a teacher assigned" });
        }

        // Assign the teacher to the classroom
        classroom.teacher = teacherId;
        await classroom.save();

        // Optionally update the teacher record without triggering full validation
        await Teacher.updateOne(
            { _id: teacherId },
            { $set: { classroom: classroomId } }, // Only update classroom field
            { runValidators: false } // Skip full validation
        );

        // Respond with success
        res.status(200).json({ message: "Teacher assigned successfully", classroom });
    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
};


// Remove assigned teacher
exports.removeTeacherFromClassroom = async (req, res) => {
    const { classroomId } = req.body;

    try {
        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if a teacher is assigned to the classroom
        if (!classroom.teacher) {
            return res.status(400).json({ message: "No teacher is assigned to this classroom" });
        }

        // Remove the teacher assignment
        classroom.teacher = null;
        await classroom.save();

        res.status(200).json({ message: "Teacher removed from classroom successfully", classroom });
    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
};

// Get single classroom........Working

exports.getClassroomById = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId)
            .populate('teacher', 'fullname')
            .populate('students', 'fullname')
            .populate('subjects', 'name');

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.status(200).json({ classroom });
    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).json({ message: "Failed to fetch classroom" });
    }
};