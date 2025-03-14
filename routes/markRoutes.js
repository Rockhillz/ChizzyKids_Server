
const express = require('express');
const router = express.Router();

//Import middleware
const { authMiddleware } = require("../middlewares/authMiddleware");

// Importing controllersg
const { updateMarks, finalizeMarks, getMarksBySubject, unfinalizeMarks, getGradesByStudent, resetMarks, studentsSubjectMarks } = require('../controllers/markController');

// Update marks for a student in a subject
router.post('/mark/update', updateMarks);

// Finalize marks for a student in a subject
router.patch('/mark/finalize', finalizeMarks);

// Unfinalize marks for a student in a subject
router.patch('/mark/unfinalize', unfinalizeMarks);

// Get marks for a specific subject
router.get('/mark/:subjectId', getMarksBySubject);

// Get marks for a specific student
router.get('/student/grades/:studentId', authMiddleware, getGradesByStudent)

// Reset marks for a student in a subject
router.post("/mark/reset", authMiddleware, resetMarks);

router.get("/marks-by-subject/:subjectId", authMiddleware, studentsSubjectMarks)


module.exports = router;