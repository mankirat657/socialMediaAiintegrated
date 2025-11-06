import express from "express";
import {
  createPost,
  deleteComment,
  deletePost,
  editComment,
  getPost,
  postComment,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/auth.middleware..js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", verifyToken, upload.single("image"), createPost);
router.get("/posts", verifyToken, getPost);
router.patch("/update/:id", verifyToken, upload.single("image"), updatePost);
router.get("/delete/:id", verifyToken, deletePost);
router.post("/comments/:id", verifyToken, postComment);
router.patch("/editComment/:id", verifyToken, editComment);
router.get("/deleteComment/:id", verifyToken, deleteComment);
export default router;
