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
}

/** Barcha yutuqlar (badges). Qulflanganlari xira ko'rsatiladi. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    title: "Ilk qadam",
    description: "Birinchi darsni tugating",
    icon: Sparkles,
    accent: "#6C5CE7",
    condition: (s) => s.completedLessons >= 1,
  },
  {
    id: "week_warrior",
    title: "Hafta jangchisi",
    description: "7 kunlik seriyaga erishing",
    icon: Flame,
    accent: "#F59E0B",
    condition: (s) => s.streak >= 7,
  },
  {
    id: "knowledgeable",
    title: "Bilimdon",
    description: "100 ta savolga to'g'ri javob bering",
    icon: Brain,
    accent: "#00B894",
    condition: (s) => s.correct >= 100,
  },
  {
    id: "dedicated",
    title: "Sadoqatli",
    description: "10 kunlik seriyaga erishing",
    icon: CalendarCheck,
    accent: "#FD79A8",
    condition: (s) => s.streak >= 10,
  },
  {
    id: "anatomy_expert",
    title: "Anatomiya mutaxassisi",
    description: "5 ta mavzuni tugating",
    icon: Trophy,
    accent: "#A29BFE",
    condition: (s) => s.completedTopics >= 5,
  },
  {
    id: "quiz_master",
    title: "Quiz ustasi",
    description: "O'rtacha 90%+ aniqlik",
    icon: Target,
    accent: "#EF4444",
    condition: (s) => s.total >= 10 && s.correct / s.total >= 0.9,
  },
];
