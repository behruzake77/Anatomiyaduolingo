/**
 * Foydalanuvchi testlari — o'zi tuzadi, jamoa o'qiydi, Kahootda o'tkazadi.
 * Supabase `user_quizzes` + mahalliy zaxira.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";
import type { Question } from "@/data/content";
import type { PoolItem } from "@/utils/quizPool";

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface UserQuiz {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  description: string;
  is_public: boolean;
  questions: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export type QuizDraft = {
  title: string;
  description: string;
  is_public: boolean;
  questions: QuizQuestion[];
};

const LOCAL_KEY = "corpus-user-quizzes";
export const QUIZ_MAX_Q = 20;
export const QUIZ_MIN_Q = 2;

export function packQuestion(q: { prompt: string; options: string[]; answer: number; explanation?: string }): QuizQuestion | null {
  const prompt = String(q.prompt ?? "").trim().slice(0, 240);
  const kept: { text: string; orig: number }[] = [];
  (q.options ?? []).forEach((o, i) => {
    const text = String(o ?? "").trim();
    if (text) kept.push({ text: text.slice(0, 80), orig: i });
  });
  if (!prompt || kept.length < 2) return null;
  const idx = kept.findIndex((k) => k.orig === q.answer);
  const explanation = String(q.explanation ?? "").trim().slice(0, 240);
  return {
    prompt,
    options: kept.map((k) => k.text).slice(0, 4),
    answer: idx < 0 ? 0 : Math.min(idx, 3),
    ...(explanation ? { explanation } : {}),
  };
}

export function asQuizQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return packQuestion({
    prompt: String(o.prompt ?? ""),
    options: Array.isArray(o.options) ? o.options.map((x) => String(x ?? "")) : [],
    answer: Number(o.answer ?? 0),
    explanation: String(o.explanation ?? ""),
  });
}

function asQuiz(row: Record<string, unknown>): UserQuiz {
  const qs = Array.isArray(row.questions)
    ? row.questions.map(asQuizQuestion).filter((q): q is QuizQuestion => Boolean(q)).slice(0, QUIZ_MAX_Q)
    : [];
  return {
    id: String(row.id),
    owner_id: String(row.owner_id ?? ""),
    owner_name: String(row.owner_name ?? ""),
    title: String(row.title ?? "").trim() || "Test",
    description: String(row.description ?? ""),
    is_public: row.is_public !== false,
    questions: qs,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function readLocal(): UserQuiz[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => asQuiz(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

function writeLocal(rows: UserQuiz[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 80)));
  } catch {
    /* no-op */
  }
}

function merge(remote: UserQuiz[], local: UserQuiz[]): UserQuiz[] {
  const seen = new Set(remote.map((r) => r.id));
  const extra = local.filter((r) => !seen.has(r.id));
  return [...remote, ...extra].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

export function quizToPool(quiz: UserQuiz): PoolItem[] {
  return snapshotToPool(quiz.title, quiz.questions);
}

export function snapshotToPool(title: string, questions: QuizQuestion[]): PoolItem[] {
  return questions.map((q, i) => {
    const qq: Question = {
      type: "quiz",
      prompt: q.prompt,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
    };
    return { q: qq, lessonId: `quiz:${i}`, lessonTitle: title };
  });
}

export function isQuizReady(quiz: { questions: QuizQuestion[] }): boolean {
  return quiz.questions.length >= QUIZ_MIN_Q;
}

export async function listMyQuizzes(userId: string): Promise<UserQuiz[]> {
  let remote: UserQuiz[] = [];
  if (isSupabaseConfigured && userId) {
    const { data, error } = await supabase
      .from("user_quizzes")
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })
      .limit(80);
    if (!error && data) remote = data.map((r) => asQuiz(r as Record<string, unknown>));
  }
  const local = readLocal().filter((q) => q.owner_id === userId);
  return merge(remote, local);
}

export async function listPublicQuizzes(): Promise<UserQuiz[]> {
  let remote: UserQuiz[] = [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("user_quizzes")
      .select("*")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(80);
    if (!error && data) remote = data.map((r) => asQuiz(r as Record<string, unknown>));
  }
  const local = readLocal().filter((q) => q.is_public);
  return merge(remote, local);
}

export async function getQuiz(id: string): Promise<UserQuiz | null> {
  if (!id) return null;
  if (isSupabaseConfigured && !id.startsWith("local-")) {
    const { data, error } = await supabase.from("user_quizzes").select("*").eq("id", id).maybeSingle();
    if (!error && data) return asQuiz(data as Record<string, unknown>);
  }
  return readLocal().find((q) => q.id === id) ?? null;
}

export async function saveQuiz(user: AuthUser, draft: QuizDraft, id?: string | null): Promise<UserQuiz | null> {
  const title = draft.title.trim().slice(0, 80) || "Test";
  const description = draft.description.trim().slice(0, 240);
  const questions = draft.questions
    .map(asQuizQuestion)
    .filter((q): q is QuizQuestion => Boolean(q))
    .slice(0, QUIZ_MAX_Q);
  if (!questions.length) return null;
  const now = new Date().toISOString();
  const payload = {
    owner_id: user.id,
    owner_name: user.username,
    title,
    description,
    is_public: draft.is_public !== false,
    questions,
    updated_at: now,
  };
  if (isSupabaseConfigured && (!id || !id.startsWith("local-"))) {
    if (id) {
      const { data, error } = await supabase.from("user_quizzes").update(payload).eq("id", id).eq("owner_id", user.id).select("*").maybeSingle();
      if (!error && data) return asQuiz(data as Record<string, unknown>);
    } else {
      const { data, error } = await supabase.from("user_quizzes").insert({ ...payload, created_at: now }).select("*").maybeSingle();
      if (!error && data) return asQuiz(data as Record<string, unknown>);
    }
  }
  const rows = readLocal();
  if (id) {
    const idx = rows.findIndex((q) => q.id === id);
    if (idx < 0) return null;
    const updated: UserQuiz = { ...rows[idx], ...payload, questions, updated_at: now };
    rows[idx] = updated;
    writeLocal(rows);
    return updated;
  }
  const row: UserQuiz = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    owner_id: user.id,
    owner_name: user.username,
    title,
    description,
    is_public: payload.is_public,
    questions,
    created_at: now,
    updated_at: now,
  };
  writeLocal([row, ...rows]);
  return row;
}

export async function deleteQuiz(userId: string, id: string): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith("local-")) {
    const { error } = await supabase.from("user_quizzes").delete().eq("id", id).eq("owner_id", userId);
    if (!error) return true;
  }
  const rows = readLocal();
  const next = rows.filter((q) => q.id !== id);
  if (next.length === rows.length) return false;
  writeLocal(next);
  return true;
}
