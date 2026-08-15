/** Gamification: level progression derived from XP. */

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 160) + 1);
}

export type LevelTier = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export function levelTier(level: number): LevelTier {
  if (level <= 3) return "Beginner";
  if (level <= 9) return "Intermediate";
  if (level <= 14) return "Advanced";
  return "Expert";
}

export function levelLabel(level: number): string {
  return `Level ${level} • ${levelTier(level)}`;
}

export function xpToNextLevel(xp: number): { current: number; next: number } {
  const level = levelFromXp(xp);
  const current = (level - 1) * 160;
  const next = level * 160;
  return { current, next };
}
