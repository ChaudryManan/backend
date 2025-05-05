
// import { compare } from "bcrypt"
import bcrypt from "bcryptjs";
import {User} from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynHandler.js"
const signup=asyncHandler( async(req,res)=>{

const {email,password,firstName,lastName}=req.body

    if(!email||!password||!firstName||!lastName){
      throw new ApiError(404,"All fields are required")
    }
    let createdUser= await User.create({
        email,
      password,
      firstName,
      lastName 
    }
       
    )
     createdUser  =await User.findById(createdUser._id).select('-password')
     if(!createdUser){
      throw new ApiError(404,"All fields are required")
     }
     if(createdUser){
      res.status(201).json(new ApiResponse(201,createdUser,"user is registerd successfully"))
     }


})
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.status(200).json(new ApiResponse(200, user, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

export  {signup,login,logout}
