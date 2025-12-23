import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
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
      maxLength: 50,
      required: true,
    },  country: {
      type: String,
      
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const List = mongoose.model("List", listingSchema);
export default List;
