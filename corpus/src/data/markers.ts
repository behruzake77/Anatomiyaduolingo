/**
 * Interaktiv nishonlar — rasm ustidagi raqamli nuqtalar (0..1 nisbiy koordinata).
 * Har bir nuqta kitobdagi rasmda bosilgan raqam joyiga mos keladi.
 * `approx: true` = joylashuvi taxminiy (OCR/qo'lda baholangan) — aniqlashtirilishi mumkin.
 *
 * Hozircha pilot: Atlas (C1) — l5. Qolgan darslar navbatma-navbat qo'shiladi.
 */
export interface LessonMarker {
  n: string;
  x: number;
  y: number;
  approx?: boolean;
}

export const LESSON_MARKERS: Record<string, LessonMarker[]> = {
  // Atlas (C1) — ust tomondan ko'rinishi (Ahmedov I jild, 40-bet, 10-rasm)
  l5: [
    { n: "1", x: 0.287, y: 0.097, approx: true },
    { n: "2", x: 0.385, y: 0.110 },
    { n: "3", x: 0.442, y: 0.132 },
    { n: "4", x: 0.029, y: 0.212, approx: true },
    { n: "5", x: 0.498, y: 0.219 },
    { n: "6", x: 0.347, y: 0.295 },
    { n: "7", x: 0.181, y: 0.289 },
    { n: "8", x: 0.106, y: 0.248 },
    { n: "9", x: 0.189, y: 0.113 },
  ],
};
