import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { uploadCloudnary } from "../utils/cloudnary.js";
import { orderProduct } from "../model/order.model.js";
import nodemailer from "nodemailer"
import mongoose from "mongoose";
const createdProduct = asyncHandler(async (req, res) => {
  const { product_name, product_price, product_description, product_category,product_brand } = req.body;

  // 🔧 Corrected field check
  if (!product_name || !product_price || !product_description || !product_category ||!product_brand) {
    throw new ApiError(400, "All fields are required");
  }

  // 🔧 Corrected file path access (assuming single image upload with name "product_image")
  const product_image_LocalPath = req.file?.path;

  if (!product_image_LocalPath) {
    throw new ApiError(400, "Product image path not found");
  }

  const image_upload = await uploadCloudnary(product_image_LocalPath);

  // 🔧 Save the product to DB
  const product_info = await Product.create({
    product_name,
    product_price,
    product_description,
    product_category,
    product_brand,
    product_image: image_upload?.url || "", // Assuming `uploadCloudnary()` returns an object with a `url`
    owner:req.user._id
  });

  if (!product_info) {
    throw new ApiError(500, "Failed to create product");
  }

  // ✅ Respond to client
  res.status(200).json(
    new ApiResponse(200, product_info, "Product created successfully")
  );
});
export  const getProduct=asyncHandler(async(req,res)=>{
  const product= await Product.find()
  return res.status(201).json(new ApiResponse(201,product,"all the data is retrieved"))
 })
 export const findUser=asyncHandler(async(req,res)=>{
  try {
    // Verify user exists in request
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized access");
    }

    // Find user with proper error handling
    const user = await User.findById(req.user._id)
      .select("firstName lastName email")
      .orFail(() => new ApiError(404, "User not found"));

    // Proper API response format
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        "User details retrieved successfully"
      )
    );
    
  } 
  catch(error){
   console.log(error)
  }

 })
 export const order = asyncHandler(async (req, res) => {
  // Remove 'total_price' from required fields
  const requiredFields = ['postal_address', 'product_id', 'quantity', 'phone_number'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  const { postal_address, product_id, quantity, phone_number } = req.body;

  // Verify product and ownership
  const product = await Product.findById(product_id);
  if (!product) throw new ApiError(404, "Product not found");
  
  // Add ownership validation
  if (!product.owner || !mongoose.Types.ObjectId.isValid(product.owner)) {
    throw new ApiError(400, "Product has invalid owner data");
  }

  // Calculate price server-side
  const total_price = product.product_price * Number(quantity);

  const order = await orderProduct.create({
    buyer: req.user._id,
    seller: product.owner, // Now validated
    product: product_id,
    quantity: Number(quantity),
    postal_address,
    phone_number,
    total_price // Server-calculated
  });
const buyerEmail=req.user.email
console.log("buyer email",buyerEmail)
  res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.gmail,
    pass: process.env.app_pass,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Abdul Manan 👻" <manankhn81@gmail.com>', // sender address
    to: buyerEmail,// list of receivers
    subject: "Order Selection ✔", // Subject line
    text: `Your order is selected on website ${JSON.stringify(order)} `, // plain text body
    html: `<p>Your order has been placed successfully.</p>
     <pre>${JSON.stringify(order, null, 2)}</pre>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Price:</strong> $${order.total_price}</p>`,  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

});

export default createdProduct
