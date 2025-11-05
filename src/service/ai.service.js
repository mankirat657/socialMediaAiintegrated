import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv, { config } from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function main() {
  const result = await model.generateContent(
    "Explain how AI works in a few words"
  );
  console.log(result.response.text());
}

main();

export async function generateContent(base64ImageFile) {
  const visionModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are an expert in generating captions for images. Generate exactly ONE short caption. Use 1-3 emojis and 1-3 hashtags. Do not explain. Do not generate multiple lines.",
  });

  const result = await visionModel.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ]);

  const caption = result.response.text().trim();
  return caption;
}
