const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');

// POST /subjects - Create a new subject
router.post('/create-subject', createSubject);

// GET /subjects - Retrieve all subjects
router.get('/subjects', getSubjects);

module.exports = router;
