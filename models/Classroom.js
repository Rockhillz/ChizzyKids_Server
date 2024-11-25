const mongoose = require('mongoose');
const Student = require('./Student');

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
    

})

// Middleware to update students when subjects are added to a class
classSchema.post('save', async function (doc, next) {
    try {
        // Fetch all students in the class
        const students = await Student.find({ classroom: doc._id });

        // Check for students and update their subjects
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
        next(err); // Pass error to Mongoose
    }
});

module.exports = mongoose.model('Classroom', classSchema);