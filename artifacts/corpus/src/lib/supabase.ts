import { createClient } from "@supabase/supabase-js";

const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Vite builds can be created without credentials. The placeholder keeps module
// imports safe, while auth actions are gated by isSupabaseConfigured.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

// Tipografiya
export interface Profile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  daily_goal: number;
  last_activity: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  correct: number;
  wrong: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge: string;
  unlocked_at: string;
}
