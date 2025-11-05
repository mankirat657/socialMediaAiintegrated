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
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;
  const file = req.file;
  const updatedFields = {};
  try {
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (file) {
      const base64ImageFile = new Buffer.from(file.buffer).toString("base64");
      const caption = await generateContent(base64ImageFile);
      const uploaded = await uploadFile(file.buffer, `${v4()}`);
      updatedFields.image = uploaded.url;
      updatedFields.caption = caption;
    }
    const post = await postModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: " post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(409).json({
      message: `An error occurred ${error}`,
    });
  }
};
export const deletePost = async (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    return res.status(400).json({
      message: "No post id found",
    });
  }

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot delete another user's post",
      });
    }

    await postModel.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error occurred: ${error.message}`,
    });
  }
};
