import { type NextRequest, NextResponse } from "next/server"

// SMS keyword handlers
const SMS_KEYWORDS = {
  HEALTH:
    "Welcome to HealthConnect! Reply with:\nBOOK - Book consultation\nEDUC - Health education\nEMER - Emergency\nHELP - Get help",
  BOOK: "To book a consultation, reply with:\nVOICE - Voice call\nTEXT - SMS consultation\nEMER - Emergency consultation",
  EDUC: "Health Education Topics:\nMALARIA - Malaria prevention\nCHILD - Child health\nMOM - Maternal health\nMENTAL - Mental health",
  EMER: "EMERGENCY ACTIVATED. Your location and emergency request have been sent to healthcare providers. Help is on the way.",
  HELP: "HealthConnect SMS Commands:\nHEALTH - Main menu\nBOOK - Consultations\nEDUC - Education\nEMER - Emergency\nSTATUS - Check appointments",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const from = params.get("from")
    const text = params.get("text")?.toUpperCase().trim()
    const to = params.get("to")
    const id = params.get("id")

    console.log("SMS Received:", { from, text, to, id })

    if (!from || !text) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Log incoming SMS
    await logCommunication({
      userId: null, // Will be resolved by phone number
      phoneNumber: from,
      communicationType: "sms",
      direction: "inbound",
      content: text,
      externalId: id,
    })

    let responseMessage = ""

    // Handle different SMS keywords
    if (SMS_KEYWORDS[text as keyof typeof SMS_KEYWORDS]) {
      responseMessage = SMS_KEYWORDS[text as keyof typeof SMS_KEYWORDS]
    } else if (text.startsWith("VOICE")) {
      responseMessage = await handleVoiceConsultationSMS(from)
    } else if (text.startsWith("TEXT")) {
      responseMessage = await handleTextConsultationSMS(from, text)
    } else if (text.startsWith("MALARIA")) {
      responseMessage = await sendHealthEducationSMS(from, "malaria")
    } else if (text.startsWith("CHILD")) {
      responseMessage = await sendHealthEducationSMS(from, "child-health")
    } else if (text.startsWith("MOM")) {
      responseMessage = await sendHealthEducationSMS(from, "maternal-health")
    } else if (text.startsWith("MENTAL")) {
      responseMessage = await sendHealthEducationSMS(from, "mental-health")
    } else if (text.startsWith("STATUS")) {
      responseMessage = await getAppointmentStatus(from)
    } else {
      // Handle natural language or unknown commands
      responseMessage = await handleNaturalLanguageSMS(from, text)
    }

    // Send response SMS
    await sendSMS(from, responseMessage)

    return NextResponse.json({ success: true, message: "SMS processed" })
  } catch (error) {
    console.error("SMS Processing Error:", error)
    return NextResponse.json({ error: "Failed to process SMS" }, { status: 500 })
  }
}

// Helper functions
async function handleVoiceConsultationSMS(phoneNumber: string) {
  // Create voice consultation request
  console.log(`Voice consultation SMS request from ${phoneNumber}`)
  return "Voice consultation booked! A healthcare provider will call you within 30 minutes. Reply CANCEL to cancel."
}

async function handleTextConsultationSMS(phoneNumber: string, message: string) {
  // Handle text-based consultation
  const symptoms = message.replace("TEXT", "").trim()
  console.log(`Text consultation from ${phoneNumber}: ${symptoms}`)

  // In a real implementation, this would:
  // 1. Create consultation record
  // 2. Notify available CHW
  // 3. Start SMS conversation thread

  return "Thank you for your consultation request. A Community Health Worker will respond via SMS within 1 hour. Please describe your symptoms in detail."
}

async function handleNaturalLanguageSMS(phoneNumber: string, message: string) {
  try {
    // Use AI to understand and respond to natural language health queries
    const response = await fetch("/api/ai/health-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        phoneNumber,
        channel: "sms",
      }),
    })

    if (response.ok) {
      const { reply } = await response.json()
      return reply
    }
  } catch (error) {
    console.error("AI SMS processing failed:", error)
  }

  // Fallback to basic keyword matching
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("fever") || lowerMessage.includes("sick") || lowerMessage.includes("pain")) {
    return "I understand you're not feeling well. Reply EMER for emergency or BOOK for consultation. If severe, call 117 immediately."
  } else if (lowerMessage.includes("pregnant") || lowerMessage.includes("baby")) {
    return "For pregnancy/baby health: Reply MOM for maternal health info or BOOK for consultation with maternal health specialist."
  } else if (lowerMessage.includes("help") || lowerMessage.includes("?")) {
    return SMS_KEYWORDS.HELP
  } else {
    return "I didn't understand. Reply HELP for commands or HEALTH for main menu. For emergencies, call 117."
  }
}

async function sendHealthEducationSMS(phoneNumber: string, topic: string) {
  try {
    // Generate personalized health education content
    const response = await fetch("/api/ai/health-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        language: "English",
        userProfile: { phoneNumber },
      }),
    })

    if (response.ok) {
      const { content } = await response.json()
      // Format for SMS (160 char limit per message)
      const keyPoints = content.keyPoints?.slice(0, 3).join("\n• ") || ""
      return `${content.title.toUpperCase()}:\n• ${keyPoints}\n\nFor audio: Call 1234, press ${getTopicCode(topic)}`
    }
  } catch (error) {
    console.error("AI health content generation failed:", error)
  }

  // Fallback to static content
  const educationContent = {
    malaria:
      "MALARIA PREVENTION:\n• Use bed nets every night\n• Clear stagnant water\n• Seek treatment for fever\n• Take prescribed medication fully\n\nFor audio: Call 1234, press 1",
    "child-health":
      "CHILD HEALTH:\n• Breastfeed exclusively for 6 months\n• Vaccinate on schedule\n• Watch for danger signs\n• Ensure proper nutrition\n\nFor audio: Call 1234, press 2",
    "maternal-health":
      "MATERNAL HEALTH:\n• Attend all prenatal visits\n• Deliver at health facility\n• Recognize danger signs\n• Eat nutritious foods\n\nFor audio: Call 1234, press 3",
    "mental-health":
      "MENTAL HEALTH:\n• Talk to trusted people\n• Stay physically active\n• Avoid alcohol/drugs\n• Seek help when needed\n\nFor audio: Call 1234, press 4",
  }

  return educationContent[topic as keyof typeof educationContent] || "Health information not found."
}

function getTopicCode(topic: string): string {
  const codes = { malaria: "1", "child-health": "2", "maternal-health": "3", "mental-health": "4" }
  return codes[topic as keyof typeof codes] || "0"
}

async function getAppointmentStatus(phoneNumber: string) {
  // Check appointment status for user
  console.log(`Checking appointment status for ${phoneNumber}`)
  return "APPOINTMENTS:\n• Voice consultation: Today 2:00 PM\n• Follow-up: Next week\n\nReply CANCEL [time] to cancel"
}

async function sendSMS(to: string, message: string) {
  // In a real implementation, this would use Africa's Talking SMS API
  console.log(`Sending SMS to ${to}: ${message}`)

  // Log outgoing SMS
  await logCommunication({
    userId: null,
    phoneNumber: to,
    communicationType: "sms",
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
  console.log("Logging communication:", data)
  return true
}
