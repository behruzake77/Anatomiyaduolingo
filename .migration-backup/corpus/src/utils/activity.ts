/**
 * Re-engagement faollik holati — tutor kayfiyati va xabari.
 * Mavjud faollik ma'lumotiga (seriya + oxirgi kirish vaqti) bog'langan.
 * Xabarlar NO-guilting: uzoq kirmagan foydalanuvchini ayblamaydi, faqat chaqiradi.
 */

export type TutorState =
  | "IDLE"
  | "HAPPY"
  | "CURIOUS"
  | "THINKING"
  | "ENCOURAGING"
  | "CONCERNED"
  | "CELEBRATING"
  | "WELCOME_BACK";

export interface ActivityState {
  state: TutorState;
  /** qancha kundan beri kirmagan (0 = bugun faol) */
  daysAway: number;
  /** i18n kaliti (xabar) */
  messageKey: string;
}

export function daysSince(ts: number): number {
  if (!ts) return 0;
  return Math.max(0, Math.floor((Date.now() - ts) / 86_400_000));
}

/**
 * Seriya + oxirgi faollik → tutor holati.
 * - 0 kun: HAPPY (faol)
 * - 1 kun: CURIOUS
 * - 2-3 kun: CONCERNED (xushmuomala)
 * - 4-13 kun: ENCOURAGING (motivatsion)
 * - 14+ kun: WELCOME_BACK (do'stona, ayblamaydi)
 */
export function activityState(streak: number, lastActiveAt: number): ActivityState {
  const daysAway = daysSince(lastActiveAt);
  if (daysAway <= 0) {
    // Faol foydalanuvchi — energiya seriya darajasiga bog'liq.
    if (streak >= 7) return { state: "CELEBRATING", daysAway: 0, messageKey: "mascotFire" };
    if (streak >= 1) return { state: "HAPPY", daysAway: 0, messageKey: "mascotHappy" };
    return { state: "IDLE", daysAway: 0, messageKey: "mascotNeutral" };
  }
  if (daysAway === 1) return { state: "CURIOUS", daysAway, messageKey: "rxInactive1" };
  if (daysAway <= 3) return { state: "CONCERNED", daysAway, messageKey: "rxInactive2" };
  if (daysAway <= 13) return { state: "ENCOURAGING", daysAway, messageKey: "rxInactive3" };
  return { state: "WELCOME_BACK", daysAway, messageKey: "rxInactive4" };
}

/** Seriya bosqichlari (milestone) — alohida nishonlash uchun. */
export const STREAK_MILESTONES = [7, 30, 50, 100];

export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak);
}
