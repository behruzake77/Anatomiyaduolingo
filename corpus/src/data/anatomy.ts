/**
 * Anatomiya kontenti — 6 tana tizimi, darslar, quiz savollari
 * va interaktiv atlas ob'yektlari. O'zbekcha + lotincha atamalar.
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  minutes: number;
}

export interface BodySystem {
  id: string;
  name: string;
  latin: string;
  en: string;
  icon: string; // lucide icon name
  color: string;
  image: string;
  completed: number;
  total: number;
  lessons: Lesson[];
}

export interface AtlasObject {
  id: string;
  name: string;
  latin: string;
  en: string;
  image: string;
  description: string;
  function: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  image?: string;
  /** % position of the green highlight on the image */
  highlight?: { x: number; y: number };
  options: string[];
  answer: number;
  explanation: string;
}

export const SYSTEMS: BodySystem[] = [
  {
    id: "skeletal",
    name: "Suyaklar tizimi",
    latin: "Systema skeletale",
    en: "Skeletal System",
    icon: "bone",
    color: "#6C5CE7",
    image: "/img/skeleton.jpg",
    completed: 12,
    total: 24,
    lessons: [
      { id: "sk-1", title: "Suyaklar haqida kirish", description: "Suyak turlari va tasnifi", xp: 20, minutes: 6 },
      { id: "sk-2", title: "Bosh suyagi", description: "Miya va yuz suyaklari", xp: 25, minutes: 8 },
      { id: "sk-3", title: "Umurtqa pog'onasi", description: "Bo'yin, ko'krak va bel umurtqalari", xp: 25, minutes: 9 },
      { id: "sk-4", title: "Qovurg'alar va to'sh suyagi", description: "Ko'krak qafasi himoyasi", xp: 20, minutes: 7 },
    ],
  },
  {
    id: "muscular",
    name: "Mushaklar tizimi",
    latin: "Systema musculare",
    en: "Muscular System",
    icon: "activity",
    color: "#FD79A8",
    image: "/img/muscles.jpg",
    completed: 8,
    total: 24,
    lessons: [
      { id: "mu-1", title: "Mushak turlari", description: "Skelet, yurak va silliq mushaklar", xp: 20, minutes: 6 },
      { id: "mu-2", title: "Asosiy mushak guruhlari", description: "Delta mushakdan to'rt boshli songacha", xp: 25, minutes: 8 },
      { id: "mu-3", title: "Mushak qisqarishi", description: "Sirpanish mexanizmi", xp: 25, minutes: 9 },
    ],
  },
  {
    id: "digestive",
    name: "Hazm tizimi",
    latin: "Systema digestorium",
    en: "Digestive System",
    icon: "apple",
    color: "#F59E0B",
    image: "/img/stomach.jpg",
    completed: 6,
    total: 24,
    lessons: [
      { id: "di-1", title: "Hazm yo'li", description: "Og'izdan yo'g'on ichakkacha", xp: 20, minutes: 7 },
      { id: "di-2", title: "Oshqozon va jigar", description: "Kimyoviy hazm jarayoni", xp: 25, minutes: 8 },
      { id: "di-3", title: "So'rilish", description: "Oziq moddalarning qonga o'tishi", xp: 25, minutes: 8 },
    ],
  },
  {
    id: "respiratory",
    name: "Nafas tizimi",
    latin: "Systema respiratorium",
    en: "Respiratory System",
    icon: "wind",
    color: "#00B894",
    image: "/img/lungs.jpg",
    completed: 5,
    total: 24,
    lessons: [
      { id: "re-1", title: "Nafas yo'llari", description: "Kekirdak, bronxlar va o'pka", xp: 20, minutes: 6 },
      { id: "re-2", title: "Gaz almashinuvi", description: "Alveolalar va kislorod", xp: 25, minutes: 8 },
    ],
  },
  {
    id: "nervous",
    name: "Asab tizimi",
    latin: "Systema nervosum",
    en: "Nervous System",
    icon: "brain",
    color: "#A29BFE",
    image: "/img/brain.jpg",
    completed: 7,
    total: 24,
    lessons: [
      { id: "ne-1", title: "Bosh miya", description: "Katta yarim pallalar, miyacha, so'g'on", xp: 25, minutes: 9 },
      { id: "ne-2", title: "Neyronlar va sinapslar", description: "Signallar qanday uzatiladi", xp: 25, minutes: 9 },
    ],
  },
  {
    id: "circulatory",
    name: "Qon aylanish tizimi",
    latin: "Systema circulatorium",
    en: "Circulatory System",
    icon: "heart",
    color: "#EF4444",
    image: "/img/heart.jpg",
    completed: 4,
    total: 24,
    lessons: [
      { id: "ci-1", title: "Yurak", description: "Kameralar va klapanlar", xp: 25, minutes: 9 },
      { id: "ci-2", title: "Qon tomirlari", description: "Arteriyalar, venalar, kapillarlar", xp: 20, minutes: 7 },
    ],
  },
];

export const ATLAS_OBJECTS: AtlasObject[] = [
  {
    id: "heart",
    name: "Yurak",
    latin: "Cor",
    en: "Heart",
    image: "/img/heart.jpg",
    description:
      "Qonni butun tana bo'ylab haydaydigan muskul a'zo — daqiqasiga o'rtacha 70–75 marta qisqaradi.",
    function: "Qon aylanishini ta'minlash",
  },
  {
    id: "brain",
    name: "Bosh miya",
    latin: "Encephalon",
    en: "Brain",
    image: "/img/brain.jpg",
    description:
      "Asab tizimining boshqaruv markazi — fikrlash, xotira va muvozanat uchun javobgar.",
    function: "Axborotni qayta ishlash",
  },
  {
    id: "lungs",
    name: "O'pka",
    latin: "Pulmo",
    en: "Lungs",
    image: "/img/lungs.jpg",
    description:
      "Kislorod qonga o'tib, karbonat angidrid chiqariladigan juft nafas a'zosi.",
    function: "Gaz almashinuvi",
  },
  {
    id: "stomach",
    name: "Oshqozon",
    latin: "Gaster",
    en: "Stomach",
    image: "/img/stomach.jpg",
    description:
      "Ovqatni mexanik va kimyoviy qayta ishlaydigan hazm yo'lining kengaygan qismi.",
    function: "Ovqat hazm qilish",
  },
  {
    id: "kidney",
    name: "Buyrak",
    latin: "Ren",
    en: "Kidney",
    image: "/img/kidney.svg",
    description:
      "Qonni filtrlash orqali siydik hosil qiluvchi, suv-tuz muvozanatini saqlovchi loviyasimon a'zo.",
    function: "Filtrlash",
  },
  {
    id: "skeleton",
    name: "Skelet",
    latin: "Skeleton",
    en: "Skeleton",
    image: "/img/skeleton.jpg",
    description:
      "Tananing 206 ta suyakdan iborat asosi — tayanch vazifasini bajaradi va a'zolarni himoya qiladi.",
    function: "Tayanch va himoya",
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Rasmda ta'kidlangan suyak qaysi?",
    image: "/img/ribs.jpg",
    highlight: { x: 50, y: 42 },
    options: ["Sternum", "Clavicula", "Scapula", "Humerus"],
    answer: 0,
    explanation: "Sternum (to'sh suyagi) ko'krakning markazida joylashib, qovurg'alarni biriktiradi.",
  },
  {
    id: "q2",
    prompt: "Sonni hosil qiluvchi suyak qaysi?",
    image: "/img/femur.jpg",
    options: ["Tibia", "Fibula", "Femur", "Patella"],
    answer: 2,
    explanation: "Femur — inson tanasidagi eng uzun va mustahkam suyak.",
  },
  {
    id: "q3",
    prompt: "Qaysi a'zo qonni tana bo'ylab haydaydi?",
    image: "/img/heart.jpg",
    options: ["O'pka", "Jigar", "Miya", "Yurak"],
    answer: 3,
    explanation: "Yurak qon aylanishini ta'minlash uchun daqiqasiga ~70–75 marta qisqaradi.",
  },
  {
    id: "q4",
    prompt: "Qon bilan gaz almashinuvi qayerda sodir bo'ladi?",
    image: "/img/lungs.jpg",
    options: ["Kekirdak", "Alveolalar", "Bronxlar", "Hiqildoq"],
    answer: 1,
    explanation: "Alveolalar — kislorod va karbonat angidrid almashinadigan mayda havo pufakchalari.",
  },
  {
    id: "q5",
    prompt: "Bosh miyaning qaysi qismi muvozanatni boshqaradi?",
    image: "/img/brain.jpg",
    options: ["Katta yarim pallalar", "Miyacha", "Miya so'g'oni", "Talamus"],
    answer: 1,
    explanation: "Miyacha (cerebellum) harakat, muvozanat va tana holatini sozlaydi.",
  },
  {
    id: "q6",
    prompt: "Bosh suyagi qaysi ikki qismdan iborat?",
    image: "/img/skull.jpg",
    options: ["Miya qismi va yuz qismi", "Miya qismi va bo'yin", "Yuz qismi va jag'", "Gumbaz va umurtqa"],
    answer: 0,
    explanation: "Bosh suyagi miya gumbazi va yuz skeletiga bo'linadi.",
  },
];
