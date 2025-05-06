// backend/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.Routes.js";

const app = express();

// 1. Corrected allowed origins
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://full-stack-website-theta.vercel.app"] // 🚨 Replace with ACTUAL frontend URL
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

// 2. Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.

    const allowedOrigins = [
      "https://full-stack-website-theta.vercel.app",
      "http://localhost:3000"
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true, // Allow cookies / tokens
}));


// 3. Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: "16kb",
  parameterLimit: 100 // Prevent DDOS attacks
}));

// 4. Cookie parser with security
app.use(cookieParser({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
}));

// 5. Rate limiting (important for Vercel)
import rateLimit from 'express-rate-limit';
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/users", apiLimiter);

// 6. Routes
app.use("/api/v1/users", userRouter);

// 7. Global error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  
  // Handle CORS errors specifically
  if (err.message.includes('CORS blocked')) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden by CORS policy',
      requestedOrigin: req.headers.origin
    });
  }

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong!'
  });
});

export default app;