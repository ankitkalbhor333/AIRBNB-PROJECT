import express from "express";



import User from "../models/user.js";

const router = express.Router();
router.get("/signup", async (req, res) => {
     res.render("users/signup.ejs")
});


router.post("/signup",async (req,res)=>{
  let {username,email,password}=req.body
  const newUser=new User({email,username})
  const registeruser=await User.register(newUser,password)
  console.log(registeruser)
  req.flash("success","welocme to my website ")
  res.redirect("/listings")
})

export default router;
