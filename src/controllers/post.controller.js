import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { generateContent } from "../service/ai.service.js";
import { uploadFile } from "../service/storage.service.js";
import { v4 } from "uuid";
export const createPost = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const base64ImageFile = new Buffer.from(file.buffer).toString("base64");
    console.log(base64ImageFile);
    const [caption, result] = await Promise.all([
      generateContent(base64ImageFile),
      uploadFile(file.buffer, `${v4()}`),
    ]);
    const { title, description } = req.body;
    const post = await postModel.create({
      caption: caption,
      image: result.url,
      userId: req.user._id,
      title: title,
      description: description,
    });
    await userModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: { posts: post._id },
      }
    );
    res.status(201).json({
      message: "Post created Successfully",
      post,
    });
  } catch (error) {
    return res.status(409).json({
      message: error,
    });
  }
};
export const getPost = async (req, res) => {
  const userId = req.user.id;
  try {
    const post = await postModel.find({
      userId: userId,
    });
    if (!post) {
      return res.status(400).json({
        message: "No post available",
      });
    }
    return res.status(200).json({
      message: "posts fetched",
      post,
    });
  } catch (error) {
    return res.json(409).json({
      message: `error occured ${error}`,
    });
  }
};
