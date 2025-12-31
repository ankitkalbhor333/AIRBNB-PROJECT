import List from "../models/listing.js"
import Review from "../models/review.js";


///create new review
const createReview=async (req, res) => {
  console.log("User creating review:", req.user);
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send("Listing not found");
console.log(req.body.review)
    const newReview = new Review({
      ...req.body.review,
      author: req.user._id
    });
    console.log("New review before save:", newReview);
    await newReview.save();
    console.log("New review after save:", newReview);
    const savedReview = await Review.findById(newReview._id);
    console.log("Saved review from DB:", savedReview);
  
    list.reviews.push(newReview._id);
    await list.save();

    res.redirect(`/listings/${list._id}`);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).send("Something went wrong");
  }
}

//destroy created review
const destroyReview=async (req, res) => {
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
}

export default {createReview,destroyReview}