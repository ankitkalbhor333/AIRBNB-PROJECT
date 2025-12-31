import express from "express";
import {isLoggedIn,isOwner} from "../middleware.js";
import listingcontroller from "../controllers/listings.js"
import multer from "multer"
import {storage} from "../cloudConfig.js"
const router = express.Router();

const uploads=multer({storage})

//render all list
router.get("/", listingcontroller.index);

// Create new listing form
router.get("/addnew",isLoggedIn,listingcontroller.listingform );

// Handle new listing submission
router.post("/"  , isLoggedIn,uploads.single("image"),listingcontroller.newListpost  
);

// Edit form
router.get("/:id/edit",isLoggedIn,isOwner,listingcontroller.editForm  );

// Update listing
router.put("/:id",isLoggedIn,isOwner, uploads.single("image"),listingcontroller.updateListing );

// Show single listing
router.get("/:id",isLoggedIn, listingcontroller.viewsingleList );

// Delete listing
router.delete("/:id",isLoggedIn, isOwner,listingcontroller.deleteitems );

export default router;
