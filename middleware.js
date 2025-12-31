import List from "./models/listing.js"
import Review from "./models/review.js"

const isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl
    req.flash("error","you must be logged in to create listing ")
    return res.redirect("/login")
  }
  next()
}

const saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next()
}
 ;

 const isOwner= async (req,res,next)=>{
  let {id}=req.params;
  let listing=await List.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you donot have permission to edit,upate,delete ")
  return   res.redirect(`/listings/${id}`)
  }
  next()
}
const isReviewAuthor= async (req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you donot have permission to edit,upate,delete ")
  return   res.redirect(`/listings/${id}`)
  }
  next()
}

export {isLoggedIn ,saveRedirectUrl,isOwner,isReviewAuthor };


