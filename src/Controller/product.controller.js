import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { uploadCloudnary } from "../utils/cloudnary.js";
import { orderProduct } from "../model/order.model.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

// 1. Create Product
export const createdProduct = asyncHandler(async (req, res) => {
  const { product_name, product_price, product_description, product_category, product_brand } = req.body;

  if (!product_name || !product_price || !product_description || !product_category || !product_brand) {
    throw new ApiError(400, "All fields are required");
  }

  const product_image_LocalPath = req.file?.path;
  if (!product_image_LocalPath) {
    throw new ApiError(400, "Product image path not found");
  }

  const image_upload = await uploadCloudnary(product_image_LocalPath);

  const product_info = await Product.create({
    product_name,
    product_price,
    product_description,
    product_category,
    product_brand,
    product_image: image_upload?.url || "",
    owner: req.user._id,
  });

  if (!product_info) {
    throw new ApiError(500, "Failed to create product");
  }

  res.status(200).json(new ApiResponse(200, product_info, "Product created successfully"));
});

// 2. Get All Products
export const getProduct = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();
  res.status(200).json(new ApiResponse(200, products, "All products retrieved successfully"));
});

// 3. Get Current User Info
export const findUser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(req.user._id)
    .select("firstName lastName email")
    .orFail(() => new ApiError(404, "User not found"));

  res.status(200).json(
    new ApiResponse(200, {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }, "User details retrieved successfully")
  );
});

// 4. Order Product + Send Email
export const order = asyncHandler(async (req, res) => {
  const { postal_address, product_id, quantity, phone_number } = req.body;
  const requiredFields = ['postal_address', 'product_id', 'quantity', 'phone_number'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  const product = await Product.findById(product_id);
  if (!product) throw new ApiError(404, "Product not found");

  if (!product.owner || !mongoose.Types.ObjectId.isValid(product.owner)) {
    throw new ApiError(400, "Product has invalid owner data");
  }

  const total_price = product.product_price * Number(quantity);

  const order = await orderProduct.create({
    buyer: req.user._id,
    seller: product.owner,
    product: product_id,
    quantity: Number(quantity),
    postal_address,
    phone_number,
    total_price
  });

  // Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmail,
      pass: process.env.app_pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Abdul Manan 👻" <${process.env.gmail}>`,
      to: req.user.email,
      subject: "Order Confirmation ✔",
      html: `
        <p>Dear ${req.user.firstName},</p>
        <p>Your order has been placed successfully.</p>
        <p><strong>Product:</strong> ${product.product_name}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total Price:</strong> $${order.total_price}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p>Thank you for shopping with us!</p>
      `,
    });
  } catch (emailErr) {
    console.error("Email failed:", emailErr.message);
  }

  // Populate and return detailed order
  const populatedOrder = await orderProduct.findById(order._id)
    .populate("product", "product_name product_price")
    .populate("seller", "firstName lastName email")
    .populate("buyer", "firstName lastName email");

  res.status(201).json(new ApiResponse(201, populatedOrder, "Order placed successfully and confirmation email sent"));
});
//git
