import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://qjsdteqivrimvffmfafh.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc2R0ZXFpdnJpbXZmZm1mYWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTYzNjMsImV4cCI6MjA5NDY5MjM2M30.udSHZndC03NW71uUAHfpqf5_tm0QNJRyie3P2D5tQU4"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
