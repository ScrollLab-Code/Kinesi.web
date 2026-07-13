import { createClient } from "@supabase/supabase-js"


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

const supabaseUrl = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL)
const supabaseKey = cleanEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

const isConfigured = isValidHttpUrl(supabaseUrl) && !!supabaseKey

if (!isConfigured) {
  console.warn(
    "Supabase no está configurado: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo de entorno o en Vercel."
  )
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : "https://placeholder-ref.supabase.co",
  isConfigured ? supabaseKey : "placeholder-key"
)

