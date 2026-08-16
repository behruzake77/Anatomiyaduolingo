/**
 * Interaktiv nishonlar — rasm ustidagi raqamli nuqtalar (0..1 nisbiy koordinata,
 * to'liq sahifa kesimi rasmi /img/book/l*.jpg ga nisbatan).
 *
 * Manba: Ahmedov "Anatomiya I jild" skaneridagi raqamlar (OCR orqali aniqlangan).
 * `approx: true` = joylashuvi taxminiy (OCR topmagan yoki past aniqlik) — foydalanuvchi tekshirib, aniqlashtirilishi mumkin.
 * `approx: false` = OCR yuqori aniqlikda (conf ≥ 0.96) topdi.
 *
 * Qo'shilgan: l5 (Atlas C1), l4 (bo'yin umurtqasi), l6 (Axis C2), l16 (yelka suyagi — ikki ko'rinish).
 */
export interface LessonMarker {
  n: string;
  x: number;
  y: number;
  approx?: boolean;
}

export const LESSON_MARKERS: Record<string, LessonMarker[]> = {
  // Atlas (C1) — ust tomondan ko'rinishi (I jild, 40-bet, 10-rasm)
  l5: [
    { n: "1", x: 0.285, y: 0.083, approx: true },
    { n: "2", x: 0.385, y: 0.110 },
    { n: "3", x: 0.442, y: 0.132 },
    { n: "4", x: 0.029, y: 0.212, approx: true },
    { n: "5", x: 0.498, y: 0.219 },
    { n: "6", x: 0.347, y: 0.295, approx: true },
    { n: "7", x: 0.181, y: 0.289, approx: true },
    { n: "8", x: 0.106, y: 0.248 },
    { n: "9", x: 0.189, y: 0.113 },
  ],

  // Bo'yin umurtqasi — ust tomondan ko'rinishi (I jild, 39-bet, 9-rasm)
  l4: [
    { n: "1", x: 0.696, y: 0.074, approx: true },
    { n: "2", x: 0.900, y: 0.134 },
    { n: "3", x: 0.894, y: 0.185 },
    { n: "4", x: 0.802, y: 0.231 },
    { n: "5", x: 0.775, y: 0.254 },
    { n: "6", x: 0.867, y: 0.121, approx: true },
    { n: "7", x: 0.911, y: 0.205, approx: true },
    { n: "8", x: 0.529, y: 0.109, approx: true },
    { n: "9", x: 0.518, y: 0.095 },
    { n: "10", x: 0.559, y: 0.082 },
    { n: "11", x: 0.586, y: 0.079 },
  ],

  // Axis (C2) — orqa tomondan ko'rinishi (I jild, 41-bet, 11-rasm)
  l6: [
    { n: "1", x: 0.761, y: 0.082, approx: true },
    { n: "2", x: 0.761, y: 0.139, approx: true },
    { n: "3", x: 0.862, y: 0.192 },
    { n: "4", x: 0.778, y: 0.315 },
    { n: "5", x: 0.694, y: 0.339 },
  ],

  // Yelka suyagi (humerus) — A old tomondan ko'rinishi (I jild, 59-bet, 23-rasm).
  // IKKI ko'rinish (A old + B orqa) borligi uchun hammasi taxminiy — tekshirish talab qilinadi.
  l16: [
    { n: "1", x: 0.360, y: 0.150, approx: true },
    { n: "2", x: 0.444, y: 0.176, approx: true },
    { n: "3", x: 0.214, y: 0.187, approx: true },
    { n: "4", x: 0.414, y: 0.221, approx: true },
    { n: "5", x: 0.405, y: 0.241, approx: true },
    { n: "6", x: 0.376, y: 0.404, approx: true },
    { n: "7", x: 0.368, y: 0.434, approx: true },
    { n: "8", x: 0.371, y: 0.460, approx: true },
    { n: "9", x: 0.321, y: 0.536, approx: true },
    { n: "10", x: 0.214, y: 0.598, approx: true },
    { n: "11", x: 0.322, y: 0.619, approx: true },
    { n: "12", x: 0.260, y: 0.616, approx: true },
    { n: "13", x: 0.200, y: 0.571, approx: true },
    { n: "14", x: 0.222, y: 0.526, approx: true },
    { n: "15", x: 0.486, y: 0.383, approx: true },
    { n: "16", x: 0.447, y: 0.352, approx: true },
    { n: "17", x: 0.288, y: 0.229, approx: true },
    { n: "18", x: 0.279, y: 0.199, approx: true },
    { n: "19", x: 0.272, y: 0.170, approx: true },
  ],
};
