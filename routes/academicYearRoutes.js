const express = require('express');
const router = express.Router();

// Import Middleware
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createAcademicYear, setActiveTerm } = require('../controllers/academicController');

router.post('/createAcademicYear', createAcademicYear)
router.patch('/setActiveTerm', authMiddleware, adminMiddleware, setActiveTerm)

module.exports = router;