import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if this is the first message - provide a helpful response about AI Gateway
    if (messages.length === 1) {
      // Return a helpful message without using AI Gateway
      const fallbackResponse = `Hello! I'm the HealthWise AI Assistant. 

I'm here to help you with maternal health questions and provide guidance on:
- Prenatal care and nutrition
- Pregnancy symptoms and warning signs
- Newborn care and breastfeeding
- Family planning and reproductive health
- General health and wellness

**Note:** AI-powered responses require AI Gateway configuration. For now, I can provide general health information and direct you to appropriate resources.

What would you like to learn about today?`

      return new Response(fallbackResponse, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }

    // Try to use AI Gateway
    try {
      const result = await streamText({
        model: "openai/gpt-4o",
        messages,
        system: `You are a helpful maternal health assistant for HealthWise Sierra Leone. 
        
Your role is to:
- Provide accurate, culturally appropriate health information
- Focus on maternal and child health topics
- Give practical advice suitable for Sierra Leone context
- Recognize emergency situations and advise seeking immediate medical help
- Be supportive and encouraging
- Use simple, clear language

Important: Always advise users to consult healthcare professionals for medical decisions.`,
        maxTokens: 500,
      })

      return result.toDataStreamResponse()
    } catch (aiError: any) {
      console.log("[v0] AI Gateway not available, using context-aware fallback response")

      const lastMessage = messages[messages.length - 1]?.content || ""

      let fallbackResponse = `I understand you're asking about: "${lastMessage}"\n\n`

      // Provide context-aware fallback responses
      if (lastMessage.toLowerCase().includes("pregnan")) {
        fallbackResponse += `For pregnancy-related questions, I recommend:
- Attending regular prenatal checkups at your local health center
- Eating nutritious foods including vegetables, fruits, and proteins
- Getting adequate rest and staying hydrated
- Calling 117 for emergencies like severe bleeding or severe headaches

For personalized advice, please visit the "Articles" section or consult with a healthcare provider.`
      } else if (lastMessage.toLowerCase().includes("baby") || lastMessage.toLowerCase().includes("newborn")) {
        fallbackResponse += `For newborn care:
- Breastfeed exclusively for the first 6 months
- Keep the baby warm and clean
- Watch for danger signs like difficulty breathing or fever
- Attend all vaccination appointments

Visit our "Wellness" section for more detailed information.`
      } else if (lastMessage.toLowerCase().includes("emergency") || lastMessage.toLowerCase().includes("urgent")) {
        fallbackResponse += `⚠️ For medical emergencies:
- Call 117 immediately
- Go to the nearest health facility
- Don't delay seeking help

Emergency signs include: severe bleeding, severe headache, blurred vision, convulsions, severe abdominal pain, or difficulty breathing.`
      } else {
        fallbackResponse += `I'm currently operating in limited mode. For comprehensive health information:
- Browse our "Articles" section for maternal health topics
- Check the "Wellness" tracker for personalized health monitoring
- Book an appointment with a doctor through our "Doctors" section
- Call 117 for medical emergencies

Is there a specific health topic you'd like to explore?`
      }

      return new Response(fallbackResponse, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }
  } catch (error) {
    console.error("[v0] Chat API error:", error)

    return new Response(
      `I apologize, but I'm having trouble processing your request right now. 

Please try:
- Browsing our Articles section for health information
- Booking an appointment with a doctor
- Calling 117 for medical emergencies

How else can I help you today?`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      },
    )
  }
}
