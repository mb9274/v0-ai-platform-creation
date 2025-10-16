import { createServerComponentClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@/lib/supabase/client"

export interface Consultation {
  id: string
  patient_id: string
  provider_id?: string
  chw_id?: string
  consultation_type: "voice" | "ussd" | "sms" | "whatsapp" | "web"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  symptoms?: string
  diagnosis?: string
  treatment_plan?: string
  follow_up_date?: string
  consultation_fee?: number
  payment_status: "pending" | "paid" | "voucher_used"
  session_recording_url?: string
  created_at: string
  completed_at?: string
}

export interface ConsultationWithDetails extends Consultation {
  patient: {
    id: string
    full_name: string
    phone_number: string
    location?: string
  }
  provider?: {
    id: string
    full_name: string
    specialization?: string
  }
  chw?: {
    id: string
    full_name: string
    coverage_area?: string
  }
}

// Create a new consultation
export async function createConsultation(consultationData: Partial<Consultation>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("consultations").insert([consultationData]).select().single()

  if (error) {
    console.error("Error creating consultation:", error)
    throw error
  }

  return data
}

// Get consultations for a patient
export async function getPatientConsultations(patientId: string, limit = 10) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("consultations")
    .select(`
      *,
      provider:provider_id(id, full_name),
      chw:chw_id(id, full_name)
    `)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching patient consultations:", error)
    throw error
  }

  return data
}

// Get consultations for a provider
export async function getProviderConsultations(providerId: string, status?: string) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("consultations")
    .select(`
      *,
      patient:patient_id(id, full_name, phone_number, location)
    `)
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching provider consultations:", error)
    throw error
  }

  return data
}

// Get consultations for a CHW
export async function getCHWConsultations(chwId: string, status?: string) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("consultations")
    .select(`
      *,
      patient:patient_id(id, full_name, phone_number, location)
    `)
    .eq("chw_id", chwId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching CHW consultations:", error)
    throw error
  }

  return data
}

// Update consultation status and details
export async function updateConsultation(consultationId: string, updates: Partial<Consultation>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("consultations")
    .update(updates)
    .eq("id", consultationId)
    .select()
    .single()

  if (error) {
    console.error("Error updating consultation:", error)
    throw error
  }

  return data
}

// Assign provider to consultation
export async function assignProviderToConsultation(consultationId: string, providerId: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("consultations")
    .update({
      provider_id: providerId,
      status: "in_progress",
    })
    .eq("id", consultationId)
    .select()
    .single()

  if (error) {
    console.error("Error assigning provider:", error)
    throw error
  }

  return data
}

// Get pending consultations for assignment
export async function getPendingConsultations(specialization?: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("consultations")
    .select(`
      *,
      patient:patient_id(id, full_name, phone_number, location, preferred_language)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching pending consultations:", error)
    throw error
  }

  return data
}

// Complete consultation
export async function completeConsultation(
  consultationId: string,
  diagnosis: string,
  treatmentPlan: string,
  followUpDate?: string,
) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("consultations")
    .update({
      status: "completed",
      diagnosis,
      treatment_plan: treatmentPlan,
      follow_up_date: followUpDate,
      completed_at: new Date().toISOString(),
    })
    .eq("id", consultationId)
    .select()
    .single()

  if (error) {
    console.error("Error completing consultation:", error)
    throw error
  }

  return data
}

// Client-side consultation operations
export async function bookConsultation(consultationData: {
  patientId: string
  consultationType: string
  symptoms: string
  urgency: string
  preferredTime?: string
  preferredDate?: string
  specialization?: string
}) {
  const supabase = createClientComponentClient()

  const consultation = {
    patient_id: consultationData.patientId,
    consultation_type: consultationData.consultationType as Consultation["consultation_type"],
    symptoms: consultationData.symptoms,
    status: consultationData.urgency === "emergency" ? "in_progress" : "pending",
    consultation_fee: consultationData.consultationType === "voice" ? 25000 : 0,
    payment_status: "pending" as const,
  }

  const { data, error } = await supabase.from("consultations").insert([consultation]).select().single()

  if (error) {
    console.error("Error booking consultation:", error)
    throw error
  }

  return data
}
