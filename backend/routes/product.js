import express from "express";

import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/product.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", auth, admin, createProduct);

router.post("/:id/reviews", auth, createProductReview);

router.get("/top", getTopProducts);

router.get("/:id", getProductById);

router.delete("/:id", auth, admin, deleteProduct);

router.put("/:id", auth, admin, updateProduct);

export default router;
