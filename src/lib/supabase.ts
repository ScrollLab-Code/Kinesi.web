import { createClient } from '@supabase/supabase-js'

const normalizeSupabaseUrl = (value: string) => {
  const cleanValue = value.trim().replace(/\/$/, '')
  if (!cleanValue) return cleanValue
  return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL ?? '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
