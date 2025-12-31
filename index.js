import dotenv from "dotenv";
dotenv.config();
console.log("dotenv loaded at top");
import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js"
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import flash from "connect-flash"
 import session from "express-session"
 import MongoStore from "connect-mongo";
 import passport from "passport"
 import LocalStrategy from "passport-local"
// import Wrapasync from "./utils/Wrapasync.js";
import ExpressError from "./utils/Expresserror.js";
// import listingSchema from "./models/listing.js"
// import {listjoiSchema} from "./schema.js";
// import {reviewjoiSchema}  from  "./schema.js"
import listRoutes from "./routes/listing.js"
import userRoutes from "./routes/userRouter.js"
import reviewRoutes from "./routes/review.js"
const app = express();
let mongourl=process.env.MOONGO_URL;

const store=MongoStore.create({
  mongoUrl:mongourl,
  crypto:{
    secret:process.env.SECRET_KEY
  },
  touchAfter:24*3600,
})
 let sessionoption={
  store,
  secret:process.env.SECRET_KEY,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*100,
    maxAge:7*24*60*60*1000,
    httpOnly:true, 
  }
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
res.locals.currUser=req.user;
  next()
}) 
//demouser
app.get("/demouser",async (req,res)=>{
  let fakeUser=new User({
    email:"piyush@gmail.com",
    username:"piyush"
  })
 let registeruser= await User.register(fakeUser,"piyush123")
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
app.use("/listings/:id/reviews", reviewRoutes);




// Connect to MongoDB
async function main() {
  await mongoose.connect(mongourl);
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ DB connection error:", error));

// ---------------- ROUTES ----------------
//session





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








///delete route








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
