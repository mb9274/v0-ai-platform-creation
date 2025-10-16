import { type NextRequest, NextResponse } from "next/server"

// Voice menu structure for IVR system
const VOICE_MENUS = {
  main: {
    text: "Welcome to HealthWise for Sierra Leone. Press 1 for consultation, 2 for health education, 3 for emergency, or 9 to speak with an operator.",
    options: ["1", "2", "3", "9"],
  },
  consultation: {
    text: "Consultation services. Press 1 to book a voice consultation, 2 for callback request, 3 for emergency, or 9 to return to main menu.",
    options: ["1", "2", "3", "9"],
  },
  education: {
    text: "Health education. Press 1 for malaria prevention, 2 for child health, 3 for maternal health, 4 for mental health, or 9 for main menu.",
    options: ["1", "2", "3", "4", "9"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const sessionId = params.get("sessionId")
    const isActive = params.get("isActive")
    const from = params.get("from")
    const dtmfDigits = params.get("dtmfDigits") || ""
    const callSessionState = params.get("callSessionState")

    console.log("Voice Call:", { sessionId, isActive, from, dtmfDigits, callSessionState })

    // Handle different call states
    if (callSessionState === "Completed") {
      return NextResponse.json({ message: "Call completed" })
    }

    // Parse DTMF input for menu navigation
    const menuPath = dtmfDigits.split("").filter(Boolean)
    const currentLevel = menuPath.length
    const lastInput = menuPath[menuPath.length - 1]

    let response = ""
    let actions: any[] = []

    // Handle menu navigation
    if (currentLevel === 0) {
      // Main menu
      response = VOICE_MENUS.main.text
      actions = [
        {
          action: "say",
          text: response,
        },
        {
          action: "getDigits",
          numDigits: 1,
          timeout: 30,
          finishOnKey: "#",
        },
      ]
    } else if (currentLevel === 1) {
      const choice = menuPath[0]
      switch (choice) {
        case "1":
          response = VOICE_MENUS.consultation.text
          actions = [
            {
              action: "say",
              text: response,
            },
            {
              action: "getDigits",
              numDigits: 1,
              timeout: 30,
            },
          ]
          break
        case "2":
          response = VOICE_MENUS.education.text
          actions = [
            {
              action: "say",
              text: response,
            },
            {
              action: "getDigits",
              numDigits: 1,
              timeout: 30,
            },
          ]
          break
        case "3":
          // Emergency - transfer to emergency services
          response = "Emergency services activated. Transferring your call to emergency medical response."
          actions = [
            {
              action: "say",
              text: response,
            },
            {
              action: "dial",
              phoneNumbers: ["+232117"], // Emergency number
              record: true,
            },
          ]
          await logEmergencyCall(from!)
          break
        case "9":
          // Transfer to human operator
          response = "Connecting you to a healthcare operator. Please hold."
          actions = [
            {
              action: "say",
              text: response,
            },
            {
              action: "dial",
              phoneNumbers: ["+2321234567"], // Operator number
              record: true,
            },
          ]
          break
        default:
          response = "Invalid option. " + VOICE_MENUS.main.text
          actions = [
            {
              action: "say",
              text: response,
            },
            {
              action: "getDigits",
              numDigits: 1,
              timeout: 30,
            },
          ]
      }
    } else if (currentLevel === 2) {
      const mainChoice = menuPath[0]
      const subChoice = menuPath[1]

      if (mainChoice === "1") {
        // Consultation submenu
        switch (subChoice) {
          case "1":
            response =
              "Booking voice consultation. Please hold while we connect you to an available healthcare provider."
            actions = await handleVoiceConsultationBooking(from!)
            break
          case "2":
            response = "Callback request recorded. A healthcare provider will call you back within 2 hours. Thank you."
            actions = [
              {
                action: "say",
                text: response,
              },
            ]
            await handleCallbackRequest(from!)
            break
          case "3":
            response = "Emergency consultation. Connecting to emergency medical services."
            actions = [
              {
                action: "say",
                text: response,
              },
              {
                action: "dial",
                phoneNumbers: ["+232117"],
                record: true,
              },
            ]
            break
          default:
            response = VOICE_MENUS.consultation.text
            actions = [
              {
                action: "say",
                text: response,
              },
              {
                action: "getDigits",
                numDigits: 1,
                timeout: 30,
              },
            ]
        }
      } else if (mainChoice === "2") {
        const educationContent = await getHealthEducationAudio(subChoice, from!)
        response = educationContent.text
        actions = [
          {
            action: "say",
            text: response,
          },
          {
            action: "play",
            url: educationContent.audioUrl,
          },
          {
            action: "say",
            text: "Press 1 to repeat, 2 for more information, or 9 for main menu.",
          },
          {
            action: "getDigits",
            numDigits: 1,
            timeout: 30,
          },
        ]
      }
    }

    // Log voice interaction
    await logCommunication({
      userId: null,
      phoneNumber: from!,
      communicationType: "voice",
      direction: "inbound",
      content: `DTMF: ${dtmfDigits}, Menu: ${menuPath.join("->")}`,
      externalId: sessionId,
    })

    return NextResponse.json({
      actions: actions,
    })
  } catch (error) {
    console.error("Voice Call Error:", error)
    return NextResponse.json({
      actions: [
        {
          action: "say",
          text: "Sorry, there was an error. Please try again later or call our emergency line at 117.",
        },
      ],
    })
  }
}

// Helper functions for voice call handling
async function handleVoiceConsultationBooking(phoneNumber: string) {
  // Find available healthcare provider and create consultation
  console.log(`Voice consultation booking for ${phoneNumber}`)

  // In a real implementation:
  // 1. Check provider availability
  // 2. Create consultation record
  // 3. Connect to provider or schedule callback

  return [
    {
      action: "say",
      text: "Connecting you to Dr. Kamara. Please hold.",
    },
    {
      action: "dial",
      phoneNumbers: ["+232123456789"], // Provider's number
      record: true,
      sequential: true,
    },
  ]
}

async function handleCallbackRequest(phoneNumber: string) {
  // Create callback request in database
  console.log(`Callback request from ${phoneNumber}`)
  return true
}

async function getHealthEducationAudio(topicCode: string, phoneNumber: string) {
  try {
    // Generate AI-powered health education content
    const topicMap = {
      "1": "malaria",
      "2": "child-health",
      "3": "maternal-health",
      "4": "mental-health",
    }

    const topic = topicMap[topicCode as keyof typeof topicMap]

    if (topic) {
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

        // Generate audio URL for the content
        const audioResponse = await fetch("/api/speech/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: content.audioScript || content.content,
            language: "en",
          }),
        })

        return {
          text: `Playing ${content.title} information in English.`,
          audioUrl: `https://example.com/audio/generated/${topic}-${phoneNumber}.mp3`,
          content: content,
        }
      }
    }
  } catch (error) {
    console.error("AI health education generation failed:", error)
  }

  // Fallback to static content
  const topics = {
    "1": {
      text: "Playing malaria prevention information in your preferred language.",
      audioUrl: "https://example.com/audio/malaria-prevention-en.mp3",
    },
    "2": {
      text: "Playing child health information.",
      audioUrl: "https://example.com/audio/child-health-en.mp3",
    },
    "3": {
      text: "Playing maternal health information.",
      audioUrl: "https://example.com/audio/maternal-health-en.mp3",
    },
    "4": {
      text: "Playing mental health information.",
      audioUrl: "https://example.com/audio/mental-health-en.mp3",
    },
  }

  return (
    topics[topicCode as keyof typeof topics] || {
      text: "Content not available.",
      audioUrl: "",
    }
  )
}

async function logEmergencyCall(phoneNumber: string) {
  // Log emergency call for tracking and follow-up
  console.log(`Emergency call logged for ${phoneNumber}`)
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
  console.log("Logging voice communication:", data)
  return true
}
