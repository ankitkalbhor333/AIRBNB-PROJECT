// cloudConfig.js
import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const requiredEnv = ["CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) throw new Error(`Missing Cloudinary env vars: ${missing.join(", ")}`);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "airbnbproject",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

export { cloudinary };
