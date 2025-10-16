import { createServerComponentClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@/lib/supabase/client"

export interface User {
  id: string
  phone_number: string
  email?: string
  full_name: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
  location?: string
  preferred_language: string
  role: "patient" | "chw" | "provider" | "admin"
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CHWProfile {
  id: string
  user_id: string
  certification_number?: string
  coverage_area?: string
  specializations: string[]
  is_active: boolean
  created_at: string
}

export interface ProviderProfile {
  id: string
  user_id: string
  license_number?: string
  specialization?: string
  years_experience?: number
  consultation_fee?: number
  availability_schedule?: any
  is_available: boolean
  created_at: string
}

// Server-side user operations
export async function createUser(userData: Partial<User>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("phone_number", phoneNumber).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error)
    throw error
  }

  return data
}

export async function getUserById(userId: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user by ID:", error)
    throw error
  }

  return data
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user:", error)
    throw error
  }

  return data
}

// CHW Profile operations
export async function createCHWProfile(profileData: Partial<CHWProfile>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("chw_profiles").insert([profileData]).select().single()

  if (error) {
    console.error("Error creating CHW profile:", error)
    throw error
  }

  return data
}

export async function getCHWProfile(userId: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("chw_profiles").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching CHW profile:", error)
    throw error
  }

  return data
}

// Provider Profile operations
export async function createProviderProfile(profileData: Partial<ProviderProfile>) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("provider_profiles").insert([profileData]).select().single()

  if (error) {
    console.error("Error creating provider profile:", error)
    throw error
  }

  return data
}

export async function getProviderProfile(userId: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("provider_profiles").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching provider profile:", error)
    throw error
  }

  return data
}

export async function getAvailableProviders(specialization?: string) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("provider_profiles")
    .select(`
      *,
      users!inner(*)
    `)
    .eq("is_available", true)

  if (specialization) {
    query = query.eq("specialization", specialization)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching available providers:", error)
    throw error
  }

  return data
}

// Client-side user operations for components
export async function signUpUser(userData: {
  phoneNumber: string
  fullName: string
  location?: string
  language: string
  role: string
}) {
  const supabase = createClientComponentClient()

  // For now, we'll create users directly in the database
  // In a production app, you'd use Supabase Auth
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        phone_number: userData.phoneNumber,
        full_name: userData.fullName,
        location: userData.location,
        preferred_language: userData.language,
        role: userData.role,
        is_verified: false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error signing up user:", error)
    throw error
  }

  return data
}

export async function signInUser(phoneNumber: string) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("phone_number", phoneNumber).single()

  if (error) {
    console.error("Error signing in user:", error)
    throw error
  }

  return data
}
