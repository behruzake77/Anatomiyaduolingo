/**
 * Kahoot-uslubidagi sinf o'yini — PIN lobby, realtime savollar, tezlik balli.
 * Supabase yo'q bo'lsa chaqiruvchi mashq (bot) rejimiga tushadi.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";
import { KAHOOT_Q_COUNT, KAHOOT_SECONDS, makeBattleSeed, newBattleSeed } from "@/utils/quizPool";
import { isOnlineArena } from "@/lib/competition";
import { hueColor } from "@/utils/league";
import { asQuizQuestion, type QuizQuestion, type UserQuiz } from "@/lib/userQuizzes";

export type KahootStatus =
  | "lobby"
  | "countdown"
  | "question"
  | "reveal"
  | "scoreboard"
  | "podium"
  | "cancelled";

export interface KahootAnswer {
  i: number;
  choice: number | null;
  ms: number;
  correct: boolean;
  pts: number;
}

export interface KahootGame {
  id: string;
  pin: string;
  host_id: string;
  host_name: string;
  seed: string;
  q_count: number;
  q_seconds: number;
  status: KahootStatus;
  q_index: number;
  q_started_at: string | null;
  created_at: string;
  quiz_id: string | null;
  questions: QuizQuestion[] | null;
}

export interface KahootPlayer {
  id: string;
  game_id: string;
  user_id: string | null;
  name: string;
  score: number;
  streak: number;
  answers: KahootAnswer[];
  is_bot: boolean;
  joined_at: string;
}

export const KAHOOT_MAX_PLAYERS = 30;
export { KAHOOT_Q_COUNT, KAHOOT_SECONDS };

export const KAHOOT_PALETTE = [
  { bg: "#E21B3C", shape: "triangle" as const },
  { bg: "#1368CE", shape: "diamond" as const },
  { bg: "#D89E00", shape: "circle" as const },
  { bg: "#26890C", shape: "square" as const },
];

export function isKahootOnline(): boolean {
  return isOnlineArena() && isSupabaseConfigured;
}

export function randomKahootPin(): string {
  return String(100000 + Math.floor(Math.random() * 900000));
}

/** Kahoot classic: 1000 * (1 - (t/T)/2) + streak bonus. */
export function kahootPoints(
  correct: boolean,
  ms: number,
  limitMs: number,
  streak: number,
): { pts: number; nextStreak: number } {
  if (!correct) return { pts: 0, nextStreak: 0 };
  const t = Math.min(Math.max(ms, 0), Math.max(1, limitMs));
  const base = Math.round(1000 * (1 - t / limitMs / 2));
  const bonus = streak >= 1 ? Math.min(500, 50 * (streak + 1)) : 0;
  return { pts: Math.max(500, base) + bonus, nextStreak: streak + 1 };
}

export function kahootXp(rank: number, score: number): number {
  const place = rank === 1 ? 25 : rank === 2 ? 16 : rank === 3 ? 10 : 4;
  return place + Math.min(40, Math.floor(score / 150));
}

export function sortKahootBoard(players: KahootPlayer[]): KahootPlayer[] {
  return [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

export function playerColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
  return hueColor(h % 360);
}

function asAnswers(raw: unknown): KahootAnswer[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    const o = x as Record<string, unknown>;
    return {
      i: Number(o.i ?? 0),
      choice: o.choice == null ? null : Number(o.choice),
      ms: Number(o.ms ?? 0),
      correct: Boolean(o.correct),
      pts: Number(o.pts ?? 0),
    };
  });
}

function asSnapshot(raw: unknown): QuizQuestion[] | null {
  if (!Array.isArray(raw)) return null;
  const qs = raw.map(asQuizQuestion).filter((q): q is QuizQuestion => Boolean(q));
  return qs.length ? qs : null;
}

function asGame(row: Record<string, unknown>): KahootGame {
  return {
    id: String(row.id),
    pin: String(row.pin ?? ""),
    host_id: String(row.host_id),
    host_name: String(row.host_name ?? "Host"),
    seed: String(row.seed ?? ""),
    q_count: Number(row.q_count ?? KAHOOT_Q_COUNT),
    q_seconds: Number(row.q_seconds ?? KAHOOT_SECONDS),
    status: (row.status as KahootStatus) ?? "lobby",
    q_index: Number(row.q_index ?? 0),
    q_started_at: (row.q_started_at as string | null) ?? null,
    created_at: String(row.created_at ?? ""),
    quiz_id: row.quiz_id == null ? null : String(row.quiz_id),
    questions: asSnapshot(row.questions),
  };
}

function asPlayer(row: Record<string, unknown>): KahootPlayer {
  return {
    id: String(row.id),
    game_id: String(row.game_id),
    user_id: (row.user_id as string | null) ?? null,
    name: String(row.name ?? "Player"),
    score: Number(row.score ?? 0),
    streak: Number(row.streak ?? 0),
    answers: asAnswers(row.answers),
    is_bot: Boolean(row.is_bot),
    joined_at: String(row.joined_at ?? ""),
  };
}

export async function createKahootGame(
  user: AuthUser,
  scope = "all",
  quiz?: UserQuiz | null,
): Promise<{ game: KahootGame; me: KahootPlayer } | null> {
  if (!isKahootOnline()) return null;
  const custom = quiz && quiz.questions.length >= 2 ? quiz : null;
  const seed = custom ? `quiz:${custom.id}::${newBattleSeed()}` : makeBattleSeed(scope || "all");
  const qCount = custom ? Math.min(20, custom.questions.length) : KAHOOT_Q_COUNT;
  const snapshot = custom ? custom.questions.slice(0, qCount) : null;
  const quizId = custom && !custom.id.startsWith("local-") ? custom.id : null;
  for (let i = 0; i < 6; i++) {
    const pin = randomKahootPin();
    const base = {
      pin,
      host_id: user.id,
      host_name: user.username,
      seed,
      q_count: qCount,
      q_seconds: KAHOOT_SECONDS,
      status: "lobby",
      q_index: 0,
    };
    let { data, error } = await supabase
      .from("kahoot_games")
      .insert({ ...base, quiz_id: quizId, questions: snapshot })
      .select("*")
      .maybeSingle();
    if (error) {
      const retry = await supabase.from("kahoot_games").insert(base).select("*").maybeSingle();
      data = retry.data;
      error = retry.error;
    }
    if (error || !data) continue;
    const game = asGame(data as Record<string, unknown>);
    if (!game.questions && snapshot) game.questions = snapshot;
    const { data: p, error: pe } = await supabase
      .from("kahoot_players")
      .insert({
        game_id: game.id,
        user_id: user.id,
        name: user.username,
        score: 0,
        streak: 0,
        answers: [],
        is_bot: false,
      })
      .select("*")
      .maybeSingle();
    if (pe || !p) {
      await supabase.from("kahoot_games").delete().eq("id", game.id);
      return null;
    }
    return { game, me: asPlayer(p as Record<string, unknown>) };
  }
  return null;
}

/** Boshlagan (o'ynalmoqda) o'yinlarga ham qo'shilish mumkin. */
export const KAHOOT_JOINABLE_STATUS: KahootStatus[] = [
  "lobby",
  "countdown",
  "question",
  "reveal",
  "scoreboard",
];

export type KahootJoinResult =
  | { ok: true; game: KahootGame; me: KahootPlayer; inProgress: boolean }
  | { ok: false; reason: "not_found" | "full" | "offline" };

export async function joinKahootByPin(user: AuthUser, pin: string): Promise<KahootJoinResult> {
  if (!isKahootOnline()) return { ok: false, reason: "offline" };
  const clean = pin.replace(/\D/g, "").slice(0, 6);
  if (clean.length < 6) return { ok: false, reason: "not_found" };
  const { data: found } = await supabase
    .from("kahoot_games")
    .select("*")
    .eq("pin", clean)
    .in("status", KAHOOT_JOINABLE_STATUS)
    .maybeSingle();
  if (!found) return { ok: false, reason: "not_found" }; // bunday xona mavjud emas
  const game = asGame(found as Record<string, unknown>);
  if (!KAHOOT_JOINABLE_STATUS.includes(game.status)) return { ok: false, reason: "not_found" };
  const inProgress = game.status !== "lobby";
  if (game.host_id === user.id) {
    const { data: mine } = await supabase
      .from("kahoot_players")
      .select("*")
      .eq("game_id", game.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (mine) return { ok: true, game, me: asPlayer(mine as Record<string, unknown>), inProgress };
  }
  const { count } = await supabase
    .from("kahoot_players")
    .select("id", { count: "exact", head: true })
    .eq("game_id", game.id);
  if ((count ?? 0) >= KAHOOT_MAX_PLAYERS) return { ok: false, reason: "full" };

  const { data: existing } = await supabase
    .from("kahoot_players")
    .select("*")
    .eq("game_id", game.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { ok: true, game, me: asPlayer(existing as Record<string, unknown>), inProgress };

  const { data: p, error } = await supabase
    .from("kahoot_players")
    .insert({
      game_id: game.id,
      user_id: user.id,
      name: user.username,
      score: 0,
      streak: 0,
      answers: [],
      is_bot: false,
    })
    .select("*")
    .maybeSingle();
  if (error || !p) return { ok: false, reason: "not_found" };
  return { ok: true, game, me: asPlayer(p as Record<string, unknown>), inProgress };
}

export async function getKahootGame(id: string): Promise<KahootGame | null> {
  if (!isKahootOnline()) return null;
  const { data, error } = await supabase.from("kahoot_games").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return asGame(data as Record<string, unknown>);
}

export async function listKahootPlayers(gameId: string): Promise<KahootPlayer[]> {
  if (!isKahootOnline()) return [];
  const { data, error } = await supabase
    .from("kahoot_players")
    .select("*")
    .eq("game_id", gameId)
    .order("joined_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => asPlayer(r as Record<string, unknown>));
}

export async function patchKahootGame(
  id: string,
  patch: Partial<Pick<KahootGame, "status" | "q_index" | "q_started_at">>,
): Promise<KahootGame | null> {
  if (!isKahootOnline()) return null;
  const { data, error } = await supabase.from("kahoot_games").update(patch).eq("id", id).select("*").maybeSingle();
  if (error || !data) return null;
  return asGame(data as Record<string, unknown>);
}

export async function submitKahootAnswer(
  player: KahootPlayer,
  ans: KahootAnswer,
): Promise<KahootPlayer | null> {
  if (!isKahootOnline()) {
    const rest = player.answers.filter((a) => a.i !== ans.i);
    return {
      ...player,
      answers: [...rest, ans],
      score: player.score + ans.pts,
      streak: ans.correct ? player.streak + 1 : 0,
    };
  }
  if (player.answers.some((a) => a.i === ans.i)) return player;
  const answers = [...player.answers.filter((a) => a.i !== ans.i), ans];
  const streak = ans.correct ? player.streak + 1 : 0;
  const score = player.score + ans.pts;
  const { data, error } = await supabase
    .from("kahoot_players")
    .update({ answers, score, streak })
    .eq("id", player.id)
    .select("*")
    .maybeSingle();
  if (error || !data) return { ...player, answers, score, streak };
  return asPlayer(data as Record<string, unknown>);
}

export async function cancelKahoot(id: string): Promise<void> {
  if (!isKahootOnline()) return;
  await supabase.from("kahoot_games").update({ status: "cancelled" }).eq("id", id);
}

export async function leaveKahoot(playerId: string): Promise<void> {
  if (!isKahootOnline()) return;
  await supabase.from("kahoot_players").delete().eq("id", playerId);
}

export function subscribeKahoot(
  gameId: string,
  onGame: (g: KahootGame) => void,
  onPlayers: (p: KahootPlayer[]) => void,
): () => void {
  if (!isKahootOnline()) return () => {};
  const gCh = supabase
    .channel(`kahoot-g:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "kahoot_games", filter: `id=eq.${gameId}` },
      (payload) => {
        const row = (payload.new ?? payload.old) as Record<string, unknown> | undefined;
        if (row?.id) onGame(asGame(row));
      },
    )
    .subscribe();
  const pCh = supabase
    .channel(`kahoot-p:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "kahoot_players", filter: `game_id=eq.${gameId}` },
      () => {
        void listKahootPlayers(gameId).then(onPlayers);
      },
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(gCh);
    void supabase.removeChannel(pCh);
  };
}

export const KAHOOT_BOT_NAMES = [
  "Aziza",
  "Bekzod",
  "Dilnoza",
  "Sardor",
  "Nilufar",
  "Jasur",
  "Madina",
  "Sherzod",
  "Malika",
  "Javohir",
];
