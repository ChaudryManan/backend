import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import 'dotenv/config';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB connected");
};

export default connectDB;
