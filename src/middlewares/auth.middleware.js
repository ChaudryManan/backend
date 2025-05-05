import jwt from 'jsonwebtoken';
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1. Check both cookies and Authorization header
    const token = req.cookies?.accessToken || 
                req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.AccessTokenSecret);

    // 3. Find user with refresh token check
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // 5. Handle specific error cases
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    
    throw new ApiError(401, error.message || "Invalid access token");
  }
});