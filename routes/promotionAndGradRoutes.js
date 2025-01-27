const express = require('express');
const router = express.Router();

// Import middlewares

const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

const { promoteStudents } = require('../controllers/promotionAndGradController');

router.post('/promoteStudents', authMiddleware, adminMiddleware, promoteStudents);

module.exports = router;