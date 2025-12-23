import express from "express";
import mongoose from "mongoose";
import List from "../models/listing.js";
import initData from "./data.js"
const app = express();

async function main() {
  await mongoose.connect("mongodb://localhost:27017/Airbnb");
}
main()
  .then(() => console.log("Connected successfully"))
  .catch((error) => console.log(error));
  

  const initDB=async ()=>{
    await List.deleteMany({})
    await List.insertMany(initData.data)
    console.log("data was initalized")
  }
  initDB()