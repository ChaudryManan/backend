// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.Routes.js";

const app = express();

app.use(cors({
  // only front‑ends go here, not your backend domain:
  origin: [
    "http://localhost:3000",

  ],
  credentials: true,
}));



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use("/api/v1/users", userRouter);

export default app;
