import { ACHIEVEMENTS, type Achievement } from "@/data/achievements";

export interface ProgressSnapshot {
  streak: number;
  correct: number;
  total: number;
  completedLessons: number;
  completedTopics: number;
}

/** Evaluate which achievements are newly unlocked. */
export function evaluateAchievements(snapshot: ProgressSnapshot, unlocked: string[]): string[] {
  const newly: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (unlocked.includes(a.id)) continue;
    if (a.condition(snapshot)) newly.push(a.id);
  }
  return newly;
}

export function unlockedAchievements(unlocked: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => unlocked.includes(a.id));
}
