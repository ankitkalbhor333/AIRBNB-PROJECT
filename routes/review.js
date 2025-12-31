import express from "express";


import { isLoggedIn } from "../middleware.js"
import { isReviewAuthor } from "../middleware.js";

import reviewcontroller from "../controllers/review.js"
const router = express.Router({ mergeParams: true });

// Create review
router.post("/",isLoggedIn,reviewcontroller.createReview );

// Delete review
router.delete("/:reviewId",isReviewAuthor,reviewcontroller.destroyReview );

export default router;
