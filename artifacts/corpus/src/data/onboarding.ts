export interface OnboardingSlide {
  id: string;
  icon: string; // lucide icon name (resolved via Icon)
  sticker: string;
  illustration?: string; // full 3D illustration (PNG) shown large in onboarding
  title: string;
  description: string;
}

export const ONBOARDING: OnboardingSlide[] = [
  {
    id: "interactive",
    icon: "layers",
    sticker: "/img/3d/lessons-book.webp",
    illustration: "/img/3d/onboard-learn.png",
    title: "Interaktiv o'rganish",
    description:
      "Inson tanasining har bir tizimini o'yin kabi qisqa, vizual darslar orqali o'rganing.",
  },
  {
    id: "quizzes",
    icon: "target",
    sticker: "/img/3d/daily-target.webp",
    illustration: "/img/3d/onboard-practice.png",
    title: "Aqlli testlar",
    description:
      "Xatolaringizga moslashuvchi testlar orqali bilimlaringizni mustahkamlang.",
  },
  {
    id: "progress",
    icon: "trending-up",
    sticker: "/img/3d/xp-star.webp",
    illustration: "/img/3d/onboard-progress.png",
    title: "Progressni kuzating",
    description:
      "XP to'plang, seriyani saqlang va anatomiya bo'yicha bosqichma-bosqich o'sing.",
  },
];
