import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize with your key
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

    // CHANGE HERE: We are using "gemini-1.5-flash-latest" 
    // This is the most "bulletproof" name for the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `Write a ${language} story at ${level} level about ${topic}. Provide a 5-word glossary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("GOOGLE_ERROR:", error.message);
    
    // FALLBACK: If "flash" fails, try the older "gemini-pro"
    return NextResponse.json({ 
      error: "Model error. Try again in a moment.",
      details: error.message 
    }, { status: 500 });
  }
}
