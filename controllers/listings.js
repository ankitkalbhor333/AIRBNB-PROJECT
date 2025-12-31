import List from "../models/listing.js"

//1.render all listing
 const index=async (req, res) => {
  const allisting = await List.find({});
  res.render("listings", { allisting });
}

//2.render new listing form 
const listingform=(req, res) => {
  res.render("listings/listnewItem");
}

//3.create new listing submission
const newListpost=async (req, res) => {
  console.log(req.body)
  const { title, description, price, location, country } = req.body;
  
  if (!req.file) {
    req.flash("error", "Image file is required");
    return res.redirect("/listings/addnew");
  }
  
  const newListing = new List({
    title,
    description,
    image: { 
      filename: req.file.filename,
      url: req.file.path || req.file.secure_url

    },
    price,
    location,
    country,
  });
newListing.owner=req.user._id
  await newListing.save();
  console.log("Uploaded file details:", req.file);
  req.flash("success","new listing created")
  res.redirect("/listings");
}

//4.render edit form 
const editForm=async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);

  if (!list) throw new ExpressError(404, "Listing not found");
  let originalImage=list.image.url
  originalImage=originalImage.replace("/uploads","/upload/h_300,w_250")
  res.render("listings/edit", { list,originalImage });
}

//5.updatelisting  put request
const updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

  // Find the listing first
  const listing = await List.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  // Update basic fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // If a new file was uploaded, update image
  if (req.file) {
    listing.image = {
      url: req.file.path,       // Cloudinary secure URL
      filename: req.file.filename, // Cloudinary public_id
    };
  }

  await listing.save();

  req.flash("success", "Listing edited");
  res.redirect("/listings");
};


//6. show singlelisting 
const viewsingleList=async (req, res) => {
  const { id } = req.params;
  const singleitems = await List.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!singleitems){
      req.flash("error","this listing is not avail")
    res.redirect("/listings")
  }
  if (!singleitems) throw new ExpressError(404, "Listing not found");
  console.log(singleitems)
  res.render("listings/singlelist", { singleitems });
}

//7.delete list items
const deleteitems=async (req, res) => {
  const { id } = req.params;
  const deletedItem = await List.findByIdAndDelete(id);
  if (!deletedItem) throw new ExpressError(404, "Listing not found");
  req.flash("success","listing deleted")
  res.redirect("/listings");
}

export default { index ,listingform,newListpost,editForm,updateListing,viewsingleList,deleteitems}
