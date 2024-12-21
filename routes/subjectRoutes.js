const express = require('express');
const router = express.Router();

//Import Middleware

const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createSubject, getAllSubjects, assignSubjectToClass, deleteSubject, getSubjectsByStudent, singleSubject } = require('../controllers/subjectController');

router.get('/student-subjects/:studentId', getSubjectsByStudent);


// Creating All admin Endpoints for subjects
router.post('/createSubject', authMiddleware, adminMiddleware, createSubject);
router.get('/subjects', authMiddleware, adminMiddleware, getAllSubjects);
router.patch('/assignSubjects', authMiddleware, adminMiddleware, assignSubjectToClass);
router.delete('/deleteSubject/:subjectId', authMiddleware, adminMiddleware, deleteSubject);

router.get('/single-subject/:subjectId', singleSubject);

module.exports = router;
