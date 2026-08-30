/**
 * Maskot kayfiyati — Duolingo uslubida vaziyatga qarab o'zgaradi.
 * Kayfiyat seriya (streak) va oxirgi faollik vaqtiga bog'liq.
 */

export type MascotMood =
  | "fire" // 7+ kunlik seriya
  | "happy" // 3-6 kunlik seriya
  | "neutral" // faol, seriya 1-2
  | "sad" // bugun faol, lekin seriya yo'q / yangi
  | "angry" // 2-6 kundan beri kirmagan
  | "sleeping"; // 7+ kundan beri kirmagan

export interface MascotState {
  mood: MascotMood;
  /** qancha kundan beri kirmagan (0 = bugun kirdi) */
  daysAway: number;
}

export function daysSince(ts: number): number {
  if (!ts) return 999;
  return Math.max(0, Math.floor((Date.now() - ts) / 86_400_000));
}

export function mascotState(streak: number, lastActiveAt: number): MascotState {
  // Hech qachon o'rganmagan (yangi foydalanuvchi) — xush kelibsiz, seriya yo'q.
  if (!lastActiveAt) return { mood: "sad", daysAway: 0 };
  const daysAway = daysSince(lastActiveAt);
  // Seriya "bugun" uzilmagan bo'lsa ham, kirmagan bo'lsa — seriya tushib ketgan.
  if (daysAway >= 7) return { mood: "sleeping", daysAway };
  if (daysAway >= 2) return { mood: "angry", daysAway };
  if (streak >= 7) return { mood: "fire", daysAway: 0 };
  if (streak >= 3) return { mood: "happy", daysAway: 0 };
  if (streak >= 1) return { mood: "neutral", daysAway: 0 };
  return { mood: "sad", daysAway: 0 };
}

/** Maskot kayfiyatiga mos so'z pufakchasi i18n kalitini qaytaradi. */
export function mascotMessageKey(state: MascotState): string {
  switch (state.mood) {
    case "fire": return "mascotFire";
    case "happy": return "mascotHappy";
    case "neutral": return "mascotNeutral";
    case "sad": return "mascotSad";
    case "angry": return "mascotAngry";
    case "sleeping": return "mascotSleeping";
  }
}
