import { createClient } from "@supabase/supabase-js"

const fallbackSupabaseUrl = "https://qjsdteqivrimvffmfafh.supabase.co"
const fallbackSupabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc2R0ZXFpdnJpbXZmZm1mYWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTYzNjMsImV4cCI6MjA5NDY5MjM2M30.udSHZndC03NW71uUAHfpqf5_tm0QNJRyie3P2D5tQU4"

const cleanEnvValue = (value: unknown) => {
  if (typeof value !== "string") return ""
  return value.trim().replace(/^["']|["']$/g, "").trim()
}

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

const envSupabaseUrl = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL)
const envSupabaseKey = cleanEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

const supabaseUrl = isValidHttpUrl(envSupabaseUrl)
  ? envSupabaseUrl
  : fallbackSupabaseUrl
const supabaseKey = envSupabaseKey || fallbackSupabaseKey

export const supabase = createClient(supabaseUrl, supabaseKey)

