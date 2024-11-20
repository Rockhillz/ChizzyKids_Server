const express = require('express');
const router = express.Router();

const { createMessage, getMessages } = require('../controllers/annoucementController');

// Routes
router.post('/sendMessage', createMessage);
router.get('/getMessages', getMessages);

module.exports = router;