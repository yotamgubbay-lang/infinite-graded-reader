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

    // 1. Try the most common model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Removed "-latest"
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `Write a ${language} story at ${level} level about ${topic}. Provide a 5-word glossary.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("PRIMARY_MODEL_FAILED:", error.message);

    // 2. FALLBACK: If Flash is not found, try the universal "gemini-pro"
    try {
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const fallbackPrompt = `Write a ${language} story at ${level} level about ${topic}. Return ONLY JSON with title, story_paragraphs (array), and glossary (array of word/translation/context).`;
      
      const fallbackResult = await fallbackModel.generateContent(fallbackPrompt);
      return NextResponse.json(JSON.parse(fallbackResult.response.text()));
    } catch (fallbackError: any) {
      return NextResponse.json({ 
        error: "Both models failed. Please check your Google AI Studio dashboard to see which models are enabled for your key.",
        details: fallbackError.message 
      }, { status: 500 });
    }
  }
}
