import { generateObject } from "ai"
import { z } from "zod"

const healthContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  keyPoints: z.array(z.string()),
  audioScript: z.string().describe("Script optimized for audio narration"),
  culturalNotes: z.string().describe("Cultural considerations for Sierra Leone"),
  actionItems: z.array(z.string()),
})

const getFallbackContent = (topic: string) => ({
  title: topic,
  content: `This is important information about ${topic}. Regular prenatal care is essential for a healthy pregnancy. Make sure to attend all your scheduled checkups at your local health center. Eat nutritious foods, get enough rest, and don't hesitate to ask questions or seek help when needed.`,
  keyPoints: [
    "Attend regular prenatal checkups",
    "Eat a balanced diet with plenty of vegetables and fruits",
    "Get adequate rest and sleep",
    "Stay hydrated by drinking clean water",
    "Seek immediate help if you notice warning signs",
  ],
  audioScript: `Let's talk about ${topic}. This is very important for your health and your baby's health. Remember to attend all your prenatal checkups. Eat good food, rest well, and always ask for help when you need it.`,
  culturalNotes:
    "In Sierra Leone, community support is very important. Don't hesitate to involve family members and traditional birth attendants while also seeking modern medical care.",
  actionItems: [
    "Schedule your next health center visit",
    "Discuss this topic with your family",
    "Write down any questions for your healthcare provider",
  ],
})

export async function POST(req: Request) {
  try {
    const { topic, language, userProfile } = await req.json()

    try {
      const { object } = await generateObject({
        model: "openai/gpt-4o",
        schema: healthContentSchema,
        prompt: `Generate comprehensive maternal health education content for Sierra Leone.
    
    Topic: ${topic}
    Language: ${language}
    User Profile: ${JSON.stringify(userProfile)}
    
    Requirements:
    - Culturally appropriate for Sierra Leone
    - Accessible language level
    - Include practical action items
    - Consider local healthcare context
    - Audio-friendly script for voice narration
    - Address common concerns and myths`,
        maxTokens: 2000,
      })

      return Response.json({ content: object })
    } catch (aiError) {
      console.log("[v0] AI Gateway not available, using fallback health content")
      return Response.json({ content: getFallbackContent(topic) })
    }
  } catch (error) {
    console.error("[v0] Health content API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      {
        error: "Failed to generate health content",
        details: errorMessage,
        content: getFallbackContent("Maternal Health"), // Return fallback content
      },
      { status: 200 }, // Return 200 with fallback data
    )
  }
}
