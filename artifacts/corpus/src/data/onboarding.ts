export interface OnboardingSlide {
  id: string;
  icon: string; // lucide icon name (resolved via Icon)
  sticker: string;
  title: string;
  description: string;
}

export const ONBOARDING: OnboardingSlide[] = [
  {
    id: "interactive",
    icon: "layers",
    sticker: "/img/3d/lessons-book.webp",
    title: "Interaktiv o'rganish",
    description:
      "Inson tanasining har bir tizimini o'yin kabi qisqa, vizual darslar orqali o'rganing.",
  },
  {
    id: "quizzes",
    icon: "target",
    sticker: "/img/3d/daily-target.webp",
    title: "Aqlli testlar",
    description:
      "Xatolaringizga moslashuvchi testlar orqali bilimlaringizni mustahkamlang.",
  },
  {
    id: "progress",
    icon: "trending-up",
    sticker: "/img/3d/xp-star.webp",
    title: "Progressni kuzating",
    description:
      "XP to'plang, seriyani saqlang va anatomiya bo'yicha bosqichma-bosqich o'sing.",
  },
];
