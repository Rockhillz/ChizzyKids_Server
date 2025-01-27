const express = require('express');
const router = express.Router();

// Import middlewares

const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent} = require('../controllers/eventController')

// Creating admin endpoints for events routes.
router.post('/createEvent', authMiddleware, adminMiddleware, createEvent);
router.get('/events', getAllEvents);
router.get('/event/:eventId', getSingleEvent);
router.patch('/updateEvent/:eventId', authMiddleware, adminMiddleware, updateEvent);
router.delete('/deleteEvent/:eventId', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router; 