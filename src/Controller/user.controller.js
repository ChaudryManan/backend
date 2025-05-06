import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// --- SIGNUP ---
const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // 1. Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // 3. Hash password before saving (in case it's not handled by a pre-save hook)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create new user
  let createdUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  // 5. Remove password from response
  createdUser = await User.findById(createdUser._id).select("-password");

  // 6. Respond with success
  res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

// --- LOGIN ---
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 2. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Generate tokens (assumes `generateAccessToken()` is defined on the model)
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  // 5. Set cookies securely
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  // 6. Send response
  res.status(200).json(new ApiResponse(200, user, "User logged in successfully"));
});

// --- LOGOUT ---
const logout = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

export { signup, login, logout };
