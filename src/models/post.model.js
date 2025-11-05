import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    caption: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("post", postSchema);

export default postModel;
