import { Router } from "express";
import { order } from "../Controller/product.controller.js";
import {logout, signup} from "../Controller/user.controller.js"
import {login} from "../Controller/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import createProduct from "../Controller/product.controller.js";
import { getProduct } from "../Controller/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { findUser } from "../Controller/product.controller.js";
import multer from "multer";

const router = Router();
const formParser = multer(); // Create a form data parser

// Add formParser.none() to your order route
router.route("/order").post(
  verifyJWT,
  formParser.none(), // Add this line to parse form-data
  order
);

// Rest of your routes remain the same
router.route("/product").post(
  verifyJWT,
  upload.single("product_image"),
  createProduct
);

router.route("/me").get(verifyJWT, findUser);
router.route("/getproduct").get(getProduct);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;