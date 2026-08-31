/**
 * Admin umumiy xabarlari — barcha foydalanuvchilar qo'ng'iroqda ko'radi.
 * Supabase `app_broadcasts` + mahalliy zaxira.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  author_id: string | null;
  author_name: string;
  created_at: string;
}

const LOCAL_KEY = "corpus-app-broadcasts";
const SEEN_KEY = "corpus-broadcast-seen";

function asBroadcast(row: Record<string, unknown>): Broadcast {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    author_id: row.author_id == null ? null : String(row.author_id),
    author_name: String(row.author_name ?? "Admin"),
    created_at: String(row.created_at ?? ""),
  };
}

function readLocal(): Broadcast[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => asBroadcast(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

function writeLocal(rows: Broadcast[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 100)));
  } catch {
    /* no-op */
  }
}

export function readSeenIds(): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((x) => String(x)));
  } catch {
    return new Set();
  }
}

function writeSeenIds(ids: Set<string>) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids].slice(-200)));
  } catch {
    /* no-op */
  }
}

function merge(remote: Broadcast[], local: Broadcast[]): Broadcast[] {
  const seen = new Set(remote.map((r) => r.id));
  const extra = local.filter((r) => !seen.has(r.id));
  return [...remote, ...extra].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function listBroadcasts(): Promise<Broadcast[]> {
  let remote: Broadcast[] = [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("app_broadcasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) remote = data.map((r) => asBroadcast(r as Record<string, unknown>));
  }
  return merge(remote, readLocal());
}

export async function countUnreadBroadcasts(): Promise<number> {
  const list = await listBroadcasts();
  const seen = readSeenIds();
  return list.filter((b) => !seen.has(b.id)).length;
}

export function markBroadcastsSeen(ids: string[]) {
  const seen = readSeenIds();
  ids.forEach((id) => seen.add(id));
  writeSeenIds(seen);
}

export async function createBroadcast(
  user: AuthUser,
  draft: { title: string; body: string },
): Promise<Broadcast | null> {
  const title = draft.title.trim().slice(0, 80);
  const body = draft.body.trim().slice(0, 800);
  if (!body) return null;
  const payload = {
    title,
    body,
    author_id: user.id,
    author_name: user.username || "Admin",
  };
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("app_broadcasts").insert(payload).select("*").maybeSingle();
    if (!error && data) return asBroadcast(data as Record<string, unknown>);
  }
  const now = new Date().toISOString();
  const row: Broadcast = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    body,
    author_id: user.id,
    author_name: user.username || "Admin",
    created_at: now,
  };
  writeLocal([row, ...readLocal()]);
  return row;
}

export async function deleteBroadcast(id: string): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith("local-")) {
    const { error } = await supabase.from("app_broadcasts").delete().eq("id", id);
    if (!error) return true;
  }
  const rows = readLocal();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  writeLocal(next);
  return true;
}

export function subscribeBroadcasts(onChange: () => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const ch = supabase
    .channel("corpus-app-broadcasts")
    .on("postgres_changes", { event: "*", schema: "public", table: "app_broadcasts" }, () => onChange())
    .subscribe();
  return () => {
    void supabase.removeChannel(ch);
  };
}
