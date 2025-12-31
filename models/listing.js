import mongoose from "mongoose";


let Schema=mongoose.Schema
const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   image: { filename: String, url: String },
      location: {
      type: String,
      maxLength: 50,
      required: true,
    },
      price: {
      type: Number,
   min:0,
      required: true,
    },  country: {
      type: String,
      
      required: true,
    },
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review"
    }],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("List", listingSchema);

