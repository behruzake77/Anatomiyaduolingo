/**
 * Spaced Repetition (SRS) — xato qilingan savollarni interval bilan qaytarish.
 * Box sxemasi: 0 (darhol) → 1 (+1 kun) → 2 (+3 kun) → 3 (+7 kun) → 4 (+16 kun) → 5 (+35 kun).
 * Box 5 dan keyin to'g'ri javob = "o'zlashtirilgan" (karta o'chiriladi).
 */

export interface SRSCard {
  /** joriy quti darajasi 0..5 */
  box: number;
  /** qachon takrorlash kerak (timestamp, ms) */
  due: number;
  /** necha marta xato qilingan */
  wrong: number;
}

/** Har bir qutiga mos kunlar (0 = darhol). */
export const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35];

/** Yuqori quti — shu darajaga yetgach to'g'ri javob "o'zlashtirilgan" hisoblanadi. */
export const SRS_MASTERED_BOX = SRS_INTERVALS_DAYS.length - 1;

const DAY_MS = 86_400_000;

/** Dars ichidagi savol uchun barqaror kalit (saralangandan keyingi indeks bo'yicha). */
export function questionKey(lessonId: string, index: number): string {
  return `${lessonId}#${index}`;
}

export function parseKey(key: string): { lessonId: string; index: number } | null {
  const i = key.lastIndexOf("#");
  if (i < 0) return null;
  const index = Number(key.slice(i + 1));
  const lessonId = key.slice(0, i);
  return Number.isInteger(index) && lessonId ? { lessonId, index } : null;
}

/** Javob natijasiga ko'ra kartani yangilash. */
export function reviewCard(card: SRSCard | undefined, correct: boolean, now = Date.now()): SRSCard {
  const c = card ?? { box: 0, due: 0, wrong: 0 };
  if (correct) {
    const box = Math.min(c.box + 1, SRS_MASTERED_BOX);
    return { box, due: now + SRS_INTERVALS_DAYS[box] * DAY_MS, wrong: c.wrong };
  }
  return { box: 0, due: now, wrong: c.wrong + 1 };
}

export function isDue(card: SRSCard, now = Date.now()): boolean {
  return card.due <= now;
}

/** Hozir takrorlash kerak bo'lgan savollar soni. */
export function dueCount(srs: Record<string, SRSCard>, now = Date.now()): number {
  let n = 0;
  for (const k in srs) if (srs[k].due <= now) n += 1;
  return n;
}

/** Kartaning keyingi takrorlash muddati matni (masalan: "1 kundan keyin"). */
export function nextInText(card: SRSCard): string {
  const days = Math.max(0, Math.round((card.due - Date.now()) / DAY_MS));
  return `${days}`;
}
