/** Gamification: level progression derived from XP. */

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 160) + 1);
}

export type LevelTier = "beginner" | "intermediate" | "advanced" | "expert";

export function levelTier(level: number): LevelTier {
  if (level <= 3) return "beginner";
  if (level <= 9) return "intermediate";
  if (level <= 14) return "advanced";
  return "expert";
}

export function xpToNextLevel(xp: number): { current: number; next: number } {
  const level = levelFromXp(xp);
  const current = (level - 1) * 160;
  const next = level * 160;
  return { current, next };
}
