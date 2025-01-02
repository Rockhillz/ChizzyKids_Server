
const express = require('express');
const router = express.Router();

// Importing controllers

const { updateMarks, finalizeMarks, getMarksByStudent, getMarksBySubject} = require('../controllers/markController');

// Update marks for a student in a subject
router.post('/update', updateMarks);

// Finalize marks for a student in a subject
router.post('/finalize', finalizeMarks);

// Get marks for a specific subject
router.get('/:subjectId', getMarksBySubject);

// Get marks for a specific student
router.get('/student/:studentId', getMarksByStudent);

module.exports = router;
