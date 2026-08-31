/**
 * Tanlovli savollar to'plami — imtihon va jonli bellashuv uchun.
 * Seed `scope::uuid` ko'rinishida: ikkala o'yinchi ham bir xil 7 savolni oladi.
 * scope: "all" | "sys:{id}" | "unit:{id}" | "lesson:{id}"
 */
import {
  ALL_LESSONS,
  CONTENT_SYSTEMS,
  lessonById,
  systemById,
  type Lesson,
  type Question,
} from "@/data/content";

export interface PoolItem {
  q: Question;
  lessonId: string;
  lessonTitle: string;
}

export const BATTLE_Q_COUNT = 7;
export const BATTLE_SECONDS = 12;
export const KAHOOT_Q_COUNT = 10;
export const KAHOOT_SECONDS = 20;

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function rng(seed: string): () => number {
  let a = hashSeed(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  const r = rng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Darslar — tizim / bo'lim / dars doirasida. Bo'sh qolsa barchasi. */
export function lessonsForScope(scope = "all"): Lesson[] {
  if (!scope || scope === "all") return ALL_LESSONS;
  if (scope.startsWith("sys:")) {
    const sys = systemById(scope.slice(4));
    const list = sys ? sys.units.flatMap((u) => u.lessons) : [];
    return list.length ? list : ALL_LESSONS;
  }
  if (scope.startsWith("unit:")) {
    const id = scope.slice(5);
    for (const s of CONTENT_SYSTEMS) {
      const u = s.units.find((x) => x.id === id);
      if (u?.lessons.length) return u.lessons;
    }
    return ALL_LESSONS;
  }
  if (scope.startsWith("lesson:")) {
    const l = lessonById(scope.slice(7));
    return l ? [l] : ALL_LESSONS;
  }
  return ALL_LESSONS;
}

export function battleScopeLabel(scope = "all"): string {
  if (!scope || scope === "all") return "";
  if (scope.startsWith("sys:")) return systemById(scope.slice(4))?.name ?? "";
  if (scope.startsWith("unit:")) {
    const id = scope.slice(5);
    for (const s of CONTENT_SYSTEMS) {
      const u = s.units.find((x) => x.id === id);
      if (u) return u.title;
    }
  }
  if (scope.startsWith("lesson:")) return lessonById(scope.slice(7))?.title ?? "";
  return "";
}

export function collectChoiceQuestions(scope = "all"): PoolItem[] {
  const out: PoolItem[] = [];
  for (const l of lessonsForScope(scope)) {
    for (const q of l.questions) {
      if (q.type === "quiz" || q.type === "img" || q.type === "func") {
        if (q.options && q.options.length >= 2 && q.answer != null) {
          out.push({ q, lessonId: l.id, lessonTitle: l.title });
        }
      } else if (q.type === "tf") {
        out.push({
          q: { ...q, options: ["To'g'ri", "Noto'g'ri"], answer: q.statement ? 0 : 1 },
          lessonId: l.id,
          lessonTitle: l.title,
        });
      }
    }
  }
  return out.length ? out : collectAllChoiceQuestions();
}

function collectAllChoiceQuestions(): PoolItem[] {
  const out: PoolItem[] = [];
  for (const l of ALL_LESSONS) {
    for (const q of l.questions) {
      if (q.type === "quiz" || q.type === "img" || q.type === "func") {
        if (q.options && q.options.length >= 2 && q.answer != null) {
          out.push({ q, lessonId: l.id, lessonTitle: l.title });
        }
      } else if (q.type === "tf") {
        out.push({
          q: { ...q, options: ["To'g'ri", "Noto'g'ri"], answer: q.statement ? 0 : 1 },
          lessonId: l.id,
          lessonTitle: l.title,
        });
      }
    }
  }
  return out;
}

export function parseBattleSeed(seed: string): { scope: string; raw: string } {
  const i = seed.indexOf("::");
  if (i <= 0) return { scope: "all", raw: seed };
  return { scope: seed.slice(0, i), raw: seed.slice(i + 2) };
}

export function pickBattleQuestions(seed: string, count = BATTLE_Q_COUNT): PoolItem[] {
  const { scope, raw } = parseBattleSeed(seed);
  const pool = collectChoiceQuestions(scope);
  return shuffleWithSeed(pool, raw).slice(0, Math.min(count, Math.max(1, pool.length)));
}

export function pickKahootQuestions(seed: string, count = KAHOOT_Q_COUNT): PoolItem[] {
  const { scope, raw } = parseBattleSeed(seed);
  const pool = collectChoiceQuestions(scope).filter((p) => {
    const n = p.q.options?.length ?? 0;
    return n >= 2 && n <= 6;
  });
  const src = pool.length ? pool : collectChoiceQuestions(scope);
  return shuffleWithSeed(src, raw).slice(0, Math.min(count, Math.max(1, src.length)));
}

export function newBattleSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeBattleSeed(scope = "all"): string {
  return `${scope || "all"}::${newBattleSeed()}`;
}

export function randomBattleCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
