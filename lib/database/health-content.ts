import { createServerComponentClient } from "@/lib/supabase/server"

export interface HealthContent {
  id: string
  title: string
  content_type: "audio" | "text" | "video" | "image"
  content_url?: string
  transcript?: string
  language: string
  category: string
  target_audience: "general" | "pregnant_women" | "children" | "elderly"
  duration_seconds?: number
  is_published: boolean
  created_at: string
}

// Get published health content
export async function getHealthContent(category?: string, language?: string, targetAudience?: string, limit = 20) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("health_content")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq("category", category)
  }
  if (language) {
    query = query.eq("language", language)
  }
  if (targetAudience) {
    query = query.eq("target_audience", targetAudience)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching health content:", error)
    throw error
  }

  return data
}

// Get health content by ID
export async function getHealthContentById(contentId: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("health_content")
    .select("*")
    .eq("id", contentId)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error("Error fetching health content by ID:", error)
    throw error
  }

  return data
}

// Create health content (admin only)
export async function createHealthContent(contentData: Partial<HealthContent>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("health_content").insert([contentData]).select().single()

  if (error) {
    console.error("Error creating health content:", error)
    throw error
  }

  return data
}

// Get content categories
export async function getContentCategories() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("health_content").select("category").eq("is_published", true)

  if (error) {
    console.error("Error fetching content categories:", error)
    throw error
  }

  // Get unique categories
  const categories = [...new Set(data?.map((item) => item.category) || [])]
  return categories
}

// Search health content
export async function searchHealthContent(searchTerm: string, language?: string, limit = 10) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("health_content")
    .select("*")
    .eq("is_published", true)
    .or(`title.ilike.%${searchTerm}%,transcript.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (language) {
    query = query.eq("language", language)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error searching health content:", error)
    throw error
  }

  return data
}
