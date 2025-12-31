import User from "../models/user.js";


const renderSignup=async (req, res) => {
     res.render("users/signup.ejs")
}

const Signup=async (req,res)=>{
try{
    let {username,email,password}=req.body
  const newUser=new User({email,username})
  const registeruser=await User.register(newUser,password)
  console.log(registeruser)
  req.login(registeruser,(err)=>{
    if(err){
      return next(err)
    }
    req.flash("success","welcome to website after lsign up and login ")
    res.redirect("/listings")
  })
}catch(e){

req.flash("error",e.message)
res.redirect("/signup")
}
}

const renderloginfrom=(req,res)=>{
  console.log("GET /login requested");
  res.render("users/login.ejs")
}


const Login=(req,res)=>{
    console.log("Login successful for user:", req.user.username);
    req.flash("success","welcome back to website")
    let redirect=res.locals.redirectUrl || "/listings"
    res.redirect( redirect)
}


const Logout=(req,res,next)=>{
req.logout((err)=>{
  if(err){
    return next(err)
  }
  req.flash("success","you are logged out!")
  res.redirect("/listings")
})
}

export default {renderSignup,Signup,renderloginfrom,Login,Logout}