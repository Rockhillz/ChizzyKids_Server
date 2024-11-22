const Review = require("../models/Review");

exports.createReview = async (req, res) => {

    const { title, body, rating } = req.body;

    try {

        const newReview = new Review({
            title,
            body,
            rating
        });

        await newReview.save();

        res.status(201).json({ message: "Review created successfully", review: newReview });

    } catch (error) {
        console.log("Unexpected error: ", error);
    }
}

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ reviews });
    } catch (error) {
        console.log("Unexpected error: ", error);
    }
}