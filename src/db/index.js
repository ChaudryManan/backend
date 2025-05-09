// src/db/index.js
import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import 'dotenv/config';

// Immediately start connection on module load
mongoose
  .connect(
    `${process.env.MONGODB_URI}/${DB_Name}`,
    { serverSelectionTimeoutMS: 5000 }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Export a no-op; the side-effect above is all we need
export default () => {};
