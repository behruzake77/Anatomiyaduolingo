import type { ScreenId } from "@/store/useAppStore";

/** Ikki tilli matn (uz — asosiy, en — ikkilamchi). */
export interface StoryText {
  uz: string;
  en: string;
}

/**
 * Story ichidagi asosiy tugma. Bosilganda story yopiladi va foydalanuvchi
 * o'sha bo'limga o'tadi — «ko'rdi → darrov sinab ko'rdi».
 */
export interface StoryCta {
  label: StoryText;
  /** Oddiy ekranga o'tish */
  screen?: ScreenId;
  /** Aniq tizim darslariga o'tish (openSystem) */
  systemId?: string;
  /** Aniq darsni ochish (openLesson) */
  lessonId?: string;
}

export interface ProjectStoryPage {
  /** Sahifa ustidagi kichik yorliq: «1-qadam», «Maslahat»… */
  kicker?: StoryText;
  title: StoryText;
  text: StoryText;
  /** 9:16 haqiqiy anatomik fon (public/img/stories/bg-*.webp, 720×1280). */
  image: string;
  /**
   * Ilovaning haqiqiy ekrani (public/img/stories/screens/*.webp, 360 px eni).
   * Ko'rsatilsa telefon ramkasida chiqadi — foydalanuvchi «qayerni bosishni» ko'radi.
   */
  screen?: string;
  /**
   * Telefon ekranidagi «shu yerni bosing» belgisi — foizlarda (0–100),
   * skrinshotning yuqori-chap burchagidan hisoblanadi.
   */
  hotspot?: { x: number; y: number; w?: number; h?: number };
  /** Qisqa ko'rsatma ro'yxati (maks. 3 ta). */
  tips?: StoryText[];
  cta?: StoryCta;
  /** Sahifa davomiyligi (ms). Ko'rsatilmasa — STORY_PAGE_DURATION. */
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

export const STORY_PAGE_DURATION = 7000;

/**
 * Bosh sahifadagi «Hikoyalar» — ilovadan qanday foydalanish bo'yicha qisqa yo'riqnomalar.
 * Har bir story bitta yo'nalish: boshlash → dars → mashq → musobaqa → qo'shimcha vositalar.
 *
 *  - Yangi story qo'shish uchun shu massivga element qo'shiladi.
 *  - `screen` — ilovaning haqiqiy skrinshoti (telefon ramkasida), `hotspot` — bosiladigan joy.
 *  - `version` ni oshirsangiz, story hamma uchun yana «yangi» (rangli halqa) bo'lib ko'rinadi.
 */
export const PROJECT_STORIES: ProjectStory[] = [
  /* ------------------------------------------------------------------ */
  /* 1. Boshlash — ilova nima va qayerdan boshlash                        */
  /* ------------------------------------------------------------------ */
  {
    id: "start",
    label: { uz: "Boshlash", en: "Get started" },
    color: "#6C5CE7",
    cover: "/img/stories/covers/start.webp",
    version: 3,
    pages: [
      {
        kicker: { uz: "CORPUS", en: "CORPUS" },
        title: { uz: "Anatomiyani har kuni 10 daqiqa", en: "Anatomy, 10 minutes a day" },
        text: {
          uz: "Odam anatomiyasi darsligi — 83 dars, 2000+ savol, rangli diagrammalar va 3D modellar bilan, Duolingo uslubida.",
          en: "The human anatomy textbook — 83 lessons, 2000+ questions, color diagrams and 3D models, Duolingo-style.",
        },
        image: "/img/stories/bg-skeleton.webp",
      },
      {
        kicker: { uz: "Bosh sahifa", en: "Home" },
        title: { uz: "Kunlik maqsad va seriya", en: "Daily goal & streak" },
        text: {
          uz: "Yuqoridagi halqa — bugungi XP. «Davom etish» tugmasi sizni to‘xtagan joyingizdan boshlaydi. Har kuni kirsangiz — seriya o‘sadi.",
          en: "The ring shows today's XP. «Continue» resumes exactly where you stopped. Come back daily to grow your streak.",
        },
        image: "/img/stories/bg-skeleton.webp",
        screen: "/img/stories/screens/dashboard.webp",
        hotspot: { x: 31, y: 22, w: 61, h: 6.5 },
        tips: [
          { uz: "Maqsadni Sozlamalardan o‘zgartirish mumkin", en: "Change your goal in Settings" },
          { uz: "Seriya yarim tunda hisoblanadi", en: "Streak resets at midnight" },
        ],
      },
      {
        kicker: { uz: "Darslar", en: "Lessons" },
        title: { uz: "11 ta tizimdan birini tanlang", en: "Pick one of 11 systems" },
        text: {
          uz: "«Darslar» bo‘limida tana tizimlari ketma-ket joylashgan. Suyaklardan boshlash tavsiya etiladi — qolganlari unga tayanadi.",
          en: "The Lessons tab lists the body systems in order. Start with the skeleton — everything else builds on it.",
        },
        image: "/img/stories/bg-skull.webp",
        screen: "/img/stories/screens/topics.webp",
        hotspot: { x: 5, y: 12.5, w: 90, h: 11 },
        cta: { label: { uz: "Suyaklar tizimini ochish", en: "Open the skeletal system" }, systemId: "skeletal" },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2. Dars qanday o'tadi                                                */
  /* ------------------------------------------------------------------ */
  {
    id: "lesson",
    label: { uz: "Dars", en: "A lesson" },
    color: "#00B894",
    cover: "/img/stories/covers/lesson.webp",
    version: 3,
    pages: [
      {
        kicker: { uz: "1-qadam", en: "Step 1" },
        title: { uz: "Bo‘lim → dars", en: "Section → lesson" },
        text: {
          uz: "Har tizim bo‘limlarga, bo‘limlar darslarga bo‘lingan. Yashil «Boshlash» — navbatdagi dars. Qulflangan darslar oldingisini tugatgach ochiladi.",
          en: "Each system has sections, each section has lessons. The green «Start» is your next lesson. Locked ones open as you progress.",
        },
        image: "/img/stories/bg-vertebra.webp",
        screen: "/img/stories/screens/lessons.webp",
        hotspot: { x: 40, y: 39, w: 22, h: 12 },
      },
      {
        kicker: { uz: "2-qadam", en: "Step 2" },
        title: { uz: "Rangli diagramma", en: "Color diagram" },
        text: {
          uz: "Darsning boshida raqamlangan rasm. Ro‘yxatdagi nomni bossangiz — rasmda faqat o‘sha qism rangli bo‘lib ajralib turadi.",
          en: "Every lesson opens with a numbered figure. Tap a name in the list and only that part lights up on the image.",
        },
        image: "/img/stories/bg-vertebra.webp",
        screen: "/img/stories/screens/slide-hl.webp",
        hotspot: { x: 7, y: 50, w: 85, h: 5 },
        tips: [
          { uz: "Lupa tugmasi rasmni kattalashtiradi", en: "The magnifier zooms the figure" },
          { uz: "Flash-kartalar atamalarni yodlatadi", en: "Flashcards drill the terms" },
        ],
      },
      {
        kicker: { uz: "3-qadam", en: "Step 3" },
        title: { uz: "Savollarga javob bering", en: "Answer the questions" },
        text: {
          uz: "«Rasmda yashil rangda ko‘rsatilgan tuzilma nomi?» — variantni tanlang. To‘g‘ri javob yashil, xato — qizil va to‘g‘risi ko‘rsatiladi.",
          en: "«Name the structure highlighted in green» — pick an option. Correct turns green; wrong turns red and shows the answer.",
        },
        image: "/img/stories/bg-heart.webp",
        screen: "/img/stories/screens/correct.webp",
        hotspot: { x: 4, y: 51, w: 92, h: 8.5 },
        tips: [
          { uz: "Bayroqcha — savolda xato bo‘lsa xabar bering", en: "Flag — report a faulty question" },
          { uz: "Xatcho‘p — savolni saqlab qo‘ying", en: "Bookmark — save a question" },
        ],
      },
      {
        kicker: { uz: "4-qadam", en: "Step 4" },
        title: { uz: "Natija va XP", en: "Result & XP" },
        text: {
          uz: "70% dan yuqori — dars yakunlandi, XP hisobingizga tushadi va keyingi dars ochiladi. Kam bo‘lsa — qayta urinib ko‘ring, savollar aralashadi.",
          en: "Score 70%+ to complete the lesson, earn XP and unlock the next one. Below that — retry; the questions get shuffled.",
        },
        image: "/img/stories/bg-heart.webp",
        screen: "/img/stories/screens/result.webp",
        cta: { label: { uz: "Birinchi darsni boshlash", en: "Start the first lesson" }, lessonId: "l1" },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3. Takrorlash va esda saqlash                                        */
  /* ------------------------------------------------------------------ */
  {
    id: "practice",
    label: { uz: "Takrorlash", en: "Review" },
    color: "#F59E0B",
    cover: "/img/stories/covers/practice.webp",
    version: 3,
    pages: [
      {
        kicker: { uz: "Nega kerak", en: "Why" },
        title: { uz: "Xatolar o‘zi qaytib keladi", en: "Mistakes come back on their own" },
        text: {
          uz: "Xato qilingan har bir savol 1 → 3 → 7 → 16 → 35 kunlik oraliq bilan qaytadi (spaced repetition). Siz hech narsani rejalashtirmaysiz — ilova eslatadi.",
          en: "Every missed question returns at 1 → 3 → 7 → 16 → 35-day intervals (spaced repetition). You plan nothing — the app reminds you.",
        },
        image: "/img/stories/bg-brain.webp",
      },
      {
        kicker: { uz: "Takrorlash", en: "Review" },
        title: { uz: "Bugungi kartalar", en: "Today's cards" },
        text: {
          uz: "«Takrorlash» bo‘limida faqat muddati kelgan savollar chiqadi. 5–6 ta savol — 2 daqiqa. Kunni shundan boshlang.",
          en: "The Review section shows only the cards due today. 5–6 questions — 2 minutes. Start your day with it.",
        },
        image: "/img/stories/bg-brain.webp",
        screen: "/img/stories/screens/review.webp",
        hotspot: { x: 4, y: 58.5, w: 92, h: 8.5 },
        cta: { label: { uz: "Takrorlashni ochish", en: "Open Review" }, screen: "review" },
      },
      {
        kicker: { uz: "Sinov", en: "Exam" },
        title: { uz: "Imtihon rejimi", en: "Exam mode" },
        text: {
          uz: "Barcha darslardan aralash 10–50 ta savol, vaqt o‘lchanadi, natija foizda. Haqiqiy imtihon oldidan o‘zingizni tekshiring.",
          en: "10–50 mixed questions from every lesson, timed, scored in percent. Test yourself before the real exam.",
        },
        image: "/img/stories/bg-lungs.webp",
        screen: "/img/stories/screens/exam.webp",
        hotspot: { x: 4, y: 48.5, w: 92, h: 8 },
        cta: { label: { uz: "Imtihonni sinab ko‘rish", en: "Try an exam" }, screen: "exam" },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 4. Musobaqa                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: "compete",
    label: { uz: "Musobaqa", en: "Compete" },
    color: "#EF4444",
    cover: "/img/stories/covers/compete.webp",
    version: 3,
    pages: [
      {
        kicker: { uz: "Liga", en: "League" },
        title: { uz: "Haftalik reyting", en: "Weekly leaderboard" },
        text: {
          uz: "Har hafta XP bo‘yicha poyga: Bronza → Kumush → Oltin → Platina → Olmos. TOP-3 yuqori ligaga ko‘tariladi.",
          en: "A weekly XP race: Bronze → Silver → Gold → Platinum → Diamond. The top 3 move up a league.",
        },
        image: "/img/stories/bg-muscles.webp",
        screen: "/img/stories/screens/leaderboard.webp",
        hotspot: { x: 4, y: 15.5, w: 92, h: 9 },
        cta: { label: { uz: "Reytingni ko‘rish", en: "See the leaderboard" }, screen: "leaderboard" },
      },
      {
        kicker: { uz: "1 ga 1", en: "1 v 1" },
        title: { uz: "Bellashuv", en: "Battle" },
        text: {
          uz: "7 savol, har biriga 12 soniya. «Tezkor o‘yin» — internetdagi raqib, «Kod bilan» — do‘stingiz, «Mashq raqibi» — internetsiz.",
          en: "7 questions, 12 seconds each. «Quick match» — an online rival, «Friend code» — a friend, «Practice rival» — offline.",
        },
        image: "/img/stories/bg-muscles.webp",
        screen: "/img/stories/screens/battle.webp",
        hotspot: { x: 4, y: 42.5, w: 92, h: 10 },
        cta: { label: { uz: "Bellashuvni boshlash", en: "Start a battle" }, screen: "battle" },
      },
      {
        kicker: { uz: "Guruh", en: "Group" },
        title: { uz: "Kahoot — sinf o‘yini", en: "Kahoot — class game" },
        text: {
          uz: "O‘qituvchi «O‘yin ochish»ni bosadi va PIN oladi, talabalar PIN bilan kiradi. 10 savol × 20 soniya, tezlik balli, podyum.",
          en: "The teacher taps «Host game» and gets a PIN; students join with it. 10 questions × 20 s, speed points, a podium.",
        },
        image: "/img/stories/bg-hand.webp",
        screen: "/img/stories/screens/kahoot.webp",
        hotspot: { x: 4, y: 55.5, w: 45, h: 16 },
        tips: [
          { uz: "«Test tuzish» — o‘z savollaringiz bilan o‘yin", en: "«Create quiz» — play with your own questions" },
        ],
        cta: { label: { uz: "Kahoot’ni ochish", en: "Open Kahoot" }, screen: "kahoot" },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 5. Qo'shimcha vositalar                                              */
  /* ------------------------------------------------------------------ */
  {
    id: "tools",
    label: { uz: "Vositalar", en: "Tools" },
    color: "#06B6D4",
    cover: "/img/stories/covers/tools.webp",
    version: 3,
    pages: [
      {
        kicker: { uz: "3D", en: "3D" },
        title: { uz: "3D modellar", en: "3D models" },
        text: {
          uz: "Umurtqa, atlas, axis, kalla suyagi… Barmoq bilan aylantiring, yaqinlashtiring — suyakning haqiqiy shaklini ko‘ring.",
          en: "Vertebrae, atlas, axis, skull… Rotate and zoom with your finger to see the real shape of each bone.",
        },
        image: "/img/stories/bg-skull.webp",
        screen: "/img/stories/screens/models3d.webp",
        hotspot: { x: 4, y: 24, w: 92, h: 15 },
        cta: { label: { uz: "3D modellarni ochish", en: "Open 3D models" }, screen: "models3d" },
      },
      {
        kicker: { uz: "Lug‘at", en: "Glossary" },
        title: { uz: "Lotincha atamalar", en: "Latin terms" },
        text: {
          uz: "Atamani qidiring, karnay belgisi bilan talaffuzini eshiting, «Dars» tugmasi orqali o‘sha atama o‘tiladigan darsga o‘ting.",
          en: "Search a term, hear it pronounced with the speaker button, and jump to the lesson where it's taught via the «Lesson» button.",
        },
        image: "/img/stories/bg-organs.webp",
        screen: "/img/stories/screens/glossary.webp",
        hotspot: { x: 14, y: 9.5, w: 78, h: 4 },
        cta: { label: { uz: "Lug‘atni ochish", en: "Open the glossary" }, screen: "glossary" },
      },
      {
        kicker: { uz: "Kutubxona", en: "Library" },
        title: { uz: "Darslik va atlaslar", en: "Textbook & atlases" },
        text: {
          uz: "Ahmedov «Odam anatomiyasi» — 2 jild, qismlarga bo‘lingan PDF. Yuklab oling — internetsiz ham o‘qiysiz.",
          en: "Ahmedov's «Human Anatomy» — 2 volumes split into PDF parts. Download once and read offline.",
        },
        image: "/img/stories/bg-organs.webp",
        screen: "/img/stories/screens/library.webp",
        hotspot: { x: 4, y: 15.5, w: 92, h: 10 },
        cta: { label: { uz: "Kutubxonaga o‘tish", en: "Go to the library" }, screen: "library" },
      },
      {
        kicker: { uz: "Progress", en: "Progress" },
        title: { uz: "O‘sishingizni kuzating", en: "Track your growth" },
        text: {
          uz: "Haftalik XP grafigi, aniqlik foizi, tizimlar bo‘yicha bajarilgan darslar. Profil → «Progress tahlili».",
          en: "Weekly XP chart, accuracy, lessons done per system. Profile → «Progress».",
        },
        image: "/img/stories/bg-kidney.webp",
        screen: "/img/stories/screens/progress.webp",
        hotspot: { x: 4, y: 16, w: 92, h: 26 },
        cta: { label: { uz: "Progressni ko‘rish", en: "See my progress" }, screen: "progress" },
      },
    ],
  },
];
