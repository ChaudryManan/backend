// src/db/index.js
import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import 'dotenv/config';

// Kick off the connection and capture the promise:
export const dbConnectPromise = mongoose
  .connect(
    `${process.env.MONGODB_URI}/${DB_Name}`,
    { serverSelectionTimeoutMS: 5000 }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    throw err;  // re-throw so init() can see the failure
  });
