import express from "express";
import multer from "multer";
import {
  forgotPassword,
  getPosts,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware..js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/forgotPassword", forgotPassword);
router.patch(
  "/updateUserProfile",
  upload.single("image"),
  verifyToken,
  updateUserProfile
);
router.get("/posts/:id", getPosts);
export default router;
