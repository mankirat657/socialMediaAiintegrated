import dotenv from "dotenv";
dotenv.config();
import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(file, filename) {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: filename,
      folder: "practice",
    });
    return response;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
