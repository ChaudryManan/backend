// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.Routes.js";

const app = express();
app.use((req, res, next) => {
  console.log("💧 Incoming:", req.method, req.url);
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://full-stack-website-theta.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);


export default app;
