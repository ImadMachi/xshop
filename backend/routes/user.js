import express from "express";

import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  signupUser,
  updateUser,
  updateUserProfile,
} from "../controllers/user.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", signupUser);

router.get("/", auth, admin, getUsers);

router.post("/login", authUser);

router.get("/profile", auth, getUserProfile);

router.put("/profile", auth, updateUserProfile);

router.delete("/:id", auth, admin, deleteUser);

router.get("/:id", auth, admin, getUserById);

router.put("/:id", auth, admin, updateUser);

export default router;
