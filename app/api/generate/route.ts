import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    story_paragraphs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    glossary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          word: { type: SchemaType.STRING },
          translation: { type: SchemaType.STRING },
          context: { type: SchemaType.STRING }
        }
      }
    }
  },
  required: ["title", "story_paragraphs", "glossary"]
};

export async function POST(req: Request) {
  try {
    const { language, level, topic } = await req.json();

    // ERROR SNIFFER: This will tell us if the key is missing
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "KEY_MISSING: The Waiter cannot find your API Key in Vercel." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a story...`;

    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));

  } catch (error: any) {
    // ERROR SNIFFER: This tells us if Google rejected the key
    console.error("GOOGLE_ERROR:", error.message);
    return NextResponse.json({ 
      error: "GOOGLE_REJECTED: Check if your key is active or if you hit your limit.",
      details: error.message 
    }, { status: 500 });
  }
}
