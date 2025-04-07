import { GoogleGenAI } from "@google/genai";

const apiKey = String(process.env.GENAI_API_KEY);

const ai = new GoogleGenAI({ apiKey: "AIzaSyCb-A0m42w44-vMG15cL0Qm8s_Aexkixuk" });

export const aiReponse = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text
}