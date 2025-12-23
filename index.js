import express from "express";
import mongoose from "mongoose";
import List from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import Wrapasync from "./utils/Wrapasync.js";
import ExpressError from "./utils/Expresserror.js";

const app = express();

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://localhost:27017/Airbnb");
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ DB connection error:", error));

// ---------------- ROUTES ----------------

// Root route
app.get("/", (req, res) => {
  res.send("Root is working");
});

// Test route
app.get("/listing", Wrapasync(async (req, res) => {
  const samplelist = new List({
    title: "taj hotel",
    description: "itc taj",
    image: "",
    location: "bhopal",
    price: 12222,
    country: "india",
  });
  await samplelist.save();
  res.send("✅ Test listing saved");
}));

// Show all listings
app.get("/listings", Wrapasync(async (req, res) => {
  const allListing = await List.find({});
  res.render("listings/index", { allListing });
}));

// Create new listing form
app.get("/listings/addnew", (req, res) => {
  res.render("listings/listnewItem");
});

// Handle new listing submission
app.post("/listings", Wrapasync(async (req, res) => {
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
}));

// Edit form
app.get("/listings/:id/edit", Wrapasync(async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);
  if (!list) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { list });
}));

// Update listing
app.put("/listings/:id", Wrapasync(async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body;

  const updatedList = await List.findByIdAndUpdate(
    id,
    { title, description, image: { url: image }, price, location, country },
    { new: true, runValidators: true }
  );

  if (!updatedList) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
}));

// Show single listing
app.get("/listings/:id", Wrapasync(async (req, res) => {
  const { id } = req.params;
  const singleItem = await List.findById(id);
  if (!singleItem) throw new ExpressError(404, "Listing not found");
  res.render("listings/singlelist", { singleItem });
}));

// Delete listing
app.delete("/listings/:id", Wrapasync(async (req, res) => {
  const { id } = req.params;
  const deletedItem = await List.findByIdAndDelete(id);
  if (!deletedItem) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
}));

// ---------------- ERROR HANDLING ----------------

// Catch-all for non-existing routes
// Catch-all for unmatched routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


// Centralized error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" ,ExpressError} = err;
res.render("error.ejs",{status,message,err})
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
