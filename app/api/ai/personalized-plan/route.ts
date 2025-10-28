import { generateObject } from "ai"
import { z } from "zod"

const learningPlanSchema = z.object({
  weeklyTopics: z.array(
    z.object({
      week: z.number(),
      topic: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      estimatedTime: z.string(),
    }),
  ),
  personalizedTips: z.array(z.string()),
  urgentAlerts: z.array(z.string()),
  nextSteps: z.array(z.string()),
})

const fallbackPlan = {
  weeklyTopics: [
    {
      week: 1,
      topic: "Prenatal Care Basics",
      description: "Understanding the importance of regular checkups and nutrition during pregnancy",
      priority: "high" as const,
      estimatedTime: "15 min",
    },
    {
      week: 2,
      topic: "Nutrition for Mothers",
      description: "Essential foods and nutrients for a healthy pregnancy",
      priority: "high" as const,
      estimatedTime: "20 min",
    },
    {
      week: 3,
      topic: "Warning Signs During Pregnancy",
      description: "Learn to recognize danger signs and when to seek immediate help",
      priority: "high" as const,
      estimatedTime: "15 min",
    },
    {
      week: 4,
      topic: "Preparing for Delivery",
      description: "What to expect during labor and delivery",
      priority: "medium" as const,
      estimatedTime: "25 min",
    },
    {
      week: 5,
      topic: "Newborn Care",
      description: "Essential care for your baby in the first weeks",
      priority: "high" as const,
      estimatedTime: "20 min",
    },
    {
      week: 6,
      topic: "Breastfeeding Basics",
      description: "How to breastfeed successfully and overcome common challenges",
      priority: "high" as const,
      estimatedTime: "20 min",
    },
  ],
  personalizedTips: [
    "Attend all prenatal checkups at your local health center",
    "Eat a variety of nutritious foods including vegetables, fruits, and proteins",
    "Rest when you can and ask for help from family",
  ],
  urgentAlerts: [
    "Call 117 immediately if you experience severe bleeding, severe headache, or blurred vision",
    "Attend your scheduled prenatal appointments - they are crucial for you and your baby's health",
  ],
  nextSteps: [
    "Complete your first week of learning",
    "Share what you learn with family members",
    "Keep track of your health symptoms",
  ],
}

export async function POST(req: Request) {
  try {
    const { userProfile } = await req.json()

    try {
      const { object } = await generateObject({
        model: "openai/gpt-4o",
        schema: learningPlanSchema,
        prompt: `Create a personalized maternal health learning plan for a user in Sierra Leone.
    
    User Profile:
    - Age: ${userProfile.age}
    - Pregnancy Status: ${userProfile.pregnancyStatus}
    - Location: ${userProfile.location}, ${userProfile.district}
    - Language: ${userProfile.language}
    - Children: ${userProfile.children}
    - Health Concerns: ${userProfile.healthConcerns}
    - Learning Goals: ${userProfile.learningGoals}
    
    Create a 12-week learning plan focusing on:
    - Maternal health priorities based on pregnancy status
    - Local health challenges in Sierra Leone
    - Cultural considerations
    - Practical, actionable content
    - Emergency preparedness`,
        maxTokens: 2000,
      })

      return Response.json({ plan: object })
    } catch (aiError) {
      console.log("[v0] AI Gateway not available, using fallback learning plan")
      return Response.json({ plan: fallbackPlan })
    }
  } catch (error) {
    console.error("[v0] Personalized plan API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      {
        error: "Failed to generate personalized plan",
        details: errorMessage,
        plan: fallbackPlan, // Return fallback data even on error
      },
      { status: 200 }, // Return 200 with fallback data instead of 500
    )
  }
}
