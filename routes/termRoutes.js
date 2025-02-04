const express = require('express');
const router = express.Router();

// import middleware
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");

//Import controllers
const { createTerm, getAllTermsForSession, getCurrentTermAndSession } = require("../controllers/termController");

// import routes

router.post('/createTerm', authMiddleware, adminMiddleware, createTerm);

// get current term
router.get('/currentTerm-and-session', authMiddleware, getCurrentTermAndSession);

// get all terms for a specific session

router.get('/session/terms/:sessionId', authMiddleware, adminMiddleware, getAllTermsForSession);

 // get all terms

// router.get('/terms', authMiddleware, adminMiddleware, getAllTerms);


module.exports = router;

