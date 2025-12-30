
import { GoogleGenAI } from "@google/genai";

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    // Guideline: Use process.env.API_KEY directly and initialize inside the function.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and professional chat assistant. Keep responses concise and friendly, suitable for a mobile chat app.",
        temperature: 0.7,
      },
    });

    // Guideline: Use response.text property directly.
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! Something went wrong while thinking.";
  }
}
