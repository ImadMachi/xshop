import express from "express";

import {
  addOrderItems,
  getLoggedInUserOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/order.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.post("/", auth, addOrderItems);
router.get("/", auth, admin, getOrders);
router.get("/myorders", auth, getLoggedInUserOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/pay", auth, updateOrderToPaid);
router.put("/:id/deliver", auth, admin, updateOrderToDelivered);

export default router;
