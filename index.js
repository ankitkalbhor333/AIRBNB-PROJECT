import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js"
import List from "./models/listing.js";
import Review from "./models/review.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import flash from "connect-flash"
 import session from "express-session"
 import passport from "passport"
 import LocalStrategy from "passport-local"
import Wrapasync from "./utils/Wrapasync.js";
import ExpressError from "./utils/Expresserror.js";
// import listingSchema from "./models/listing.js"
// import {listjoiSchema} from "./schema.js";
// import {reviewjoiSchema}  from  "./schema.js"
import listRoutes from "./routes/listing.js"
import userRoutes from "./routes/userRouter.js"
const app = express();
 let sessionoption={
  secret:"ankitkal",
  resave:false,
  saveUninitialized: true
}
app.use(flash())
app.use(session(sessionoption))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// //app.use("/listings/:id/reviews", reviewRoutes); 
app.use((req,res,next)=>{
  res.locals.listingmsg=req.flash("success")
    res.locals.errormsg=req.flash("error")

  next()
}) 
//demouser
app.get("/demouser",async (req,res)=>{
  let fakeUser=new User({
    email:"ankit@gmail.com",
    username:"ankitfgjrgo"
  })
 let registeruser= await User.register(fakeUser,"ankitkalbhor")
  res.send(`registered user ${registeruser}`)
})
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

app.use("/listings", listRoutes);
app.use("/",userRoutes)




// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://localhost:27017/Airbnb");
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ DB connection error:", error));

// ---------------- ROUTES ----------------
//session


// Root route
app.get("/", (req, res) => {
  res.send("Root is working");
});



// const validatelisting=(req,res,next)=>{
//    const { error } = listjoiSchema.validate(req.body);
//   if (error) {
//     // Throw validation error to be caught by error middleware
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }else{
//     next()
//   }
// }
// const validateReview=(req,res,next)=>{
//    const { error } = reviewjoiSchema.validate(req.body);
//   if (error) {
//     // Throw validation error to be caught by error middleware
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }else{
//     next()
//   }
// }








//review post rewquest handling
app.post("/listings/:id/reviews", async (req, res) => {
  try {
    const list = await List.findById(req.params.id); // ✅ use req.params.id
    if (!list) {
      return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review);
    console.log(req.body.review)
    console.log(newReview)

   
    await newReview.save();
 list.reviews.push(newReview._id)
     // ✅ push after saving
    await list.save();

    res.redirect(`/listings/${list._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});
///delete route


app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
        await Review.findByIdAndDelete(reviewObjectId );
    await List.findByIdAndUpdate(id, {
  $pull: { reviews: reviewObjectId  }
});



    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).send("Something went wrong while deleting the review.");
  }
});





// ---------------- ERROR HANDLING ----------------

// Catch-all for non-existing routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Centralized error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { status, message, err });
});


// ---------------- START SERVER ----------------
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
