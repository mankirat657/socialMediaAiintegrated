import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  image: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});
const userModel = mongoose.model("user", userSchema);

export default userModel;
