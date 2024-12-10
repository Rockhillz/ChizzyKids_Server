const express = require('express');
const router = express.Router();

//Import Middleware

const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createSubject, getSubjects, assignSubjectToClass, deleteSubject, getSubjectsByStudent } = require('../controllers/subjectController');

router.get('/student-subjects/:studentId', getSubjectsByStudent);


// Creating All admin Endpoints for subjects
router.post('/createSubject', authMiddleware, adminMiddleware, createSubject);
router.get('/subjects', authMiddleware, adminMiddleware, getSubjects);
router.patch('/assignSubjects', authMiddleware, adminMiddleware, assignSubjectToClass);
router.delete('/deleteSubject/:subjectId', authMiddleware, adminMiddleware, deleteSubject);

module.exports = router;
