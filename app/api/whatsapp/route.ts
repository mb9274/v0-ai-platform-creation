import { type NextRequest, NextResponse } from "next/server"

// WhatsApp message templates and handlers
const WHATSAPP_TEMPLATES = {
  welcome:
    "Welcome to HealthWise for Sierra Leone! 🏥\n\nI can help you with:\n• 📞 Book consultations\n• 📚 Health education\n• 🚨 Emergency services\n• 📋 Check appointments\n\nJust type what you need or use these commands:\n• *book* - Book consultation\n• *education* - Health topics\n• *emergency* - Emergency help\n• *help* - Show this menu",

  consultation_menu:
    "📞 *Consultation Services*\n\nChoose your preferred method:\n• Type *voice* for voice call\n• Type *text* for SMS consultation\n• Type *video* for video call\n• Type *emergency* for urgent care\n\nOr describe your symptoms and I'll help you choose the best option.",

  education_menu:
    "📚 *Health Education Topics*\n\nSelect a topic:\n• *malaria* - Prevention & treatment\n• *child* - Child health & nutrition\n• *maternal* - Pregnancy & childbirth\n• *mental* - Mental health support\n• *chronic* - Managing chronic diseases\n• *emergency* - First aid basics\n\nType the topic name to get information.",

  emergency_activated:
    "🚨 *EMERGENCY ACTIVATED* 🚨\n\nYour emergency request has been sent to:\n• Local emergency services\n• Nearest health facility\n• Your emergency contacts\n\nHelp is on the way. Stay calm and follow these steps:\n1. Stay where you are if safe\n2. Keep your phone nearby\n3. If possible, unlock your door\n4. Prepare any medications you take\n\nEmergency services will contact you shortly.",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, text, messageId, timestamp } = body

    console.log("WhatsApp Message:", { from, text, messageId, timestamp })

    if (!from || !text) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Clean and normalize message text
    const normalizedText = text.toLowerCase().trim()

    // Log incoming message
    await logCommunication({
      userId: null,
      phoneNumber: from,
      communicationType: "whatsapp",
      direction: "inbound",
      content: text,
      externalId: messageId,
    })

    let responseMessage = ""
    let responseType = "text"
    let mediaUrl = ""

    // Handle different message types and commands
    if (normalizedText.includes("hello") || normalizedText.includes("hi") || normalizedText === "start") {
      responseMessage = WHATSAPP_TEMPLATES.welcome
    } else if (normalizedText.includes("book") || normalizedText.includes("consultation")) {
      responseMessage = WHATSAPP_TEMPLATES.consultation_menu
    } else if (normalizedText.includes("education") || normalizedText.includes("learn")) {
      responseMessage = WHATSAPP_TEMPLATES.education_menu
    } else if (normalizedText.includes("emergency") || normalizedText.includes("urgent")) {
      responseMessage = WHATSAPP_TEMPLATES.emergency_activated
      await handleWhatsAppEmergency(from)
    } else if (normalizedText.includes("voice")) {
      responseMessage = await handleVoiceConsultationWhatsApp(from)
    } else if (normalizedText.includes("text") || normalizedText.includes("sms")) {
      responseMessage = await handleTextConsultationWhatsApp(from, text)
    } else if (normalizedText.includes("video")) {
      responseMessage = await handleVideoConsultationWhatsApp(from)
    } else if (normalizedText.includes("malaria")) {
      const content = await getHealthEducationContent("malaria", from)
      responseMessage = content.text
      mediaUrl = content.audioUrl
      responseType = "audio"
    } else if (normalizedText.includes("child")) {
      const content = await getHealthEducationContent("child-health", from)
      responseMessage = content.text
      mediaUrl = content.audioUrl
      responseType = "audio"
    } else if (normalizedText.includes("maternal") || normalizedText.includes("pregnancy")) {
      const content = await getHealthEducationContent("maternal-health", from)
      responseMessage = content.text
      mediaUrl = content.audioUrl
      responseType = "audio"
    } else if (normalizedText.includes("mental")) {
      const content = await getHealthEducationContent("mental-health", from)
      responseMessage = content.text
      mediaUrl = content.audioUrl
      responseType = "audio"
    } else if (normalizedText.includes("help")) {
      responseMessage = WHATSAPP_TEMPLATES.welcome
    } else if (normalizedText.includes("status") || normalizedText.includes("appointment")) {
      responseMessage = await getAppointmentStatusWhatsApp(from)
    } else {
      responseMessage = await handleNaturalLanguageWhatsApp(from, text)
    }

    // Send response via WhatsApp
    await sendWhatsAppMessage(from, responseMessage, responseType, mediaUrl)

    return NextResponse.json({ success: true, message: "WhatsApp message processed" })
  } catch (error) {
    console.error("WhatsApp Processing Error:", error)
    return NextResponse.json({ error: "Failed to process WhatsApp message" }, { status: 500 })
  }
}

// Helper functions for WhatsApp message handling
async function handleVoiceConsultationWhatsApp(phoneNumber: string) {
  console.log(`Voice consultation WhatsApp request from ${phoneNumber}`)
  return "📞 *Voice Consultation Booked*\n\nA healthcare provider will call you within 30 minutes.\n\n📋 *What to expect:*\n• Call duration: 15-30 minutes\n• Professional medical advice\n• Follow-up recommendations\n• Prescription if needed\n\n💡 *Tip:* Have your symptoms and medical history ready.\n\nReply *cancel* to cancel this appointment."
}

async function handleTextConsultationWhatsApp(phoneNumber: string, message: string) {
  console.log(`Text consultation WhatsApp from ${phoneNumber}: ${message}`)
  return "💬 *SMS Consultation Started*\n\nA Community Health Worker will respond via SMS within 1 hour.\n\n📝 *Please provide:*\n• Your main symptoms\n• How long you've had them\n• Any medications you're taking\n• Your age and gender\n\nThe more details you provide, the better we can help you.\n\n📱 Check your SMS messages for the consultation."
}

async function handleVideoConsultationWhatsApp(phoneNumber: string) {
  console.log(`Video consultation WhatsApp request from ${phoneNumber}`)
  return "📹 *Video Consultation*\n\nVideo consultations are available for:\n• Follow-up appointments\n• Chronic disease management\n• Mental health support\n• Specialist consultations\n\n📋 *Requirements:*\n• Stable internet connection\n• Smartphone or computer with camera\n• Quiet, private space\n\n🔗 You'll receive a secure video link via SMS within 15 minutes.\n\nReply *cancel* to cancel."
}

async function handleWhatsAppEmergency(phoneNumber: string) {
  // Handle emergency request through WhatsApp
  console.log(`WhatsApp emergency from ${phoneNumber}`)

  // In a real implementation:
  // 1. Get user's location
  // 2. Alert emergency services
  // 3. Notify emergency contacts
  // 4. Create emergency consultation record

  return true
}

async function getHealthEducationContent(topic: string, phoneNumber: string) {
  try {
    // Generate AI-powered health education content
    const response = await fetch("/api/ai/health-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        language: "English", // Could be determined by user profile
        userProfile: { phoneNumber },
      }),
    })

    if (response.ok) {
      const { content } = await response.json()

      return {
        text: `🏥 *${content.title}*\n\n${content.content}\n\n*Key Points:*\n${content.keyPoints
          ?.slice(0, 3)
          .map((point: string) => `• ${point}`)
          .join("\n")}\n\n🎧 Audio guide attached for detailed information.`,
        audioUrl: `https://example.com/audio/whatsapp/${topic}-${phoneNumber}.mp3`,
      }
    }
  } catch (error) {
    console.error("AI health content generation failed:", error)
  }

  // Fallback to static content
  const content = {
    malaria: {
      text: "🦟 *Malaria Prevention & Treatment*\n\n*Prevention:*\n• Use insecticide-treated bed nets\n• Clear stagnant water around home\n• Use mosquito repellent\n• Wear long sleeves at dusk/dawn\n\n*Symptoms to watch for:*\n• Fever and chills\n• Headache\n• Muscle aches\n• Nausea and vomiting\n\n*Treatment:*\n• Seek immediate medical care\n• Take prescribed antimalarials completely\n• Rest and stay hydrated\n\n🎧 Listen to the audio guide below for more details.",
      audioUrl: "https://example.com/audio/malaria-prevention-whatsapp.mp3",
    },
    "child-health": {
      text: "👶 *Child Health & Nutrition*\n\n*0-6 months:*\n• Exclusive breastfeeding\n• Regular weight checks\n• Vaccination schedule\n\n*6+ months:*\n• Continue breastfeeding\n• Introduce nutritious foods\n• Monitor growth\n\n*Warning signs:*\n• Fever, difficulty breathing\n• Diarrhea, vomiting\n• Not eating or drinking\n• Unusual sleepiness\n\n🚨 Seek immediate care for warning signs\n\n🎧 Audio guide attached with feeding tips.",
      audioUrl: "https://example.com/audio/child-health-whatsapp.mp3",
    },
    "maternal-health": {
      text: "🤱 *Maternal Health Guide*\n\n*During Pregnancy:*\n• Attend all prenatal visits\n• Take iron and folic acid\n• Eat nutritious foods\n• Avoid alcohol and smoking\n\n*Danger Signs:*\n• Severe headache\n• Blurred vision\n• Heavy bleeding\n• Severe abdominal pain\n\n*Delivery:*\n• Plan to deliver at health facility\n• Prepare emergency transport\n• Have skilled attendant present\n\n🎧 Complete maternal health audio guide attached.",
      audioUrl: "https://example.com/audio/maternal-health-whatsapp.mp3",
    },
    "mental-health": {
      text: "🧠 *Mental Health & Wellbeing*\n\n*Common Signs:*\n• Persistent sadness\n• Loss of interest\n• Sleep problems\n• Difficulty concentrating\n\n*Self-Care Tips:*\n• Talk to trusted friends/family\n• Stay physically active\n• Maintain regular sleep\n• Avoid alcohol/drugs\n\n*When to Seek Help:*\n• Thoughts of self-harm\n• Unable to function daily\n• Symptoms persist >2 weeks\n\n📞 Crisis support: Text MENTAL to 5678\n\n🎧 Mental health audio guide attached.",
      audioUrl: "https://example.com/audio/mental-health-whatsapp.mp3",
    },
  }

  return (
    content[topic as keyof typeof content] || {
      text: "Health information not found. Reply *help* for available topics.",
      audioUrl: "",
    }
  )
}

async function getAppointmentStatusWhatsApp(phoneNumber: string) {
  // Get user's appointment status
  console.log(`Checking WhatsApp appointment status for ${phoneNumber}`)
  return "📅 *Your Appointments*\n\n*Upcoming:*\n• Voice consultation: Today 2:00 PM\n• Follow-up: Next Tuesday 10:00 AM\n\n*Recent:*\n• SMS consultation: Completed yesterday\n• Health education: Malaria prevention\n\n💡 Reply *cancel [time]* to cancel an appointment\n📞 Reply *reschedule* to change appointment time"
}

async function handleNaturalLanguageWhatsApp(phoneNumber: string, message: string) {
  try {
    // Use AI to understand and respond to natural language health queries
    const response = await fetch("/api/ai/health-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        phoneNumber,
        channel: "whatsapp",
      }),
    })

    if (response.ok) {
      const { reply } = await response.json()
      return reply
    }
  } catch (error) {
    console.error("AI WhatsApp processing failed:", error)
  }

  // Fallback to basic keyword matching
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("fever") || lowerMessage.includes("sick") || lowerMessage.includes("pain")) {
    return "🤒 I understand you're not feeling well.\n\n*For immediate help:*\n• Reply *emergency* for urgent care\n• Reply *voice* for consultation call\n• Reply *text* for SMS consultation\n\n🚨 *If severe symptoms:* Call 117 immediately\n\n*Common symptoms I can help with:*\n• Fever, headache, body aches\n• Cough, cold, sore throat\n• Stomach problems\n• General health concerns"
  } else if (lowerMessage.includes("pregnant") || lowerMessage.includes("baby")) {
    return "🤱 *Maternal & Child Health Support*\n\n*For pregnancy:*\n• Reply *maternal* for pregnancy info\n• Reply *voice* for consultation\n• Reply *emergency* if urgent\n\n*For baby/child:*\n• Reply *child* for child health info\n• Reply *book* for pediatric consultation\n\n📞 *Maternal Emergency Hotline:* 1234"
  } else {
    return 'I\'m here to help with your health needs! 🏥\n\n*I can assist with:*\n• 📞 Booking consultations\n• 📚 Health education\n• 🚨 Emergency services\n• 💊 Medication reminders\n\n*Try saying:*\n• "I need a consultation"\n• "Tell me about malaria"\n• "This is an emergency"\n• "Help" for full menu\n\nWhat would you like help with today?'
  }
}

async function sendWhatsAppMessage(to: string, message: string, type = "text", mediaUrl = "") {
  // In a real implementation, this would use WhatsApp Business API
  console.log(`Sending WhatsApp ${type} to ${to}: ${message}`)

  // Log outgoing message
  await logCommunication({
    userId: null,
    phoneNumber: to,
    communicationType: "whatsapp",
    direction: "outbound",
    content: message,
    status: "sent",
  })

  return true
}

async function logCommunication(data: {
  userId: string | null
  phoneNumber: string
  communicationType: string
  direction: string
  content: string
  externalId?: string | null
  status?: string
}) {
  // Log communication to database
  console.log("Logging WhatsApp communication:", data)
  return true
}
