import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { text, targetLanguage, context } = await req.json()

    try {
      const { text: translation } = await generateText({
        model: "openai/gpt-4o",
        prompt: `Translate the following health education content to ${targetLanguage}. 
    Context: This is for maternal health education in Sierra Leone.
    Ensure cultural sensitivity and medical accuracy.
    
    Text to translate: "${text}"
    
    Provide only the translation, no additional text.`,
        maxTokens: 1000,
        temperature: 0.3,
      })

      return Response.json({ translatedText: translation })
    } catch (aiError) {
      console.log("[v0] AI Gateway not available, returning original text")
      return Response.json({ translatedText: text })
    }
  } catch (error) {
    console.error("[v0] Translation API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      {
        error: "Failed to translate content",
        details: errorMessage,
        translatedText: "", // Return empty string when we can't access the original text
      },
      { status: 200 },
    )
  }
}
