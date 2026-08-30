import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Build/statik prerender paytida env o'zgaruvchilar bo'lmasa ham modul
// xatoliksiz import bo'lishi uchun placeholder ishlatiladi. Haqiqiy so'rovlar
// faqat isSupabaseConfigured() tekshiruvidan keyin yuboriladi.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

// Tipografiya
export interface Profile {
  id: string
  username: string
  xp: number
  level: number
  streak: number
  daily_goal: number
  last_activity: string
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  correct: number
  wrong: number
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  badge: string
  unlocked_at: string
}
