import mongoose from "mongoose"
import { User } from "./user.model.js";
import { Product } from "./product.model.js";

const {Schema}=mongoose
export const orderSchem=new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Changed from User to Product
    required: true
  },
  quantity: {
    type: Number,
    required: true // Changed from default
  },
  postal_address: {
    type: String,
    required: true,
  },
  total_price: {
    type: Number,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  }
}, { timestamps: true });
export const orderProduct = mongoose.model('orderProduct', orderSchem);


