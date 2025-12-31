import express from "express";
import mongoose from "mongoose";
import List from "../models/listing.js";
import initData from "./data.js"
const app = express();

async function main() {
  await mongoose.connect("mongodb+srv://ankitkal2005:gE6m0NGGQ9TFUJZK@cluster0.7ifwzv8.mongodb.net/?appName=Cluster0");
}
main()
  .then(() => console.log("Connected successfully"))
  .catch((error) => console.log(error));
  

  const initDB=async ()=>{
    await List.deleteMany({})
   initData.data= initData.data.map((obj)=>({...obj,owner:"69529673aad27e6090d7481b"}))
    await List.insertMany(initData.data)
    console.log("data was initalized")
  }
  initDB()