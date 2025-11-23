import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // from Vercel env
  // vertexai: false  // using normal Gemini API, not Vertex
});

export default async function handler(req, res) {
  // CORS headers so your Hostinger frontend can call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or "gemini-2.0-flash" if you prefer
      contents: message,
    });

    const reply = response.text;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
