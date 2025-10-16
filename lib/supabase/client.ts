import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: new Error("Supabase not configured") }),
    update: () => ({ data: null, error: new Error("Supabase not configured") }),
    delete: () => ({ data: null, error: new Error("Supabase not configured") }),
  }),
})

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()

// Client-side Supabase client for browser usage
export const createClientComponentClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured. Using mock client.")
    return createMockClient()
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
