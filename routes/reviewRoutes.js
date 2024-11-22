const express = require('express');
const router = express.Router();

const { createReview, getAllReviews } = require('../controllers/reviewController');

router.post('/createReview', createReview);
router.get('/reviews', getAllReviews);

module.exports = router;