
const express = require('express');
const router = express.Router();

// Importing controllers

const { updateMarks, finalizeMarks, getMarksByStudent, getMarksBySubject, unfinalizeMarks} = require('../controllers/markController');

// Update marks for a student in a subject
router.post('/mark/update', updateMarks);

// Finalize marks for a student in a subject
router.patch('/mark/finalize', finalizeMarks);

// Unfinalize marks for a student in a subject
router.patch('/mark/unfinalize', unfinalizeMarks);

// Get marks for a specific subject
router.get('/mark/:subjectId', getMarksBySubject);

// Get marks for a specific student
router.get('/mark/student/:studentId', getMarksByStudent);

module.exports = router;
