export interface OnboardingSlide {
  id: string;
  icon: string; // lucide icon name (resolved via Icon)
  title: string;
  description: string;
}

export const ONBOARDING: OnboardingSlide[] = [
  {
    id: "interactive",
    icon: "layers",
    title: "Interactive Learning",
    description:
      "Explore every system of the human body with bite-sized, visual lessons built like a game.",
  },
  {
    id: "quizzes",
    icon: "target",
    title: "Smart Quizzes",
    description:
      "Reinforce what you learn with adaptive quizzes that adapt to your mistakes.",
  },
  {
    id: "progress",
    icon: "trending-up",
    title: "Track Progress",
    description:
      "Earn XP, keep your streak alive and master anatomy one level at a time.",
  },
];
