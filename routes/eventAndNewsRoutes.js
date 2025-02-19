const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import Multer for file uploads
const fs = require('fs');
const path = require('path');

// Import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import Controller
const { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent, getLatestEvents, getLatestEventsPage, createNews, getAllNews, getLatestNews, getLatestNewsPage, deleteNews, updateNews, getSingleNews} = require('../controllers/eventAndNewsController')

// --------------------------  MULTER --------------------------------
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

// Get events routes
router.get('/events', getAllEvents);
router.get('/latest-events', getLatestEvents);
router.get('/events/eventsPage', getLatestEventsPage);


router.get('/event/:eventId', getSingleEvent);
router.patch('/updateEvent/:eventId', authMiddleware, adminMiddleware, upload.single('image'), updateEvent);
router.delete('/deleteEvent/:eventId', authMiddleware, adminMiddleware, deleteEvent);


// News Routes
router.post('/createNews', authMiddleware, adminMiddleware, createNews);
router.get('/news', getAllNews);
router.get('/single-news/:newsId', getSingleNews);

router.get('/latest-news', getLatestNews);
router.get('/news/newsPage', getLatestNewsPage);

router.delete('/deleteNews/:newsId', authMiddleware, adminMiddleware, deleteNews);
router.patch('/updateNews/:newsId', authMiddleware, adminMiddleware, updateNews);

module.exports = router;