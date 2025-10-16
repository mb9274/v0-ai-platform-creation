import { createServerComponentClient } from "@/lib/supabase/server"

export interface CommunicationLog {
  id: string
  user_id?: string
  phone_number?: string
  communication_type: "sms" | "ussd" | "voice" | "whatsapp"
  direction: "inbound" | "outbound"
  content: string
  status: "sent" | "delivered" | "failed" | "pending"
  external_id?: string
  cost?: number
  created_at: string
}

// Log communication events
export async function logCommunication(data: {
  userId?: string | null
  phoneNumber: string
  communicationType: "sms" | "ussd" | "voice" | "whatsapp"
  direction: "inbound" | "outbound"
  content: string
  externalId?: string | null
  status?: string
  cost?: number
}) {
  const supabase = createServerComponentClient()

  // Try to find user by phone number if userId not provided
  let userId = data.userId
  if (!userId && data.phoneNumber) {
    const { data: user } = await supabase.from("users").select("id").eq("phone_number", data.phoneNumber).single()

    userId = user?.id
  }

  const logEntry = {
    user_id: userId,
    phone_number: data.phoneNumber,
    communication_type: data.communicationType,
    direction: data.direction,
    content: data.content,
    external_id: data.externalId,
    status: data.status || "sent",
    cost: data.cost,
  }

  const { data: result, error } = await supabase.from("communication_logs").insert([logEntry]).select().single()

  if (error) {
    console.error("Error logging communication:", error)
    throw error
  }

  return result
}

// Get communication history for a user
export async function getCommunicationHistory(phoneNumber: string, type?: string, limit = 50) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("communication_logs")
    .select("*")
    .eq("phone_number", phoneNumber)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq("communication_type", type)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching communication history:", error)
    throw error
  }

  return data
}

// Get communication stats
export async function getCommunicationStats(dateFrom?: string, dateTo?: string) {
  const supabase = createServerComponentClient()

  let query = supabase.from("communication_logs").select("communication_type, direction, status, created_at")

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching communication stats:", error)
    throw error
  }

  // Process stats
  const stats = {
    total: data?.length || 0,
    byType: {} as Record<string, number>,
    byDirection: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
  }

  data?.forEach((log) => {
    stats.byType[log.communication_type] = (stats.byType[log.communication_type] || 0) + 1
    stats.byDirection[log.direction] = (stats.byDirection[log.direction] || 0) + 1
    stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1
  })

  return stats
}
