/**
 * Yagona kontent registri — barcha tana tizimlari (kitobdan to'liq).
 * Osteologiya (to'liq) + artrologiya, miologiya, splanxnologiya,
 * angiologiya, nevrologiya, sezgi a'zolari.
 */
import type { ContentSystem, Lesson, SystemUnit, Question, Difficulty } from "./types";
import { OSTEOLOGY_UNITS } from "./osteology";
import { EXTRA_UNITS } from "./rest";
import { HARD_QUESTIONS } from "./hardQuestions";
import { ARTROLOGY_DETAIL, MYOLOGY_DETAIL, ANGIOLOGY_DETAIL } from "./detail";
import { NEUROLOGY_DETAIL, SENSORY_DETAIL } from "./neuro";
import { DIGESTIVE_DETAIL, RESPIRATORY_DETAIL, URINARY_DETAIL } from "./splanchno";
import { REPRODUCTIVE_DETAIL, ENDOCRINE_DETAIL } from "./glands";
import { NECK_HEAD_MUSCLES, VESSELS_DETAIL } from "./neckvessels";
import { PLEXUS_DETAIL, SKIN_DETAIL } from "./final";
import { IMG_QUESTIONS, VISUAL_SLIDES, LESSON_IMAGES } from "./visuals";
import { LESSON_LEGENDS } from "./labels";
import { FIGURE_LESSONS } from "./figureLessons";
import { COLOR_DIAGRAMS, COLOR_HIGHLIGHTS } from "./colorDiagrams";
import { termDef } from "./termsInfo";

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

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Har bir raqamlangan qismga rasmli savol (kitob rasmi + raqam → nom).
 * Faqat kitobdan kesilgan (raqam bosilgan) rasmlar va sonli raqamlar uchun.
 * Manba: kitobdagi rasm izohi (raqam → nom) — ixtiro qilinmaydi.
 */
export function partQuestions(lessonId: string): Question[] {
  const legend = LESSON_LEGENDS[lessonId];
  if (!legend) return [];
  // Faqat izohsiz (faqat rasm+raqam) kesimi tayyor bo'lgan darslarda — javob ko'rinib qolmasligi uchun.
  if (!FIGURE_LESSONS.has(lessonId)) return [];
  const img = `/img/fig/${lessonId}.jpg`;
  const items = legend.filter((it) => /^\d+$/.test(it.n));
  if (items.length < 4) return [];

  const names = items.map((i) => i.name);
  const out: Question[] = [];
  items.forEach((item) => {
    const others = [...new Set(names.filter((n) => n !== item.name))];
    if (others.length < 3) return;
    const distractors = shuffleArr(others).slice(0, 3);
    const options = shuffleArr([item.name, ...distractors]);
    const answer = options.indexOf(item.name);
    out.push({
      type: "img",
      prompt: `Rasmda №${item.n} bilan qaysi qism ko'rsatilgan?`,
      image: img,
      options,
      answer,
      difficulty: "medium",
      hint: item.name,
    });
  });
  return out;
}

/**
 * Rangli diagramma savollari — faqat O'SHA qism bo'yalgan + strelka bilan ko'rsatilgan,
 * qolgan qismlar xira. Javob variantlarida nomlar.
 * Manba: Ahmedov kitobidagi qismlar; rang/strelka faqat vizual yordam.
 */
export function colorQuestions(lessonId: string): Question[] {
  const baseImg = COLOR_DIAGRAMS[lessonId];
  const highlights = COLOR_HIGHLIGHTS[lessonId];
  const legend = LESSON_LEGENDS[lessonId];
  if (!baseImg || !highlights || !legend) return [];
  const items = legend.filter((it) => /^\d+$/.test(it.n));
  if (items.length < 4) return [];

  const names = items.map((i) => i.name);
  const out: Question[] = [];
  items.forEach((item) => {
    const img = highlights[item.n];
    if (!img) return;
    const others = [...new Set(names.filter((n) => n !== item.name))];
    if (others.length < 3) return;
    const distractors = shuffleArr(others).slice(0, 3);
    const options = shuffleArr([item.name, ...distractors]);
    const answer = options.indexOf(item.name);
    out.push({
      type: "img",
      prompt: `Rasmda strelka bilan ko'rsatilgan qism qanday ataladi?`,
      image: img,
      options,
      answer,
      difficulty: "medium",
      hint: item.name,
    });
  });
  return out;
}

const BASE_SYSTEMS: ContentSystem[] = [
  {
    id: "skeletal", name: "Suyaklar tizimi", latin: "Systema skeletale", en: "Skeletal System",
    icon: "bone", color: "#6C5CE7", image: "/img/atlas/skelet.jpg", units: OSTEOLOGY_UNITS,
  },
  {
    id: "arthrology", name: "Bo'g'imlar", latin: "Arthrologia", en: "Joints",
    icon: "link", color: "#06b6d4", image: "/img/atlas/arthrologia.jpg", units: [...(EXTRA_UNITS.arthrology ?? []), ...ARTROLOGY_DETAIL],
  },
  {
    id: "muscular", name: "Mushaklar tizimi", latin: "Systema musculare", en: "Muscular System",
    icon: "activity", color: "#EC4899", image: "/img/atlas/myologia.jpg", units: [...(EXTRA_UNITS.muscular ?? []), ...MYOLOGY_DETAIL, ...NECK_HEAD_MUSCLES],
  },
  {
    id: "digestive", name: "Hazm tizimi", latin: "Systema digestorium", en: "Digestive System",
    icon: "apple", color: "#F97316", image: "/img/atlas/digestorium.jpg", units: [...(EXTRA_UNITS.digestive ?? []), ...DIGESTIVE_DETAIL],
  },
  {
    id: "respiratory", name: "Nafas tizimi", latin: "Systema respiratorium", en: "Respiratory System",
    icon: "wind", color: "#0EA5E9", image: "/img/atlas/respiratorium.jpg", units: [...(EXTRA_UNITS.respiratory ?? []), ...RESPIRATORY_DETAIL],
  },
  {
    id: "circulatory", name: "Yurak-qon tomir tizimi", latin: "Systema cardiovasculare", en: "Circulatory System",
    icon: "heart", color: "#EF4444", image: "/img/atlas/yurak.jpg", units: [...(EXTRA_UNITS.circulatory ?? []), ...ANGIOLOGY_DETAIL, ...VESSELS_DETAIL],
  },
  {
    id: "nervous", name: "Asab tizimi", latin: "Systema nervosum", en: "Nervous System",
    icon: "brain", color: "#8B6CFF", image: "/img/atlas/miya.jpg", units: [...(EXTRA_UNITS.nervous ?? []), ...NEUROLOGY_DETAIL, ...PLEXUS_DETAIL],
  },
  {
    id: "urinary", name: "Siydik tizimi", latin: "Systema urinarium", en: "Urinary System",
    icon: "droplet", color: "#22C55E", image: "/img/atlas/buyrak.jpg", units: [...(EXTRA_UNITS.urinary ?? []), ...URINARY_DETAIL],
  },
  {
    id: "reproductive", name: "Jinsiy tizim", latin: "Systema genitale", en: "Reproductive System",
    icon: "users", color: "#F472B6", image: "/img/atlas/jinsiy.jpg", units: [...(EXTRA_UNITS.reproductive ?? []), ...REPRODUCTIVE_DETAIL],
  },
  {
    id: "endocrine", name: "Endokrin bezlar", latin: "Systema endocrinum", en: "Endocrine System",
    icon: "activity", color: "#F59E0B", image: "/img/atlas/endokrin.jpg", units: [...(EXTRA_UNITS.endocrine ?? []), ...ENDOCRINE_DETAIL],
  },
  {
    id: "sensory", name: "Sezgi a'zolari", latin: "Organa sensuum", en: "Sensory Organs",
    icon: "sparkles", color: "#20D9C5", image: "/img/atlas/neurocranium.jpg", units: [...(EXTRA_UNITS.sensory ?? []), ...SENSORY_DETAIL, ...SKIN_DETAIL],
  },
];

/**
 * 1) Yuqori saviyali (hard) savollarni har tizimning OXIRGI darsiga qo'shish —
 *    talaba bo'limni yakunlash arafasida klinik/amaliy savollarga duch keladi.
 * 2) Rasmli (img) savollarni har tizimning BIRINCHI darsiga qo'shish.
 * 3) Slaydi bo'lmagan har bir darsga rasmli kirish slaydi qo'shish (vizual).
 */
export const CONTENT_SYSTEMS: ContentSystem[] = BASE_SYSTEMS.map((sys) => {
  if (sys.units.length === 0) return sys;
  const firstUnit = sys.units[0];
  const firstLesson = firstUnit.lessons[0];
  const lastUnit = sys.units[sys.units.length - 1];
  const lastLesson = lastUnit.lessons[lastUnit.lessons.length - 1];

  // vizual slayd (tizim rasmi) — toza rasmi bor tizimlar uchun kirishda
  const visualSlide = VISUAL_SLIDES[sys.id];
  const defaultSlide = {
    title: sys.name,
    text: `${sys.latin} — rasmdagi tuzilmalarni o'rganing.`,
    img: sys.image,
  };
  const slideFor = () => (visualSlide ? { ...visualSlide } : { ...defaultSlide });

  // har bir darsga slayd (yo'q bo'lsa) va rasmli savollarni birinchi darsga qo'shish
  const withVisuals = sys.units.map((unit, ui) => ({
    ...unit,
    lessons: unit.lessons.map((lesson, li) => {
      let patched: Lesson = lesson;
      const lessonImg = LESSON_IMAGES[lesson.id];

      const colorImg = COLOR_DIAGRAMS[lesson.id];
      const legend = LESSON_LEGENDS[lesson.id];

      if (colorImg && legend) {
        // Rangli diagrammali dars — kитоб бети o'rniga FLASH-KARTALAR + rangli diagramma.
        // Har bir qism = bitta flesh-karta (oldingi tomoni: strelkali rasm, orqasi: nomi).
        const flashcards = legend
          .filter((it) => /^\d+$/.test(it.n))
          .map((it) => ({
            n: it.n,
            name: it.name,
            img: COLOR_HIGHLIGHTS[lesson.id]?.[it.n] ?? colorImg,
            def: termDef(it.name),
          }));

        const colorSlide = {
          title: "Rangli diagramma",
          text: "Rasm ustiga bosing — nomi chiqadi va o'sha qism rangli ko'rinadi.",
          img: colorImg,
          legend,
          highlights: COLOR_HIGHLIGHTS[lesson.id],
        };
        patched = { ...patched, slides: [colorSlide], flashcards };
      } else if (lessonImg) {
        // Kitobdan kesilgan aniq rasm — USTUVOR: birinchi slaydga kitob rasmi + raqamli ro'yxat qo'yiladi.
        const bookSlide = {
          title: lesson.title,
          text: lesson.description,
          img: lessonImg,
          cap: lesson.source ? `${lesson.source.book}, ${lesson.source.page}-bet` : undefined,
          legend,
        };
        if (!patched.slides || patched.slides.length === 0) {
          patched = { ...patched, slides: [bookSlide] };
        } else {
          patched = { ...patched, slides: [bookSlide, ...patched.slides] };
        }
      } else if (!patched.slides || patched.slides.length === 0) {
        // Slaydsiz darsga tizim rasmi bilan kirish slaydi.
        const s = slideFor();
        patched = {
          ...patched,
          slides: [
            {
              title: lesson.title,
              text: lesson.description,
              img: s.img,
              cap: s.text,
            },
          ],
        };
      }

      // rasmli savollar — tizimning birinchi darsiga
      const imgs = IMG_QUESTIONS[sys.id];
      if (ui === 0 && li === 0 && imgs && imgs.length) {
        patched = { ...patched, questions: [...imgs, ...patched.questions] };
      }

      // Rangli diagrammasi bor darslarda — rangli (yozuvsiz) savollar; aks holda №N raqamli savollar.
      const colors = colorQuestions(lesson.id);
      if (colors.length) {
        patched = { ...patched, questions: [...patched.questions, ...colors] };
      } else {
        const parts = partQuestions(lesson.id);
        if (parts.length) {
          patched = { ...patched, questions: [...patched.questions, ...parts] };
        }
      }
      return patched;
    }),
  }));

  // hard savollar — oxirgi darsga
  const hard = HARD_QUESTIONS[sys.id];
  let units = withVisuals;
  if (hard && hard.length && lastLesson) {
    const lastUnitIdx = units.length - 1;
    const lu = units[lastUnitIdx];
    const ll = lu.lessons[lu.lessons.length - 1];
    const patchedLesson: Lesson = { ...ll, questions: [...ll.questions, ...hard] };
    units = [...units.slice(0, -1), { ...lu, lessons: [...lu.lessons.slice(0, -1), patchedLesson] }];
  }

  return { ...sys, units };
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
