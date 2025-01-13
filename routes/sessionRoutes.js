const express = require('express');
const router = express.Router();

// Import Middleware
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createSession } = require('../controllers/sessionController');

// import routes

router.post('/createSession', authMiddleware, adminMiddleware, createSession);

module.exports = router;