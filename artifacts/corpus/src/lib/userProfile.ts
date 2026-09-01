/**
 * Foydalanuvchining OMMAVIY profili — boshqa foydalanuvchilar profillarini
 * ko'rish uchun. `profiles` jadvali public-read RLS qoidasiga ega, shuning
 * uchun har qanday autentifikatsiya qilgan foydalanuvchi boshqasini ko'ra oladi.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface PublicProfile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  daily_goal: number;
  week_xp: number;
  week_key: string;
  league_index: number;
  battles_won: number;
  battles_lost: number;
  avatar: string | null;
  birth_year: number | null;
  is_admin: boolean;
  last_activity: string | null;
  created_at: string | null;
  badges: string[];
}

function asPublicProfile(row: Record<string, unknown>): PublicProfile {
  return {
    id: String(row.id),
    username: String(row.username ?? "user"),
    xp: Number(row.xp ?? 0),
    level: Number(row.level ?? 1),
    streak: Number(row.streak ?? 0),
    daily_goal: Number(row.daily_goal ?? 20),
    week_xp: Number(row.week_xp ?? 0),
    week_key: String(row.week_key ?? ""),
    league_index: Number(row.league_index ?? 0),
    battles_won: Number(row.battles_won ?? 0),
    battles_lost: Number(row.battles_lost ?? 0),
    avatar: (row.avatar as string | null) ?? null,
    birth_year: row.birth_year == null ? null : Number(row.birth_year),
    is_admin: Boolean(row.is_admin),
    last_activity: (row.last_activity as string | null) ?? null,
    created_at: (row.created_at as string | null) ?? null,
    badges: [],
  };
}

/** Bitta foydalanuvchining ochiq profilini qaytaradi. */
export async function fetchPublicProfile(userId: string): Promise<PublicProfile | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const profile = asPublicProfile(data as Record<string, unknown>);

    // Yutuqlar (badges) — public emas, lekin admin uchun foydali.
    const { data: trophies } = await supabase
      .from("achievements")
      .select("badge")
      .eq("user_id", userId);
    profile.badges = (trophies ?? []).map((b) => String((b as { badge?: unknown }).badge ?? ""));
    return profile;
  } catch {
    return null;
  }
}
