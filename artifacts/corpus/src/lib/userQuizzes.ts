/**
 * Foydalanuvchi testlari — o'zi tuzadi, jamoa o'qiydi, Kahootda o'tkazadi.
 * Supabase `user_quizzes` + mahalliy zaxira.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";
import type { Question } from "@/data/content";
import type { PoolItem } from "@/utils/quizPool";

/**
 * Savol turlari:
 * - choice    — standart ko'p tanlov (2-4 matn variant)
 * - tf        — To'g'ri / Noto'g'ri
 * - image     — rasmli savol (savolda rasm + matn variantlar)
 * - pickImage — rasm variantlari (har bir variantda rasm)
 */
export type QuizQuestionType = "choice" | "tf" | "image" | "pickImage";

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
  type?: QuizQuestionType;
  /** Savol rasmi (data URL yoki /img/... manzil) */
  image?: string;
  /** Variant rasmlari (pickImage turi) */
  optionImages?: string[];
}

/** Bitta rasm uchun maksimal hajm (data URL belgilar). ~450KB JPEG. */
const IMG_MAX_CHARS = 640_000;

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

const TF_OPTIONS = ["To'g'ri", "Noto'g'ri"];

function cleanImage(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  if (s.length > IMG_MAX_CHARS) return undefined;
  if (s.startsWith("data:image/") || s.startsWith("/img/") || s.startsWith("http")) return s;
  return undefined;
}

function cleanOptionImages(v: unknown, n: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, n).map((x) => cleanImage(x) ?? "");
}

export function packQuestion(q: {
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
  type?: QuizQuestionType;
  image?: string;
  optionImages?: string[];
}): QuizQuestion | null {
  const type: QuizQuestionType =
    q.type === "tf" || q.type === "image" || q.type === "pickImage" ? q.type : "choice";
  const prompt = String(q.prompt ?? "").trim().slice(0, 240);
  const srcOptions = type === "tf" ? TF_OPTIONS : (q.options ?? []);
  const srcImgs = Array.isArray(q.optionImages) ? (q.optionImages as unknown[]) : [];

  if (type === "pickImage") {
    // Faqat rasm/matni bor variantlarni saqlaymiz (oxirgi bo'sh slotlarni kesamiz)
    const last = srcOptions.reduce((acc, o, i) => {
      const has = String(o ?? "").trim() || Boolean(cleanImage(srcImgs[i]));
      return has ? i : acc;
    }, -1);
    if (last < 1) return null;
    const texts: string[] = [];
    const imgs: string[] = [];
    for (let i = 0; i <= last; i++) {
      const img = cleanImage(srcImgs[i]) ?? "";
      if (!img) return null; // har bir variantda rasm bo'lishi shart
      texts.push(String(srcOptions[i] ?? "").trim().slice(0, 80));
      imgs.push(img);
    }
    const answer = Math.min(Math.max(0, Number(q.answer ?? 0)), texts.length - 1);
    const explanation = String(q.explanation ?? "").trim().slice(0, 240);
    return {
      prompt,
      options: texts,
      answer,
      type,
      optionImages: imgs,
      ...(explanation ? { explanation } : {}),
    };
  }

  const kept: { text: string; orig: number }[] = [];
  srcOptions.forEach((o, i) => {
    const text = String(o ?? "").trim().slice(0, 80);
    if (text) kept.push({ text, orig: i });
  });
  if (kept.length < 2) return null;
  if (!prompt) return null;
  if (type === "image" && !cleanImage(q.image)) return null;
  const idx = kept.findIndex((k) => k.orig === q.answer);
  const answer = idx < 0 ? Math.min(1, kept.length - 1) : Math.min(idx, 3);
  const explanation = String(q.explanation ?? "").trim().slice(0, 240);
  const image = cleanImage(q.image);
  return {
    prompt,
    options: kept.map((k) => k.text).slice(0, 4),
    answer,
    type,
    ...(image ? { image } : {}),
    ...(explanation ? { explanation } : {}),
  };
}

export function asQuizQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const t = o.type;
  return packQuestion({
    prompt: String(o.prompt ?? ""),
    options: Array.isArray(o.options) ? o.options.map((x) => String(x ?? "")) : [],
    answer: Number(o.answer ?? 0),
    explanation: String(o.explanation ?? ""),
    type: t === "tf" || t === "image" || t === "pickImage" ? t : "choice",
    image: cleanImage(o.image),
    optionImages: Array.isArray(o.optionImages) ? o.optionImages.map((x) => String(x ?? "")) : [],
  });
}

/** Savol turi — eski ma'lumotlar uchun "choice" defolt. */
export function quizQuestionType(q: QuizQuestion | null | undefined): QuizQuestionType {
  return q?.type ?? "choice";
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
      ...(q.image ? { image: q.image } : {}),
      ...(q.optionImages?.length ? { optionImages: q.optionImages } : {}),
    };
    return { q: qq, lessonId: `quiz:${i}`, lessonTitle: title };
  });
}

export function isQuizReady(quiz: { questions: QuizQuestion[] }): boolean {
  return quiz.questions.length >= QUIZ_MIN_Q;
}

/**
 * Fayl → siqilgan data URL (max 560px, JPEG ~0.72).
 * Rasm savollari uchun: katta fayllar DB va localStorage'ni shikastlamaydi.
 */
export function imageFileToDataUrl(file: File, maxSide = 560): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-fail"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode-fail"));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("canvas-fail"));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const out = canvas.toDataURL("image/jpeg", 0.72);
          if (out.length > IMG_MAX_CHARS) {
            // yanada siqib ko'rish
            const c2 = document.createElement("canvas");
            c2.width = w;
            c2.height = h;
            const ctx2 = c2.getContext("2d");
            if (ctx2) {
              ctx2.drawImage(canvas, 0, 0);
              const out2 = c2.toDataURL("image/jpeg", 0.55);
              if (out2.length <= IMG_MAX_CHARS) {
                resolve(out2);
                return;
              }
            }
            reject(new Error("too-big"));
            return;
          }
          resolve(out);
        } catch (e) {
          reject(e instanceof Error ? e : new Error("canvas-fail"));
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
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
