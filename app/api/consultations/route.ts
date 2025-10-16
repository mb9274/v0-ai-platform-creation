import { type NextRequest, NextResponse } from "next/server"
import { getPatientConsultations, createConsultation, assignProviderToConsultation } from "@/lib/database/consultations"
import { getUserByPhoneNumber, getAvailableProviders } from "@/lib/database/users"
import { logCommunication } from "@/lib/database/communications"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const phoneNumber = searchParams.get("phoneNumber")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let patientId = userId

    // If phone number provided, find user
    if (!patientId && phoneNumber) {
      const user = await getUserByPhoneNumber(phoneNumber)
      patientId = user?.id
    }

    if (!patientId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const consultations = await getPatientConsultations(patientId, limit)

    return NextResponse.json({
      consultations,
      total: consultations.length,
    })
  } catch (error) {
    console.error("Get consultations error:", error)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientId,
      phoneNumber,
      consultationType,
      symptoms,
      urgency,
      preferredTime,
      preferredDate,
      specialization,
    } = body

    // Validate required fields
    if ((!patientId && !phoneNumber) || !consultationType || !symptoms) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let finalPatientId = patientId

    // Find user by phone number if patientId not provided
    if (!finalPatientId && phoneNumber) {
      const user = await getUserByPhoneNumber(phoneNumber)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      finalPatientId = user.id
    }

    // Create consultation record
    const consultationData = {
      patient_id: finalPatientId,
      consultation_type: consultationType as any,
      status: urgency === "emergency" ? "in_progress" : "pending",
      symptoms,
      consultation_fee: consultationType === "voice" ? 25000 : 0,
      payment_status: "pending" as const,
    }

    const consultation = await createConsultation(consultationData)

    // Handle emergency cases immediately
    if (urgency === "emergency") {
      await handleEmergencyConsultation(consultation, phoneNumber)
    } else {
      // Try to assign provider automatically
      await tryAssignProvider(consultation, specialization)
    }

    // Log the consultation request
    if (phoneNumber) {
      await logCommunication({
        phoneNumber,
        communicationType: consultationType === "web" ? "sms" : consultationType,
        direction: "inbound",
        content: `Consultation request: ${symptoms}`,
        status: "received",
      })
    }

    return NextResponse.json({
      success: true,
      consultation,
      message: "Consultation booked successfully",
    })
  } catch (error) {
    console.error("Create consultation error:", error)
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 })
  }
}

async function handleEmergencyConsultation(consultation: any, phoneNumber?: string) {
  console.log("Handling emergency consultation:", consultation.id)

  // Get available emergency providers
  const providers = await getAvailableProviders("emergency")

  if (providers.length > 0) {
    // Assign to first available emergency provider
    await assignProviderToConsultation(consultation.id, providers[0].user_id)

    // Send immediate notification (in real app, this would trigger actual calls/SMS)
    if (phoneNumber) {
      await logCommunication({
        phoneNumber,
        communicationType: "sms",
        direction: "outbound",
        content: "EMERGENCY: Healthcare provider will contact you immediately. Stay calm.",
        status: "sent",
      })
    }
  }

  return true
}

async function tryAssignProvider(consultation: any, specialization?: string) {
  console.log("Trying to assign provider for consultation:", consultation.id)

  // Get available providers
  const providers = await getAvailableProviders(specialization)

  if (providers.length > 0) {
    // Simple assignment to first available provider
    // In a real system, this would consider workload, ratings, etc.
    await assignProviderToConsultation(consultation.id, providers[0].user_id)
  }

  return true
}
