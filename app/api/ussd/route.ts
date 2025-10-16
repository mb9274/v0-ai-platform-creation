import { type NextRequest, NextResponse } from "next/server"

// USSD Menu Structure for *123# access
const USSD_MENUS = {
  main: {
    text: "Welcome to HealthConnect\n1. Book Consultation\n2. Health Education\n3. Emergency Services\n4. My Account\n0. Exit",
    options: ["1", "2", "3", "4", "0"],
  },
  consultation: {
    text: "Book Consultation\n1. Voice Call\n2. SMS Consultation\n3. Emergency\n9. Back\n0. Exit",
    options: ["1", "2", "3", "9", "0"],
  },
  education: {
    text: "Health Education\n1. Malaria Prevention\n2. Child Health\n3. Maternal Health\n4. Mental Health\n9. Back\n0. Exit",
    options: ["1", "2", "3", "4", "9", "0"],
  },
  emergency: {
    text: "EMERGENCY SERVICES\n1. Call Emergency (117)\n2. Send Location SMS\n3. Maternal Emergency\n9. Back\n0. Exit",
    options: ["1", "2", "3", "9", "0"],
  },
  account: {
    text: "My Account\n1. View Profile\n2. Recent Consultations\n3. Update Language\n9. Back\n0. Exit",
    options: ["1", "2", "3", "9", "0"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const sessionId = params.get("sessionId")
    const serviceCode = params.get("serviceCode")
    const phoneNumber = params.get("phoneNumber")
    const text = params.get("text") || ""

    console.log("USSD Request:", { sessionId, serviceCode, phoneNumber, text })

    // Parse user input
    const inputs = text.split("*").filter(Boolean)
    const currentInput = inputs[inputs.length - 1] || ""
    const menuLevel = inputs.length

    let response = ""
    let continueSession = true

    // Handle menu navigation
    if (menuLevel === 0) {
      // Main menu
      response = USSD_MENUS.main.text
    } else if (menuLevel === 1) {
      const choice = inputs[0]
      switch (choice) {
        case "1":
          response = USSD_MENUS.consultation.text
          break
        case "2":
          response = USSD_MENUS.education.text
          break
        case "3":
          response = USSD_MENUS.emergency.text
          break
        case "4":
          response = USSD_MENUS.account.text
          break
        case "0":
          response = "Thank you for using HealthConnect. Stay healthy!"
          continueSession = false
          break
        default:
          response = "Invalid option. " + USSD_MENUS.main.text
      }
    } else if (menuLevel === 2) {
      const mainChoice = inputs[0]
      const subChoice = inputs[1]

      if (mainChoice === "1") {
        // Consultation submenu
        switch (subChoice) {
          case "1":
            response = await handleVoiceConsultationRequest(phoneNumber!)
            continueSession = false
            break
          case "2":
            response = "SMS consultation request sent. A CHW will contact you within 30 minutes."
            await handleSMSConsultationRequest(phoneNumber!)
            continueSession = false
            break
          case "3":
            response = "EMERGENCY: Connecting you to emergency services..."
            await handleEmergencyRequest(phoneNumber!)
            continueSession = false
            break
          case "9":
            response = USSD_MENUS.main.text
            break
          case "0":
            response = "Thank you for using HealthConnect."
            continueSession = false
            break
          default:
            response = "Invalid option. " + USSD_MENUS.consultation.text
        }
      } else if (mainChoice === "2") {
        // Health education submenu
        switch (subChoice) {
          case "1":
            response = await sendHealthEducationContent(phoneNumber!, "malaria")
            continueSession = false
            break
          case "2":
            response = await sendHealthEducationContent(phoneNumber!, "child-health")
            continueSession = false
            break
          case "3":
            response = await sendHealthEducationContent(phoneNumber!, "maternal-health")
            continueSession = false
            break
          case "4":
            response = await sendHealthEducationContent(phoneNumber!, "mental-health")
            continueSession = false
            break
          case "9":
            response = USSD_MENUS.main.text
            break
          default:
            response = "Invalid option. " + USSD_MENUS.education.text
        }
      } else if (mainChoice === "3") {
        // Emergency submenu
        switch (subChoice) {
          case "1":
            response = "Calling emergency services (117)..."
            await initiateEmergencyCall(phoneNumber!)
            continueSession = false
            break
          case "2":
            response = "Emergency SMS with your location has been sent to emergency contacts."
            await sendEmergencyLocationSMS(phoneNumber!)
            continueSession = false
            break
          case "3":
            response = "Connecting to maternal emergency hotline..."
            await initiateMaternalEmergencyCall(phoneNumber!)
            continueSession = false
            break
          default:
            response = "Invalid option. " + USSD_MENUS.emergency.text
        }
      }
    }

    // Format response for Africa's Talking
    const responseText = continueSession ? `CON ${response}` : `END ${response}`

    return new NextResponse(responseText, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("USSD Error:", error)
    return new NextResponse("END Sorry, there was an error. Please try again later.", {
      headers: { "Content-Type": "text/plain" },
    })
  }
}

// Helper functions for USSD actions
async function handleVoiceConsultationRequest(phoneNumber: string) {
  // In a real implementation, this would:
  // 1. Create a consultation record in the database
  // 2. Find an available healthcare provider
  // 3. Initiate a voice call connection
  console.log(`Voice consultation requested for ${phoneNumber}`)
  return "Voice consultation request received. A healthcare provider will call you within 15 minutes."
}

async function handleSMSConsultationRequest(phoneNumber: string) {
  // Create SMS consultation record and notify CHW
  console.log(`SMS consultation requested for ${phoneNumber}`)
  return true
}

async function handleEmergencyRequest(phoneNumber: string) {
  // Handle emergency request - highest priority
  console.log(`Emergency request from ${phoneNumber}`)
  return true
}

async function sendHealthEducationContent(phoneNumber: string, topic: string) {
  try {
    // Generate AI-powered health content
    const response = await fetch("/api/ai/health-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        language: "English", // Default, could be determined by user profile
        userProfile: { phoneNumber },
      }),
    })

    if (response.ok) {
      const { content } = await response.json()
      // Truncate for USSD (160 char limit)
      const shortContent = content.keyPoints?.slice(0, 2).join(". ") || content.title
      return `${shortContent}\n\nFor full audio guide: Call 1234, press ${getTopicCode(topic)}`
    }
  } catch (error) {
    console.error("AI content generation failed:", error)
  }

  // Fallback to static content
  const topics = {
    malaria: "Malaria prevention tips sent via SMS. Audio content: Call 1234 and press 1.",
    "child-health": "Child health information sent. Audio content: Call 1234 and press 2.",
    "maternal-health": "Maternal health guide sent. Audio content: Call 1234 and press 3.",
    "mental-health": "Mental health resources sent. Audio content: Call 1234 and press 4.",
  }

  return topics[topic as keyof typeof topics] || "Health information sent to your phone."
}

function getTopicCode(topic: string): string {
  const codes = { malaria: "1", "child-health": "2", "maternal-health": "3", "mental-health": "4" }
  return codes[topic as keyof typeof codes] || "0"
}

async function initiateEmergencyCall(phoneNumber: string) {
  // Initiate emergency call through Africa's Talking Voice API
  console.log(`Initiating emergency call for ${phoneNumber}`)
  return true
}

async function sendEmergencyLocationSMS(phoneNumber: string) {
  // Send emergency SMS with location to emergency contacts
  console.log(`Sending emergency location SMS for ${phoneNumber}`)
  return true
}

async function initiateMaternalEmergencyCall(phoneNumber: string) {
  // Connect to maternal emergency hotline
  console.log(`Maternal emergency call for ${phoneNumber}`)
  return true
}
