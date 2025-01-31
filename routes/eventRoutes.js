const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import Multer for file uploads
const fs = require('fs');
const path = require('path');

// Import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent} = require('../controllers/eventController')

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// MULTER middleware configuration setup for file uploads
const storage = multer.memoryStorage(); // Use memory storage

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);
    }
  },
});

// --------------------------  MULTER --------------------------------

// Creating admin endpoints for events routes.
router.post('/createEvent', authMiddleware, adminMiddleware, upload.single('image'), createEvent);
router.get('/events', getAllEvents);
router.get('/event/:eventId', getSingleEvent);
router.patch('/updateEvent/:eventId', authMiddleware, adminMiddleware, updateEvent);
router.delete('/deleteEvent/:eventId', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router; 