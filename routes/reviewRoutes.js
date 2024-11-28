const express = require('express');
const router = express.Router();

const { createReview, getAllReviews, getSingleReview, deleteReview } = require('../controllers/reviewController');

router.post('/createReview', createReview);

router.delete('/deleteReview/:id', deleteReview);
router.get('/reviews', getAllReviews);
router.get('/singleReviews', getSingleReview)

module.exports = router;