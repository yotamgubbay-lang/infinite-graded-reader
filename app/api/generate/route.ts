import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { level, topic } = await req.json();

    // 1. We create a "Library" of pre-written stories
    const storyLibrary: any = {
      "A1": {
        title: "Hola desde Madrid",
        story_paragraphs: [
          "Juan es un estudiante de español. Él vive en Madrid.",
          "Hoy Juan va al mercado. Él compra manzanas rojas y pan grande.",
          "Juan está muy feliz con su comida."
        ],
        glossary: [
          { word: "estudiante", translation: "student", context: "Juan is a student." },
          { word: "vive", translation: "lives", context: "He lives in Madrid." },
          { word: "mercado", translation: "market", context: "He goes to the market." },
          { word: "manzanas", translation: "apples", context: "He buys red apples." }
        ]
      },
      "B1": {
        title: "Un Viaje Inesperado",
        story_paragraphs: [
          "El verano pasado, decidí viajar a las montañas sin un mapa.",
          "Aunque el clima era impredecible, la vista desde la cima fue absolutamente increíble.",
          "Aprendí que a veces, las mejores experiencias no se pueden planear."
        ],
        glossary: [
          { word: "inesperado", translation: "unexpected", context: "An unexpected trip." },
          { word: "impredecible", translation: "unpredictable", context: "The weather was unpredictable." },
          { word: "cima", translation: "summit/top", context: "The view from the top." },
          { word: "planear", translation: "to plan", context: "Experiences cannot be planned." }
        ]
      }
    };

    // 2. Select the story based on level (default to A1 if level not found)
    const selectedStory = storyLibrary[level] || storyLibrary["A1"];

    // 3. Simulate a 1-second delay so it "feels" like AI is thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(selectedStory);

  } catch (error) {
    return NextResponse.json({ error: "Simulator failed" }, { status: 500 });
  }
}
