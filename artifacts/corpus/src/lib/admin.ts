/**
 * Admin panel yordamchi funksiyalari:
 *  - Admin PIN bilan kirish (xavfsizlik uchun ikkinchi daraja)
 *  - Barcha foydalanuvchilar ro'yxati
 *  - Admin ↔ foydalanuvchi yozishmalar (chat)
 *
 * Supabase sozlanmagan bo'lsa mahalliy (localStorage) zaxira ishlatiladi.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";

/** Admin panelni ochish uchun kerakli maxfiy PIN. */
export const ADMIN_PIN = "1030";

/** Sessiya davomida admin PIN kiritilganini eslab qolish (localStorage). */
const UNLOCK_KEY = "corpus-admin-unlocked";
const ADMIN_CHAT_KEY = "corpus-admin-chats";

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  xp: number;
  streak: number;
  level: number;
  avatar: string | null;
  last_activity: string | null;
  is_admin: boolean;
}

export interface AdminMessage {
  id: string;
  user_id: string;
  from_admin: boolean;
  author_name: string;
  body: string;
  created_at: string;
}

/** PIN to'g'ri bo'lsa admin panelni qulfdan ochadi. */
export function unlockAdmin(pin: string): boolean {
  if (pin.trim() !== ADMIN_PIN) return false;
  if (typeof localStorage === "undefined") return true;
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    /* no-op */
  }
  return true;
}

export function isAdminUnlocked(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function lockAdmin() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* no-op */
  }
}

function asAdminUser(row: Record<string, unknown>): AdminUser {
  return {
    id: String(row.id),
    username: String(row.username ?? "user"),
    email: (row.email as string | null) ?? null,
    xp: Number(row.xp ?? 0),
    streak: Number(row.streak ?? 0),
    level: Number(row.level ?? 1),
    avatar: (row.avatar as string | null) ?? null,
    last_activity: (row.last_activity as string | null) ?? null,
    is_admin: Boolean(row.is_admin),
  };
}

/** Barcha foydalanuvchilarni (Supabase profiles) XP bo'yicha qaytaradi. */
export async function listUsers(): Promise<AdminUser[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, xp, streak, level, avatar, last_activity, is_admin")
      .order("xp", { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return data.map((r) => asAdminUser(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

/* ---------- Chat (Supabase `admin_messages` + local backup) ---------- */

function readLocalChats(): Record<string, AdminMessage[]> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(ADMIN_CHAT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Record<string, AdminMessage[]>;
    return {};
  } catch {
    return {};
  }
}

function writeLocalChats(map: Record<string, AdminMessage[]>) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ADMIN_CHAT_KEY, JSON.stringify(map));
  } catch {
    /* no-op */
  }
}

async function remoteMessages(userId: string): Promise<AdminMessage[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("admin_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error || !data) return [];
    return data.map((r) => ({
      id: String(r.id),
      user_id: String(r.user_id),
      from_admin: Boolean(r.from_admin),
      author_name: String(r.author_name ?? "Admin"),
      body: String(r.body ?? ""),
      created_at: String(r.created_at ?? ""),
    }));
  } catch {
    return [];
  }
}

/** Foydalanuvchi bilan yozishmalar tarixi. */
export async function listMessages(userId: string): Promise<AdminMessage[]> {
  const local = readLocalChats()[userId] ?? [];
  const remote = await remoteMessages(userId);
  const seen = new Set(remote.map((m) => m.id));
  const extra = local.filter((m) => !seen.has(m.id));
  return [...remote, ...extra].sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
}

/**
 * Xabar yuboradi (admin -> foydalanuvchi). `from_admin` false bo'lsa
 * foydalanuvchi tomoni sifatida saqlanadi (javoblar uchun).
 */
export async function sendMessage(
  userId: string,
  body: string,
  opts: { fromAdmin?: boolean; authorName?: string } = {},
): Promise<AdminMessage | null> {
  const clean = body.trim().slice(0, 1000);
  if (!clean || !userId) return null;
  const fromAdmin = opts.fromAdmin !== false;
  const authorName = opts.authorName || "Admin";

  if (isSupabaseConfigured) {
    const payload = {
      user_id: userId,
      from_admin: fromAdmin,
      author_name: authorName,
      body: clean,
    };
    const { data, error } = await supabase
      .from("admin_messages")
      .insert(payload)
      .select("*")
      .maybeSingle();
    if (!error && data) {
      return {
        id: String(data.id),
        user_id: String(data.user_id),
        from_admin: Boolean(data.from_admin),
        author_name: String(data.author_name ?? authorName),
        body: String(data.body ?? clean),
        created_at: String(data.created_at ?? new Date().toISOString()),
      };
    }
  }

  const now = new Date().toISOString();
  const row: AdminMessage = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: userId,
    from_admin: fromAdmin,
    author_name: authorName,
    body: clean,
    created_at: now,
  };
  const map = readLocalChats();
  map[userId] = [...(map[userId] ?? []), row];
  writeLocalChats(map);
  return row;
}

/** Admin chat o'zgarishlariga obuna (real-time) — Supabase bo'lsa ishlaydi. */
export function subscribeMessages(userId: string, onChange: (rows: AdminMessage[]) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel(`admin-chat:${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "admin_messages", filter: `user_id=eq.${userId}` },
      async () => {
        onChange(await remoteMessages(userId));
      },
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
