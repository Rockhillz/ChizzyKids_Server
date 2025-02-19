const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import Multer for file uploads
const fs = require('fs');
const path = require('path');

// Import middlewares
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');


// Import controllers
const { createGalleryImage, updateGalleryImage, getAllGalleryImages, getSingleGalleryImage, deleteGalleryImage, getGalleryPageImages } = require('../controllers/galleryController');


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


// Routes
router.post('/createGallery', authMiddleware, adminMiddleware, upload.single('image'), createGalleryImage)

router.patch('/updateGallery/:galleryId', authMiddleware, adminMiddleware, upload.single('image'), updateGalleryImage)

router.get('/gallery', getAllGalleryImages)

router.get('/single-gallery/:galleryId', getSingleGalleryImage)

router.delete('/deleteGallery/:galleryId', authMiddleware, adminMiddleware, deleteGalleryImage)

router.get('/gallery/galleryPage', getGalleryPageImages)


module.exports = router;