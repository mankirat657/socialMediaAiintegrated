import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorize access",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({
      _id: decoded.id,
    });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "An error occured" + error,
    });
  }
};
