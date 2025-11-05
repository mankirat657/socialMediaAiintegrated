import express from "express";
import { createPost, getPost } from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/auth.middleware..js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", verifyToken, upload.single("image"), createPost);
router.get("/posts", verifyToken, getPost);
export default router;
