import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { uploadFile } from "../service/storage.service.js";
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const file = req.file;

    const userExist = await userModel.findOne({
      email,
      username,
    });
    if (userExist) {
      return res.status(409).json({
        message: "User already register pls try to login!",
      });
    }
    const result = await uploadFile(file.buffer, `${v4()}`);
    const user = await userModel.create({
      image: result.url,
      email: email,
      password: await bcrypt.hash(password, 10),
      username: username,
    });
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "user successfully created",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(401).json({
        message: "UnAuthorized try to register first",
      });
    }
    const passwordvalid = await bcrypt.compare(password, user.password);
    if (!passwordvalid) {
      return res.status(409).json({
        message: "Invalid password try again",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token);
    res.status(200).json({
      message: "user successfully logged in",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: `An error occured ${error}`,
    });
  }
};
export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "");
    res.status(200).json({
      message: "user logout successfully",
    });
  } catch (error) {
    res.status(409).json({
      message: `an error occured ${error}`,
    });
  }
};
export const forgotPassword = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(409).json({
      message: "username or password is missing",
    });
  }
  const user = await userModel.findOne({
    email: email,
    username: username,
  });
  if (!user) {
    return res.status(409).json({
      message: "user not found",
    });
  }
  try {
    await userModel.findOneAndUpdate(
      {
        email: email,
        username: username,
      },
      {
        password: await bcrypt.hash(password, 10),
      }
    );
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(409).json({
      message: `error ${error}`,
    });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const file = req.file;

    const updateFields = {};

    if (file) {
      const uploaded = await uploadFile(file.buffer, `${v4()}`);
      updateFields.image = uploaded.url;
    }

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const user = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      updateFields,
      { new: true }
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token);

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(409).json({
      message: `An error occurred: ${error}`,
    });
  }
};
export const getPosts = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  try {
    const user = await userModel
      .find({
        _id: userId,
      })
      .populate("posts");

    if (!user) {
      return res.status(409).json({
        message: "no user found",
      });
    }
    return res.status(200).json({
      message: "user with posts fetched",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: `error occured ${error}`,
    });
  }
};
