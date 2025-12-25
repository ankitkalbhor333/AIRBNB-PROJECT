import express from "express";
import List from "../models/listing.js";
import ExpressError from "../utils/Expresserror.js";
const app = express();
const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(methodOverride("_method"));
// Show all listings
router.get("/", async (req, res) => {
  const allisting = await List.find({});
  res.render("listings", { allisting });
});

// Create new listing form
router.get("/addnew", (req, res) => {
  res.render("listings/listnewItem");
});

// Handle new listing submission
router.post("/", async (req, res) => {
  const { title, description, image, price, location, country } = req.body;
  const newListing = new List({
    title,
    description,
    image: { url: image },
    price,
    location,
    country,
  });
  await newListing.save();
  res.redirect("/listings");
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);
  if (!list) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { list });
});

// Update listing
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body;

  const updatedList = await List.findByIdAndUpdate(
    id,
    { title, description, image: { url: image }, price, location, country },
    { new: true, runValidators: true }
  );

  if (!updatedList) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
});

// Show single listing
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const singleitems = await List.findById(id).populate("reviews");
  if (!singleitems) throw new ExpressError(404, "Listing not found");
  res.render("listings/singlelist", { singleitems });
});

// Delete listing
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedItem = await List.findByIdAndDelete(id);
  if (!deletedItem) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
});

export default router;
