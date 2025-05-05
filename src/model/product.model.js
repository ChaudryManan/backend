import mongoose from 'mongoose';
import { User } from './user.model.js'; // Ensure you have .js if using ES modules

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true, // ✅ was mistakenly written as "requires"
    },
    product_category: {
      type: String,
      required: true, // ✅ was mistakenly written as "requires"
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_brand:{
      type:String,
      required:true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true
    },
  },
  {
    timestamps: true, // ✅ plural "timestamps", not "timestamp"
  }
);

export const Product = mongoose.model('Product', productSchema);
