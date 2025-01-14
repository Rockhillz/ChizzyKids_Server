// const Grade = require('../models/Grade');
// const Student = require('../models/Student');
// const Subject = require('../models/Subject');
// const AcademicYear = require('../models/AcademicYear');
// const Teacher = require('../models/Teacher');


// exports.addGrade = async (req, res) => {
//     const { student, subject, academicYear, term, marks, remarks, teacher } = req.body;

//     try {
        
//         // Validate inputs
//         if (!student ||!subject ||!academicYear ||!term ||!marks ||!remarks) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // Check if student exists
//         const studentObj = await Student.findById(student);
//         if (!studentObj) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         // Check if subject exists
//         const subjectObj = await Subject.findById(subject);
//         if (!subjectObj) {
//             return res.status(404).json({ error: "Subject not found" });
//         }

//         // Check if academic year exists
//         const academicYearObj = await AcademicYear.findById(academicYear);
//         if (!academicYearObj) {
//             return res.status(404).json({ error: "Academic Year not found" });
//         }

//         // Check if teacher exists
//         const teacherObj = await Teacher.findById(teacher);
//         if (!teacherObj) {
//             return res.status(404).json({ error: "Teacher not found" });
//         }

//         // Create a new grade
//         const grade = new Grade({
//             student: studentObj._id,
//             subject: subjectObj._id,
//             academicYear: academicYearObj._id,
//             term,
//             marks,
//             remarks,
//             teacher: teacherObj._id,
//         });

//         // Save the grade to the database
//         await grade.save();
//         res.status(201).json({ message: "Grade added successfully", grade });


//     } catch (error) {
//         console.error
//         res.status(500).json({ error: "Failed to add grade" });
//     }
// }