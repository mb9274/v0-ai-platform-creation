import { streamText } from "ai"

const getFallbackResponse = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1]?.content || ""
  const lowerMessage = lastMessage.toLowerCase()

  if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("urgent")) {
    return `⚠️ **For Medical Emergencies:**

Call 117 immediately if you experience:
- Severe bleeding
- Severe headache or blurred vision
- Convulsions or seizures
- Severe abdominal pain
- Difficulty breathing
- High fever

Don't delay seeking help. Go to the nearest health facility right away.`
  }

  if (lowerMessage.includes("pregnan") || lowerMessage.includes("prenatal")) {
    return `**Pregnancy Care Tips:**

✓ Attend all prenatal checkups at your local health center
✓ Eat nutritious foods: vegetables, fruits, proteins, whole grains
✓ Take your iron and folic acid supplements
✓ Get adequate rest and stay hydrated
✓ Avoid alcohol, tobacco, and harmful substances

Watch for warning signs and call 117 if you experience severe symptoms.

Would you like to know more about a specific pregnancy topic?`
  }

  if (lowerMessage.includes("baby") || lowerMessage.includes("newborn") || lowerMessage.includes("infant")) {
    return `**Newborn Care Essentials:**

✓ Breastfeed exclusively for the first 6 months
✓ Keep baby warm and clean
✓ Attend all vaccination appointments
✓ Watch for danger signs: difficulty breathing, fever, not feeding well
✓ Practice skin-to-skin contact

For any concerns about your baby's health, visit your health center or call 117 for emergencies.

What specific aspect of baby care would you like to learn about?`
  }

  if (lowerMessage.includes("breastfeed") || lowerMessage.includes("nursing")) {
    return `**Breastfeeding Tips:**

✓ Start breastfeeding within the first hour after birth
✓ Feed on demand, at least 8-12 times per day
✓ Ensure proper latch to prevent sore nipples
✓ Drink plenty of fluids and eat nutritious foods
✓ Ask for help from health workers if you have difficulties

Breast milk provides all the nutrition your baby needs for the first 6 months.

Do you have a specific breastfeeding question?`
  }

  if (lowerMessage.includes("nutrition") || lowerMessage.includes("food") || lowerMessage.includes("diet")) {
    return `**Healthy Nutrition Guidelines:**

For Pregnant/Nursing Mothers:
✓ Eat a variety of foods from all food groups
✓ Include dark green leafy vegetables
✓ Eat fruits, beans, fish, eggs, and meat
✓ Drink 8-10 glasses of clean water daily
✓ Take iron and folic acid supplements

Avoid: Alcohol, tobacco, excessive caffeine, raw/undercooked foods

What specific nutrition question do you have?`
  }

  if (lowerMessage.includes("malaria") || lowerMessage.includes("fever")) {
    return `**Malaria Prevention:**

✓ Sleep under insecticide-treated bed nets
✓ Take antimalarial medication as prescribed during pregnancy
✓ Seek treatment immediately if you have fever
✓ Clear stagnant water around your home
✓ Use mosquito repellent

Symptoms: Fever, chills, headache, body aches
If you suspect malaria, visit a health facility immediately for testing and treatment.

Need more information about malaria?`
  }

  if (lowerMessage.includes("vaccine") || lowerMessage.includes("immuniz")) {
    return `**Important Vaccinations:**

For Babies:
- BCG (at birth)
- Polio (at birth, 6, 10, 14 weeks)
- Pentavalent (6, 10, 14 weeks)
- Measles (9 months)
- Yellow fever (9 months)

For Pregnant Women:
- Tetanus toxoid (during pregnancy)

Keep your vaccination card safe and attend all scheduled appointments at your health center.

Which vaccination would you like to know more about?`
  }

  // Default response
  return `Hello! I'm your HealthWise AI Assistant. I'm currently operating in limited mode, but I can still help you with:

📚 **Health Topics:**
- Pregnancy and prenatal care
- Newborn and child care
- Breastfeeding support
- Nutrition and diet
- Disease prevention (malaria, etc.)
- Vaccinations
- Emergency guidance

💡 **Quick Actions:**
- Browse our Articles section for detailed health information
- Check the Wellness tracker for personalized monitoring
- Book appointments with doctors
- Call 117 for medical emergencies

What health topic would you like to learn about?`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const messages = body.messages || [{ role: "user", content: body.message || "" }]

    try {
      const result = await streamText({
        model: "openai/gpt-4o",
        messages,
        system: `You are a helpful maternal health assistant for HealthWise Sierra Leone.

Your role is to:
- Provide accurate, culturally appropriate health information
- Focus on maternal and child health topics relevant to Sierra Leone
- Give practical advice that's actionable in resource-limited settings
- Recognize emergency situations and advise seeking immediate medical help (call 117)
- Be supportive, encouraging, and empathetic
- Use simple, clear language accessible to all education levels
- Respect local customs and cultural practices

Important guidelines:
- Always advise users to consult healthcare professionals for medical decisions
- For emergencies, direct users to call 117 or visit nearest health facility
- Provide evidence-based information
- Be sensitive to literacy levels and language barriers
- Encourage preventive care and regular checkups`,
        maxTokens: 500,
        temperature: 0.7,
      })

      return result.toDataStreamResponse()
    } catch (aiError) {
      console.log("[v0] AI Gateway not available, using comprehensive fallback response")

      const fallbackText = getFallbackResponse(messages)

      return new Response(fallbackText, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }
  } catch (error) {
    console.error("[v0] Health assistant API error:", error)

    const errorResponse = `I apologize, but I'm having trouble processing your request right now.

**You can still:**
- Browse our Articles section for health information
- Use the Wellness tracker to monitor your health
- Book an appointment with a doctor
- Call 117 for medical emergencies

Please try asking your question again, or explore our other features.`

    return new Response(errorResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
