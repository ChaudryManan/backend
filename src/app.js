// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.Routes.js";

const app = express();


app.use(cors({
  origin: "https://full-stack-website-theta.vercel.app", // React local development URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allows cookies to be sent with requests
}));




app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use("/api/v1/users", userRouter);

export default app;
