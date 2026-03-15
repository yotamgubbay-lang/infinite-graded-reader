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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    });

    const prompt = `Write a ${language} story at ${level} level about ${topic}. Provide a 5-word glossary.`;
    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
