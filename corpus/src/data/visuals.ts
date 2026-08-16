/**
 * VIZUAL kontent — har bir tizim uchun rasmli savollar va rasmli slaydlar.
 * Toza bitta-a'zoli illyustratsiyalar + haqiqiy atlas sahifalari.
 */
import type { Question } from "./types";

const q = (x: Question): Question => x;

/** Har tizim uchun rasmli (img) savollar — toza bitta-a'zoli rasmlar bilan. */
export const IMG_QUESTIONS: Record<string, Question[]> = {
  muscular: [
    q({
      type: "img",
      prompt: "Rasmda qaysi tana tizimi ko'rsatilgan?",
      image: "/img/muscles.jpg",
      options: ["Suyaklar tizimi", "Mushaklar tizimi", "Asab tizimi", "Qon aylanish tizimi"],
      answer: 1,
      difficulty: "easy",
      hint: "Ko'ndalang-targ'il tolalardan tashkil topgan",
    }),
  ],
  digestive: [
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/stomach.jpg",
      options: ["Jigar (Hepar)", "Oshqozon (Gaster)", "O't pufagi", "Buyrak (Ren)"],
      answer: 1,
      difficulty: "easy",
      hint: "Hazm yo'lining kengaygan qismi",
    }),
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/liver.svg",
      options: ["Oshqozon", "Jigar (Hepar)", "Taloq (Lien)", "Buyrak (Ren)"],
      answer: 1,
      difficulty: "easy",
      hint: "Organizmdagi eng katta bez",
    }),
  ],
  respiratory: [
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/lungs.jpg",
      options: ["Yurak (Cor)", "Jigar (Hepar)", "O'pka (Pulmo)", "Buyrak (Ren)"],
      answer: 2,
      difficulty: "easy",
      hint: "Juft nafas a'zosi",
    }),
  ],
  urinary: [
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/kidney.svg",
      options: ["Jigar", "Buyrak (Ren)", "Taloq", "O't pufagi"],
      answer: 1,
      difficulty: "easy",
      hint: "Loviyasimon, qonni filtrlaydi",
    }),
  ],
  circulatory: [
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/heart.jpg",
      options: ["O'pka (Pulmo)", "Yurak (Cor)", "Jigar (Hepar)", "Buyrak (Ren)"],
      answer: 1,
      difficulty: "easy",
      hint: "Qon aylanish tizimining markaziy a'zosi",
    }),
  ],
  nervous: [
    q({
      type: "img",
      prompt: "Rasmda qaysi a'zo ko'rsatilgan?",
      image: "/img/brain.jpg",
      options: ["Miyacha", "Bosh miya (Encephalon)", "Orqa miya", "Ko'prik"],
      answer: 1,
      difficulty: "easy",
      hint: "Asab tizimining boshqaruv markazi",
    }),
  ],
  skeletal: [
    q({
      type: "img",
      prompt: "Rasmda qaysi tuzilma ko'rsatilgan?",
      image: "/img/skeleton.jpg",
      options: ["Mushaklar tizimi", "Odam skeleti", "Nafas a'zolari", "Qon aylanish tizimi"],
      answer: 1,
      difficulty: "easy",
      hint: "Suyaklardan tashkil topgan tayanch",
    }),
  ],
};

/** Rasmli slaydlar (kirish uchun) — toza rasmi yo'q tizimlar uchun atlas sahifalari. */
export const VISUAL_SLIDES: Record<string, { title: string; text: string; img: string }> = {
  arthrology: {
    title: "Bo'g'imlar atlasi",
    text: "Bo'g'imlar (articulationes) suyaklarni o'zaro bog'lab, harakatni ta'minlaydi. Rasmda bo'g'im tuzilishi ko'rsatilgan.",
    img: "/img/atlas/arthrologia.jpg",
  },
  endocrine: {
    title: "Endokrin bezlar atlasi",
    text: "Endokrin bezlar gormonlar ishlab chiqaradi. Rasmda gipofiz va uning joylashuvi ko'rsatilgan.",
    img: "/img/atlas/endokrin.jpg",
  },
  reproductive: {
    title: "Jinsiy tizim atlasi",
    text: "Jinsiy a'zolar tizimi ko'payish vazifasini bajaradi. Rasmda erkak jinsiy a'zolari ko'rsatilgan.",
    img: "/img/atlas/jinsiy.jpg",
  },
  sensory: {
    title: "Sezgi a'zolari atlasi",
    text: "Sezgi a'zolari tashqi muhitdan axborot qabul qiladi. Rasmda ko'rish va eshitish a'zolari ko'rsatilgan.",
    img: "/img/atlas/neurocranium.jpg",
  },
};
