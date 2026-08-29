import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
