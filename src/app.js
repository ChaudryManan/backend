// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.Routes.js";

const app = express();

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://backend-zy4w.vercel.app/api/v1/users",]    // replace with your actual front‑end URL
  : ["http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use("/api/v1/users", userRouter);

export default app;
