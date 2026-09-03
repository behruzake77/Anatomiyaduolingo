export interface ProjectStoryPage {
  title: string;
  text: string;
  image: string;
}

export interface ProjectStory {
  id: string;
  label: string;
  icon: "book" | "settings" | "sparkles" | "bulb" | "team";
  color: string;
  cover: string;
  pages: ProjectStoryPage[];
}

/** Bosh sahifadagi Project Stories kontenti. Yangi story qo‘shish uchun shu massivga element qo‘shiladi. */
export const PROJECT_STORIES: ProjectStory[] = [
  {
    id: "about",
    label: "Loyiha haqida",
    icon: "book",
    color: "#6C5CE7",
    cover: "/img/3d/heart-3d.webp",
    pages: [
      { title: "Loyiha nima?", text: "AnatomiyaDuolingo — anatomiya fanini oson, qiziqarli va interaktiv o‘rganish uchun yaratilgan platforma.", image: "/img/atlas/miya.jpg" },
      { title: "Nima uchun yaratildi?", text: "Murakkab mavzularni qisqa darslar, rangli rasmlar va amaliy savollar orqali yodda saqlash oson bo‘lishi uchun.", image: "/img/atlas/skelet.jpg" },
      { title: "Kimlar foydalanadi?", text: "Tibbiyot talabalari, o‘qituvchilar va anatomiya bilimlarini mustahkamlashni istagan har bir kishi.", image: "/img/atlas/yurak.jpg" },
      { title: "Asosiy imkoniyatlar", text: "Darslar, quizlar, atlas, 3D modellar, lug‘at, takrorlash va bilimni sinash uchun imtihonlar.", image: "/img/atlas/myologia.jpg" },
    ],
  },
  {
    id: "how-it-works",
    label: "Qanday ishlaydi",
    icon: "settings",
    color: "#00B894",
    cover: "/img/3d/lessons-book.webp",
    pages: [
      { title: "1. Bo‘limni tanlang", text: "Bosh sahifadan yoki O‘rganish bo‘limidan kerakli anatomiya tizimini tanlang.", image: "/img/atlas/skelet.jpg" },
      { title: "2. Mavzuni o‘rganing", text: "Darsni o‘qing, rasmlarni ko‘ring va muhim lotincha atamalarni o‘zlashtiring.", image: "/img/atlas/digestorium.jpg" },
      { title: "3. Quizni boshlang", text: "Funksiyani ishga tushiring va savollarga javob berib bilimingizni tekshiring.", image: "/img/atlas/arthrologia.jpg" },
      { title: "4. Natijani oling", text: "Natijangizni ko‘ring, XP to‘plang va qiyin mavzularni qayta takrorlang.", image: "/img/atlas/yurak.jpg" },
    ],
  },
  {
    id: "news",
    label: "Yangiliklar",
    icon: "sparkles",
    color: "#FD79A8",
    cover: "/img/3d/daily-target.webp",
    pages: [{ title: "Yangiliklar shu yerda", text: "Platformadagi yangi darslar, imkoniyatlar va foydali yangilanishlarni birinchi bo‘lib bilib oling.", image: "/img/atlas/endokrin.jpg" }],
  },
  {
    id: "tips",
    label: "Foydali maslahatlar",
    icon: "bulb",
    color: "#F59E0B",
    cover: "/img/3d/streak-flame.webp",
    pages: [{ title: "Oz-ozdan, lekin har kuni", text: "Kuniga bir nechta savol yeching. Muntazam takrorlash anatomiya bilimlarini uzoq vaqt saqlashga yordam beradi.", image: "/img/atlas/respiratorium.jpg" }],
  },
  {
    id: "team",
    label: "Biz haqimizda",
    icon: "team",
    color: "#06B6D4",
    cover: "/img/3d/trophy-3d.webp",
    pages: [{ title: "Birgalikda rivojlanamiz", text: "AnatomiyaDuolingo jamoasi siz uchun qulay va zamonaviy ta’lim tajribasini yaratishda davom etadi.", image: "/img/atlas/umurtqa.jpg" }],
  },
];
