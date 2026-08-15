import type { LucideIcon } from "lucide-react";
import { Sparkles, Flame, Brain, CalendarCheck, Trophy, Target } from "lucide-react";
import type { ProgressSnapshot } from "@/utils/achievements";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string; // hex accent used for the badge
  condition: (s: ProgressSnapshot) => boolean;
  comingSoon?: boolean;
}

/** The 6 hero badges from the brief, plus a "coming soon" tier. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: Sparkles,
    accent: "#6C5CE7",
    condition: (s) => s.completedLessons >= 1,
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Reach a 7 day streak",
    icon: Flame,
    accent: "#F59E0B",
    condition: (s) => s.streak >= 7,
  },
  {
    id: "knowledgeable",
    title: "Knowledgeable",
    description: "Answer 100 questions correctly",
    icon: Brain,
    accent: "#00B894",
    condition: (s) => s.correct >= 100,
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Reach a 10 day streak",
    icon: CalendarCheck,
    accent: "#FD79A8",
    condition: (s) => s.streak >= 10,
  },
  {
    id: "anatomy_expert",
    title: "Anatomy Expert",
    description: "Complete 5 anatomy topics",
    icon: Trophy,
    accent: "#A29BFE",
    condition: (s) => s.completedTopics >= 5,
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Score 90%+ average accuracy",
    icon: Target,
    accent: "#EF4444",
    condition: (s) => s.total >= 10 && s.correct / s.total >= 0.9,
  },
];

export const COMING_SOON: Achievement[] = [
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Finish a lesson with 100%",
    icon: Trophy,
    accent: "#94A3B8",
    condition: () => false,
    comingSoon: true,
  },
  {
    id: "speed_runner",
    title: "Speed Runner",
    description: "Complete a quiz under 2 minutes",
    icon: Target,
    accent: "#94A3B8",
    condition: () => false,
    comingSoon: true,
  },
  {
    id: "marathon",
    title: "Marathon",
    description: "Reach Level 20",
    icon: Flame,
    accent: "#94A3B8",
    condition: () => false,
    comingSoon: true,
  },
];
