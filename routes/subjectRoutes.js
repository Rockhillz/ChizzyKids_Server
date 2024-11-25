const express = require('express');
const router = express.Router();

//Import Middleware

const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createSubject, getSubjects, assignSubjectToClass } = require('../controllers/subjectController');

// Creating All admin Endpoints for subjects
router.post('/createSubject', createSubject);
router.get('/subjects', getSubjects);
router.patch('/assignSubjects', assignSubjectToClass);

module.exports = router;
