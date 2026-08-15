/**
 * Yagona kontent registri — barcha tana tizimlari (kitobdan to'liq).
 * Osteologiya (to'liq) + artrologiya, miologiya, splanxnologiya,
 * angiologiya, nevrologiya, sezgi a'zolari.
 */
import type { ContentSystem, Lesson, SystemUnit, Question, Difficulty } from "./types";
import { OSTEOLOGY_UNITS } from "./osteology";
import { EXTRA_UNITS } from "./rest";
import { HARD_QUESTIONS } from "./hardQuestions";

export type { ContentSystem, Lesson, SystemUnit, Question };
export type { QuestionType, Difficulty } from "./types";

/**
 * Savol qiyinligini aniqlash (agar savolda ko'rsatilmagan bo'lsa).
 * - match/build/order → o'rta
 * - rasmli (img) → oson (vizual tanishuv)
 * - to'g'ri/noto'g'ri va fill → oson/o'rta
 * - quiz → maslahati (hint) bor bo'lsa oson, izohli bo'lsa o'rta, aks holda o'rta
 */
export function difficultyOf(q: Question): Difficulty {
  if (q.difficulty) return q.difficulty;
  switch (q.type) {
    case "img":
      return "easy";
    case "tf":
    case "fill":
      return q.explanation ? "medium" : "easy";
    case "match":
    case "build":
    case "order":
      return "medium";
    default:
      // quiz / func
      if (q.hint) return "easy";
      return "medium";
  }
}

const RANK: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

/** Dars savollarini oson → o'rta → qiyin tartibida saralash. */
export function sortByDifficulty(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => RANK[difficultyOf(a)] - RANK[difficultyOf(b)]);
}

const BASE_SYSTEMS: ContentSystem[] = [
  {
    id: "skeletal", name: "Suyaklar tizimi", latin: "Systema skeletale", en: "Skeletal System",
    icon: "bone", color: "#6C5CE7", image: "/img/atlas/skelet.jpg", units: OSTEOLOGY_UNITS,
  },
  {
    id: "arthrology", name: "Bo'g'imlar", latin: "Arthrologia", en: "Joints",
    icon: "link", color: "#06b6d4", image: "/img/atlas/arthrologia.jpg", units: EXTRA_UNITS.arthrology ?? [],
  },
  {
    id: "muscular", name: "Mushaklar tizimi", latin: "Systema musculare", en: "Muscular System",
    icon: "activity", color: "#EC4899", image: "/img/atlas/myologia.jpg", units: EXTRA_UNITS.muscular ?? [],
  },
  {
    id: "digestive", name: "Hazm tizimi", latin: "Systema digestorium", en: "Digestive System",
    icon: "apple", color: "#F97316", image: "/img/atlas/digestorium.jpg", units: EXTRA_UNITS.digestive ?? [],
  },
  {
    id: "respiratory", name: "Nafas tizimi", latin: "Systema respiratorium", en: "Respiratory System",
    icon: "wind", color: "#0EA5E9", image: "/img/atlas/respiratorium.jpg", units: EXTRA_UNITS.respiratory ?? [],
  },
  {
    id: "circulatory", name: "Yurak-qon tomir tizimi", latin: "Systema cardiovasculare", en: "Circulatory System",
    icon: "heart", color: "#EF4444", image: "/img/atlas/yurak.jpg", units: EXTRA_UNITS.circulatory ?? [],
  },
  {
    id: "nervous", name: "Asab tizimi", latin: "Systema nervosum", en: "Nervous System",
    icon: "brain", color: "#8B6CFF", image: "/img/atlas/miya.jpg", units: EXTRA_UNITS.nervous ?? [],
  },
  {
    id: "urinary", name: "Siydik tizimi", latin: "Systema urinarium", en: "Urinary System",
    icon: "droplet", color: "#22C55E", image: "/img/atlas/buyrak.jpg", units: EXTRA_UNITS.urinary ?? [],
  },
  {
    id: "reproductive", name: "Jinsiy tizim", latin: "Systema genitale", en: "Reproductive System",
    icon: "users", color: "#F472B6", image: "/img/atlas/jinsiy.jpg", units: EXTRA_UNITS.reproductive ?? [],
  },
  {
    id: "endocrine", name: "Endokrin bezlar", latin: "Systema endocrinum", en: "Endocrine System",
    icon: "activity", color: "#F59E0B", image: "/img/atlas/endokrin.jpg", units: EXTRA_UNITS.endocrine ?? [],
  },
  {
    id: "sensory", name: "Sezgi a'zolari", latin: "Organa sensuum", en: "Sensory Organs",
    icon: "sparkles", color: "#20D9C5", image: "/img/atlas/neurocranium.jpg", units: EXTRA_UNITS.sensory ?? [],
  },
];

/**
 * Yuqori saviyali (hard) savollarni har tizimning OXIRGI darsiga qo'shish —
 * talaba bo'limni yakunlash arafasida klinik/amaliy savollarga duch keladi.
 */
export const CONTENT_SYSTEMS: ContentSystem[] = BASE_SYSTEMS.map((sys) => {
  const hard = HARD_QUESTIONS[sys.id];
  if (!hard || hard.length === 0 || sys.units.length === 0) return sys;
  const lastUnit = sys.units[sys.units.length - 1];
  const lastLesson = lastUnit.lessons[lastUnit.lessons.length - 1];
  if (!lastLesson) return sys;
  const patchedLesson: Lesson = { ...lastLesson, questions: [...lastLesson.questions, ...hard] };
  const patchedUnit: SystemUnit = { ...lastUnit, lessons: [...lastUnit.lessons.slice(0, -1), patchedLesson] };
  return { ...sys, units: [...sys.units.slice(0, -1), patchedUnit] };
});

export const ALL_LESSONS: Lesson[] = CONTENT_SYSTEMS.flatMap((s) => s.units).flatMap((u) => u.lessons);

export function systemById(id: string): ContentSystem | undefined {
  return CONTENT_SYSTEMS.find((s) => s.id === id);
}

export function lessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function unitOfLesson(lessonId: string): SystemUnit | undefined {
  for (const s of CONTENT_SYSTEMS)
    for (const u of s.units)
      if (u.lessons.some((l) => l.id === lessonId)) return u;
  return undefined;
}

export function systemOfLesson(lessonId: string): ContentSystem | undefined {
  return CONTENT_SYSTEMS.find((s) => s.units.some((u) => u.lessons.some((l) => l.id === lessonId)));
}

export function systemProgress(sys: ContentSystem, completedLessons: string[]) {
  const total = sys.units.flatMap((u) => u.lessons).length;
  const done = sys.units.flatMap((u) => u.lessons).filter((l) => completedLessons.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function unitProgress(unit: SystemUnit, completedLessons: string[]) {
  const done = unit.lessons.filter((l) => completedLessons.includes(l.id)).length;
  return { done, total: unit.lessons.length, pct: unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0 };
}

export function unitStatus(unit: SystemUnit, completedLessons: string[]): "completed" | "progress" | "new" {
  const done = unit.lessons.filter((l) => completedLessons.includes(l.id)).length;
  if (done === 0) return "new";
  if (done >= unit.lessons.length) return "completed";
  return "progress";
}

/** Global ketma-ket qulf (kitob tartibida): oldingi dars bajarilmagan bo'lsa — qulflangan. */
export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  return completedLessons.includes(ALL_LESSONS[idx - 1].id);
}

export function totalStats(completedLessons: string[]) {
  const total = ALL_LESSONS.length;
  const done = completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
