import type { ScreenId } from "@/store/useAppStore";

/** Ikki tilli matn (uz — asosiy, en — ikkilamchi). */
export interface StoryText {
  uz: string;
  en: string;
}

/** Story ichidagi «Ochish» tugmasi — bosilganda tegishli bo'limga o'tadi. */
export interface StoryCta {
  label: StoryText;
  screen: ScreenId;
}

export interface ProjectStoryPage {
  title: StoryText;
  text: StoryText;
  /** 9:16 fon rasmi (public/img/stories/*.webp — 720×1280, ~20–45 KB). */
  image: string;
  /** Sahifa ustidagi kichik yorliq (masalan, «1/4 qadam»). Ixtiyoriy. */
  kicker?: StoryText;
  /** Ixtiyoriy CTA tugmasi. */
  cta?: StoryCta;
  /** Sahifa ko'rsatilish vaqti (ms). Ko'rsatilmasa — 6000. */
  duration?: number;
}

export interface ProjectStory {
  id: string;
  label: StoryText;
  /** Halqa gradienti va aksent rangi. */
  color: string;
  /** Kvadrat muqova (public/img/stories/covers/*.webp — 176×176). */
  cover: string;
  /** Story mazmuni o'zgarganda oshiring — «ko'rilgan» belgisi qayta tiklanadi. */
  version: number;
  pages: ProjectStoryPage[];
}

const DASHBOARD_LABEL = {
  aboutUz: "Loyiha haqida",
  aboutEn: "About",
};

/**
 * Bosh sahifadagi Project Stories kontenti.
 *  - Yangi story qo'shish uchun shu massivga element qo'shiladi.
 *  - Rasmlar: 9:16 fon (public/img/stories) + kvadrat muqova (public/img/stories/covers).
 *  - `version` ni oshirsangiz, story hamma uchun yana «yangi» (rangli halqa) bo'lib ko'rinadi.
 */
export const PROJECT_STORIES: ProjectStory[] = [
  {
    id: "about",
    label: { uz: DASHBOARD_LABEL.aboutUz, en: DASHBOARD_LABEL.aboutEn },
    color: "#6C5CE7",
    cover: "/img/stories/covers/about.webp",
    version: 2,
    pages: [
      {
        kicker: { uz: "CORPUS", en: "CORPUS" },
        title: { uz: "Loyiha nima?", en: "What is CORPUS?" },
        text: {
          uz: "CORPUS — anatomiyani oson, qiziqarli va interaktiv o‘rganish uchun yaratilgan Duolingo uslubidagi platforma.",
          en: "CORPUS is a Duolingo-style platform built to make anatomy easy, fun and interactive.",
        },
        image: "/img/stories/about-1.webp",
      },
      {
        kicker: { uz: "Maqsad", en: "Why" },
        title: { uz: "Nima uchun yaratildi?", en: "Why was it built?" },
        text: {
          uz: "Murakkab mavzular qisqa darslar, rangli rasmlar va amaliy savollar orqali yodda oson qoladi.",
          en: "Complex topics stick better through short lessons, colorful visuals and hands-on questions.",
        },
        image: "/img/stories/about-2.webp",
      },
      {
        kicker: { uz: "Auditoriya", en: "Audience" },
        title: { uz: "Kimlar foydalanadi?", en: "Who is it for?" },
        text: {
          uz: "Tibbiyot talabalari, o‘qituvchilar va anatomiya bilimini mustahkamlamoqchi bo‘lgan har bir kishi.",
          en: "Medical students, teachers and anyone who wants to strengthen their anatomy knowledge.",
        },
        image: "/img/stories/about-3.webp",
      },
      {
        kicker: { uz: "Imkoniyatlar", en: "Features" },
        title: { uz: "Nimalar bor?", en: "What's inside?" },
        text: {
          uz: "83 dars, 2000+ savol, atlas, 3D modellar, lug‘at, takrorlash, imtihon va jonli bellashuvlar.",
          en: "83 lessons, 2000+ questions, an atlas, 3D models, a glossary, spaced review, exams and live battles.",
        },
        image: "/img/stories/about-4.webp",
        cta: { label: { uz: "Darslarni ko‘rish", en: "Browse lessons" }, screen: "topics" },
      },
    ],
  },
  {
    id: "how-it-works",
    label: { uz: "Qanday ishlaydi", en: "How it works" },
    color: "#00B894",
    cover: "/img/stories/covers/how.webp",
    version: 2,
    pages: [
      {
        kicker: { uz: "1-qadam", en: "Step 1" },
        title: { uz: "Bo‘limni tanlang", en: "Pick a system" },
        text: {
          uz: "Bosh sahifadan yoki «Darslar» bo‘limidan kerakli anatomiya tizimini tanlang.",
          en: "Choose the anatomy system you need from Home or the Lessons tab.",
        },
        image: "/img/stories/how-1.webp",
      },
      {
        kicker: { uz: "2-qadam", en: "Step 2" },
        title: { uz: "Mavzuni o‘rganing", en: "Study the topic" },
        text: {
          uz: "Darsni o‘qing, rasmlarni ko‘ring va muhim lotincha atamalarni o‘zlashtiring.",
          en: "Read the lesson, explore the images and learn the key Latin terms.",
        },
        image: "/img/stories/how-2.webp",
      },
      {
        kicker: { uz: "3-qadam", en: "Step 3" },
        title: { uz: "Quizni boshlang", en: "Take the quiz" },
        text: {
          uz: "Savollarga javob bering — xato qilganlaringiz takrorlash ro‘yxatiga avtomatik tushadi.",
          en: "Answer the questions — the ones you miss are queued for spaced review automatically.",
        },
        image: "/img/stories/how-3.webp",
      },
      {
        kicker: { uz: "4-qadam", en: "Step 4" },
        title: { uz: "Natijani oling", en: "Collect the reward" },
        text: {
          uz: "XP to‘plang, seriyani saqlang, ligada ko‘tariling va yutuqlarni oching.",
          en: "Earn XP, keep your streak, climb the league and unlock achievements.",
        },
        image: "/img/stories/how-4.webp",
        cta: { label: { uz: "Boshlash", en: "Start learning" }, screen: "topics" },
      },
    ],
  },
  {
    id: "news",
    label: { uz: "Yangiliklar", en: "What's new" },
    color: "#FD79A8",
    cover: "/img/stories/covers/news.webp",
    version: 2,
    pages: [
      {
        kicker: { uz: "Yangi", en: "New" },
        title: { uz: "Yangiliklar shu yerda", en: "News lives here" },
        text: {
          uz: "Yangi darslar, imkoniyatlar va yangilanishlarni birinchi bo‘lib bilib oling. To‘liq ro‘yxat — bosh sahifa pastida.",
          en: "Be the first to know about new lessons, features and updates. The full list is at the bottom of Home.",
        },
        image: "/img/stories/news-1.webp",
      },
      {
        kicker: { uz: "Yangi", en: "New" },
        title: { uz: "Jonli bellashuv va Kahoot", en: "Live battles & Kahoot" },
        text: {
          uz: "Do‘stlaringiz bilan 1 ga 1 bellashing yoki PIN orqali guruh o‘yini o‘tkazing. Reyting jonli yangilanadi.",
          en: "Battle friends 1-on-1 or host a group quiz with a PIN. Rankings update live.",
        },
        image: "/img/stories/news-2.webp",
        cta: { label: { uz: "Bellashuvni ochish", en: "Open battles" }, screen: "battle" },
      },
    ],
  },
  {
    id: "tips",
    label: { uz: "Maslahatlar", en: "Tips" },
    color: "#F59E0B",
    cover: "/img/stories/covers/tips.webp",
    version: 2,
    pages: [
      {
        kicker: { uz: "Maslahat", en: "Tip" },
        title: { uz: "Oz-ozdan, lekin har kuni", en: "A little, every day" },
        text: {
          uz: "Kuniga 5–10 daqiqa yetarli. Kunlik maqsadni bajaring — seriya olovi o‘chmasin.",
          en: "5–10 minutes a day is enough. Hit your daily goal and keep the streak flame alive.",
        },
        image: "/img/stories/tips-1.webp",
      },
      {
        kicker: { uz: "Maslahat", en: "Tip" },
        title: { uz: "Xatolarni takrorlang", en: "Review your mistakes" },
        text: {
          uz: "Xato qilingan savollar 1, 3, 7, 16 va 35-kunlarda qaytadi — «Takrorlash» bo‘limini o‘tkazib yubormang.",
          en: "Missed questions come back on days 1, 3, 7, 16 and 35 — don't skip the Review section.",
        },
        image: "/img/stories/tips-2.webp",
        cta: { label: { uz: "Takrorlashga o‘tish", en: "Go to Review" }, screen: "review" },
      },
    ],
  },
  {
    id: "team",
    label: { uz: "Biz haqimizda", en: "Our team" },
    color: "#06B6D4",
    cover: "/img/stories/covers/team.webp",
    version: 2,
    pages: [
      {
        kicker: { uz: "Jamoa", en: "Team" },
        title: { uz: "Birgalikda rivojlanamiz", en: "Growing together" },
        text: {
          uz: "CORPUS jamoasi siz uchun qulay va zamonaviy ta’lim tajribasini yaratishda davom etadi. Fikringiz biz uchun muhim!",
          en: "The CORPUS team keeps building a modern, friendly learning experience. Your feedback matters!",
        },
        image: "/img/stories/team-1.webp",
        cta: { label: { uz: "Fikr bildirish", en: "Send feedback" }, screen: "feedback" },
      },
    ],
  },
];

export const STORY_PAGE_DURATION = 6000;
