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

// Get a single review
exports.getSingleReview = async (req, res) => {
    const { id } = req.params
    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(review);
    } catch (error) {
        console.log("Unexpected error: ", error);
    }
}

//delete a single review
exports.deleteReview = async (req, res) => {
    const { id } = req.params

    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

