const express = require('express');
const router = express.Router();

// Import routes
const { generateStudentReport } = require("../controllers/reportController");

router.get("/report/:studentId/:termId", generateStudentReport);

module.exports = router;