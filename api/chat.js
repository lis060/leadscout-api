import { GoogleGenerativeAI } from "@google/genai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
