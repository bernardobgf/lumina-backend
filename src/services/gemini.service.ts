import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateResponse = async (
  userMessage: string,
): Promise<string> => {
  const model = ai.getGenerativeModel({ model: "gemini-3.5-flash" });

  const result = await model.generateContent(userMessage);
  const response = result.response.text();

  return response;
};
