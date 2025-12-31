import express from "express";


import { saveRedirectUrl } from "../middleware.js"

import passport from "passport";
import userscontroller from "../controllers/user.js"

const router = express.Router();
router.get("/signup", userscontroller.renderSignup);

router.post("/signup",userscontroller.Signup)



router.get("/login",userscontroller.renderloginfrom)

router.post("/login",saveRedirectUrl,
  passport.authenticate("local",{failureRedirect:"/login",
  failureFlash:true,
  }),userscontroller.Login) 

router.get("/logout",userscontroller.Logout)






export default router;
