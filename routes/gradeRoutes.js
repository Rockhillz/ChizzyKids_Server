const express = require('express');
const router = express.Router();

// Import routes
const { addGrade } = require('../controllers/gradeController');

// Defining routes for grade management

router.post('/addGrade', addGrade); // Add grade route for a student

module.exports = router;
