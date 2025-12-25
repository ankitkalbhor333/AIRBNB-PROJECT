import express from "express";
import mongoose from "mongoose";
import List from "../models/listing.js";
import Review from "../models/review.js";

const router = express.Router({ mergeParams: true });

// Create review
router.post("/", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send("Listing not found");

    const newReview = new Review(req.body);
    console.log(newReview)
    await newReview.save();

    list.reviews.push(newReview._id);
    await list.save();

    res.redirect(`/listings/${list._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Delete review
router.delete("/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const reviewObjectId = new mongoose.Types.ObjectId(reviewId);

    await Review.findByIdAndDelete(reviewObjectId);
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewObjectId } });

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).send("Something went wrong while deleting the review.");
  }
});

export default router;
