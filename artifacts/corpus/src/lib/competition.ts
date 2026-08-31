/**
 * Jonli raqobat — haqiqiy foydalanuvchilar reytingi va 1ga-1 bellashuv.
 * Supabase sozlanmagan yoki jadval yo'q bo'lsa, chaqiruvchi virtual/bot rejimiga tushadi.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";
import { BATTLE_Q_COUNT, makeBattleSeed, randomBattleCode } from "@/utils/quizPool";
import { hueColor } from "@/utils/league";

export type BattleStatus = "waiting" | "active" | "finished" | "cancelled";

export interface BattleRow {
  id: string;
  code: string | null;
  status: BattleStatus;
  host_id: string;
  guest_id: string | null;
  host_name: string;
  guest_name: string | null;
  seed: string;
  q_count: number;
  host_score: number;
  guest_score: number;
  host_done: boolean;
  guest_done: boolean;
  winner_id: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface RankEntry {
  id?: string;
  name: string;
  xp: number;
  isYou: boolean;
  hue: number;
  live: boolean;
  streak?: number;
  wins?: number;
  losses?: number;
}

export type RankKind = "week" | "all" | "arena";

export function isOnlineArena(): boolean {
  return isSupabaseConfigured;
}

function asBattle(row: Record<string, unknown>): BattleRow {
  return {
    id: String(row.id),
    code: (row.code as string | null) ?? null,
    status: (row.status as BattleStatus) ?? "waiting",
    host_id: String(row.host_id),
    guest_id: (row.guest_id as string | null) ?? null,
    host_name: String(row.host_name ?? "Host"),
    guest_name: (row.guest_name as string | null) ?? null,
    seed: String(row.seed ?? ""),
    q_count: Number(row.q_count ?? BATTLE_Q_COUNT),
    host_score: Number(row.host_score ?? 0),
    guest_score: Number(row.guest_score ?? 0),
    host_done: Boolean(row.host_done),
    guest_done: Boolean(row.guest_done),
    winner_id: (row.winner_id as string | null) ?? null,
    created_at: String(row.created_at ?? ""),
    started_at: (row.started_at as string | null) ?? null,
    finished_at: (row.finished_at as string | null) ?? null,
  };
}

export async function fetchOnlineCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("last_activity", today);
    if (error || count == null) return 0;
    return count;
  } catch {
    return 0;
  }
}

export async function fetchRankings(
  kind: RankKind,
  you: { id?: string; name: string; xp: number; weekXp: number; wins: number; losses: number },
): Promise<{ live: boolean; rows: RankEntry[] }> {
  const youEntry = (xp: number): RankEntry => ({
    id: you.id,
    name: you.name || "Siz",
    xp,
    isYou: true,
    hue: 262,
    live: Boolean(you.id),
    wins: you.wins,
    losses: you.losses,
  });

  if (!isSupabaseConfigured) {
    return { live: false, rows: [youEntry(kind === "week" ? you.weekXp : kind === "arena" ? you.wins : you.xp)] };
  }

  const orderCol = kind === "week" ? "week_xp" : kind === "arena" ? "battles_won" : "xp";
  const weekKey = currentWeekKey();

  try {
    let q = supabase
      .from("profiles")
      .select("id, username, xp, streak, week_xp, week_key, battles_won, battles_lost")
      .order(orderCol, { ascending: false })
      .limit(40);

    const { data, error } = await q;
    if (error || !data) {
      // Eski schema (week_xp yo'q) — faqat xp.
      const fallback = await supabase.from("profiles").select("id, username, xp, streak").order("xp", { ascending: false }).limit(40);
      if (fallback.error || !fallback.data) return { live: false, rows: [youEntry(you.xp)] };
      const rows = mergeYou(
        fallback.data.map((p) => ({
          id: p.id as string,
          name: String(p.username || "user"),
          xp: Number(p.xp ?? 0),
          isYou: p.id === you.id,
          hue: hueFromId(String(p.id)),
          live: true,
          streak: Number(p.streak ?? 0),
        })),
        youEntry(you.xp),
      );
      return { live: true, rows };
    }

    const mapped: RankEntry[] = data
      .filter((p) => (kind === "week" ? !p.week_key || p.week_key === weekKey || p.id === you.id : true))
      .map((p) => {
        const xp =
          kind === "week"
            ? Number(p.week_xp ?? 0)
            : kind === "arena"
              ? Number(p.battles_won ?? 0)
              : Number(p.xp ?? 0);
        return {
          id: p.id as string,
          name: String(p.username || "user"),
          xp,
          isYou: p.id === you.id,
          hue: hueFromId(String(p.id)),
          live: true,
          streak: Number(p.streak ?? 0),
          wins: Number(p.battles_won ?? 0),
          losses: Number(p.battles_lost ?? 0),
        };
      });

    const myXp = kind === "week" ? you.weekXp : kind === "arena" ? you.wins : you.xp;
    return { live: true, rows: mergeYou(mapped, youEntry(myXp)) };
  } catch {
    return { live: false, rows: [youEntry(kind === "week" ? you.weekXp : you.xp)] };
  }
}

function mergeYou(rows: RankEntry[], you: RankEntry): RankEntry[] {
  const without = rows.filter((r) => !r.isYou && r.id !== you.id);
  const list = you.id ? [...without, you] : [you, ...without];
  return list.sort((a, b) => b.xp - a.xp || (a.isYou ? -1 : 1)).slice(0, 30);
}

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

function currentWeekKey(): string {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  const mon = new Date(d);
  mon.setHours(0, 0, 0, 0);
  mon.setDate(d.getDate() - day);
  const thu = new Date(mon);
  thu.setDate(mon.getDate() + 3);
  const year = thu.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const wk = 1 + Math.round(((thu.getTime() - jan4.getTime()) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return `${year}-W${String(wk).padStart(2, "0")}`;
}

export async function getBattle(id: string): Promise<BattleRow | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("battles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return asBattle(data as Record<string, unknown>);
}

export async function createBattle(
  user: AuthUser,
  opts: { code?: boolean; scope?: string } = {},
): Promise<BattleRow | null> {
  if (!isSupabaseConfigured) return null;
  const payload = {
    code: opts.code ? randomBattleCode() : null,
    status: "waiting",
    host_id: user.id,
    host_name: user.username,
    seed: makeBattleSeed(opts.scope || "all"),
    q_count: BATTLE_Q_COUNT,
  };
  const { data, error } = await supabase.from("battles").insert(payload).select("*").maybeSingle();
  if (error || !data) return null;
  return asBattle(data as Record<string, unknown>);
}

export async function claimOpenBattle(user: AuthUser, scope = "all"): Promise<BattleRow | null> {
  if (!isSupabaseConfigured) return null;
  const since = new Date(Date.now() - 60_000).toISOString();
  const prefix = `${scope || "all"}::`;
  const { data: open } = await supabase
    .from("battles")
    .select("*")
    .eq("status", "waiting")
    .is("guest_id", null)
    .is("code", null)
    .neq("host_id", user.id)
    .like("seed", `${prefix}%`)
    .gt("created_at", since)
    .order("created_at", { ascending: true })
    .limit(1);

  const row = open?.[0];
  if (!row) return null;

  const { data: claimed, error } = await supabase
    .from("battles")
    .update({
      guest_id: user.id,
      guest_name: user.username,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .is("guest_id", null)
    .eq("status", "waiting")
    .select("*")
    .maybeSingle();

  if (error || !claimed) return null;
  return asBattle(claimed as Record<string, unknown>);
}

export async function joinBattleByCode(user: AuthUser, code: string): Promise<BattleRow | null> {
  if (!isSupabaseConfigured) return null;
  const clean = code.trim().toUpperCase().replace(/\s/g, "");
  if (clean.length < 4) return null;
  const { data: found } = await supabase
    .from("battles")
    .select("*")
    .eq("code", clean)
    .eq("status", "waiting")
    .is("guest_id", null)
    .maybeSingle();
  if (!found || found.host_id === user.id) return null;

  const { data: claimed, error } = await supabase
    .from("battles")
    .update({
      guest_id: user.id,
      guest_name: user.username,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .eq("id", found.id)
    .is("guest_id", null)
    .eq("status", "waiting")
    .select("*")
    .maybeSingle();

  if (error || !claimed) return null;
  return asBattle(claimed as Record<string, unknown>);
}

export async function cancelBattle(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from("battles").update({ status: "cancelled" }).eq("id", id).eq("status", "waiting");
}

export async function pushMyBattleProgress(
  battle: BattleRow,
  userId: string,
  patch: { score: number; done: boolean },
): Promise<BattleRow | null> {
  if (!isSupabaseConfigured) return battle;
  const isHost = battle.host_id === userId;
  const body = isHost
    ? { host_score: patch.score, host_done: patch.done }
    : { guest_score: patch.score, guest_done: patch.done };

  const { data, error } = await supabase.from("battles").update(body).eq("id", battle.id).select("*").maybeSingle();
  if (error || !data) return battle;
  const next = asBattle(data as Record<string, unknown>);

  if (next.host_done && next.guest_done && next.status !== "finished") {
    const winner =
      next.host_score === next.guest_score ? null : next.host_score > next.guest_score ? next.host_id : next.guest_id;
    const { data: fin } = await supabase
      .from("battles")
      .update({ status: "finished", winner_id: winner, finished_at: new Date().toISOString() })
      .eq("id", battle.id)
      .select("*")
      .maybeSingle();
    if (fin) return asBattle(fin as Record<string, unknown>);
  }
  return next;
}

export function subscribeBattle(id: string, onRow: (row: BattleRow) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel(`battle:${id}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "battles", filter: `id=eq.${id}` },
      (payload) => {
        const row = (payload.new ?? payload.old) as Record<string, unknown> | undefined;
        if (row?.id) onRow(asBattle(row));
      },
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

export function opponentOf(battle: BattleRow, userId: string): { name: string; score: number; done: boolean } {
  const host = battle.host_id === userId;
  return host
    ? { name: battle.guest_name || "Raqib", score: battle.guest_score, done: battle.guest_done }
    : { name: battle.host_name || "Raqib", score: battle.host_score, done: battle.host_done };
}

export function myScoreOf(battle: BattleRow, userId: string): { score: number; done: boolean } {
  return battle.host_id === userId
    ? { score: battle.host_score, done: battle.host_done }
    : { score: battle.guest_score, done: battle.guest_done };
}

export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
  return hueColor(h % 360);
}

export function battleXp(outcome: "win" | "lose" | "draw", correct: number): number {
  const base = 8 * correct;
  if (outcome === "win") return base + 25;
  if (outcome === "draw") return base + 12;
  return base + 6;
}
