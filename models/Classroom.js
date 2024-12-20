const mongoose = require('mongoose');
const Student = require('./Student');
const Subject = require('./Subject');

const classSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },

    students: [{type: mongoose.Schema.Types.ObjectId,
             ref: 'Student'}],

    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }]
});

// Middleware to update students when subjects are added to a class
classSchema.post('save', async function (doc, next) {
    try {
        // Fetch all students in the class
        const students = await Student.find({ classroom: doc._id });

        if (students.length > 0) {
            const newSubjectIds = doc.subjects;

            for (const student of students) {
                // Avoid adding duplicate subjects
                const currentSubjectIds = student.subjects.map(subject => subject.toString());
                const subjectsToAdd = newSubjectIds.filter(subjectId => !currentSubjectIds.includes(subjectId.toString()));

                if (subjectsToAdd.length > 0) {
                    student.subjects.push(...subjectsToAdd);
                    await student.save(); // Save each student's updated subjects
                }
            }
        }

        next(); // Proceed to the next middleware or operation
    } catch (err) {
        console.error('Error updating student subjects:', err);
        next(err); // Pass the error to Mongoose
    }
});

// Middleware to update subjects when students are added to a class
classSchema.post('save', async function (doc, next) {
    try {
        // Fetch all students in the class
        const students = await Student.find({ classroom: doc._id });

        if (students.length > 0) {
            const newSubjectIds = doc.subjects;

            for (const subjectId of newSubjectIds) {
                const subject = await Subject.findById(subjectId);

                if (subject) {
                    // Avoid adding duplicate students
                    const currentStudentIds = subject.students.map(studentId => studentId.toString());
                    const studentsToAdd = students
                        .map(student => student._id.toString())
                        .filter(studentId => !currentStudentIds.includes(studentId));

                    if (studentsToAdd.length > 0) {
                        subject.students.push(...studentsToAdd);
                        await subject.save(); // Save the updated subject
                    }
                }
            }
        }

        next(); // Proceed to the next middleware or operation
    } catch (err) {
        console.error('Error updating subject students:', err);
        next(err); // Pass the error to Mongoose
    }
});

module.exports = mongoose.model('Classroom', classSchema);
