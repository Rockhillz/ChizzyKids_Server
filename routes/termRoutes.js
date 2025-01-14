const express = require('express');
const router = express.Router();

// import middleware
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");

//Import controllers
const { createTerm, getCurrentTerm } = require("../controllers/termController");

// import routes

router.post('/createTerm', authMiddleware, adminMiddleware, createTerm);

// get current term
router.get('/currentTerm-and-session', authMiddleware, getCurrentTerm);


module.exports = router;

