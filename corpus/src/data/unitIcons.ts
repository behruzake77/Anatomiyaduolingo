/**
 * Bo'lim (unit) ikonchalari — haqiqiy anatomik rasm-ikonchalar.
 * Manba: har bir bo'lim mavzusiga mos rangli vektor illyustratsiya
 * (Ahmedov darsligidagi mavzular asosida, fakt emas — faqat vizual).
 * Bo'limda rasm bo'lmasa, eski lucide ikonka ishlatiladi (fallback).
 */
export const UNIT_ICON_IMAGES: Record<string, string> = {
  // Suyaklar tizimi
  u1: "/img/icon/u1.jpg", // Umurtqa pog'onasi
  u2: "/img/icon/u2.jpg", // Bo'yin umurtqalari
  u3: "/img/icon/u3.jpg", // Ko'krak va bel
  u4: "/img/icon/u4.jpg", // Dumg'aza va dum
  u5: "/img/icon/u5.jpg", // Ko'krak qafasi suyaklari
  u6: "/img/icon/u6.jpg", // Qo'l skeleti
  u7: "/img/icon/u7.jpg", // Oyoq skeleti
  u8: "/img/icon/u8.jpg", // Kalla — miya qismi
  u9: "/img/icon/u9.jpg", // Kalla — yuz qismi
  // Bo'g'imlar
  "ar-1": "/img/icon/ar-1.jpg", // Bo'g'imlar — batafsil
};

/** Bo'lim uchun rasm-ikoncha yo'lini qaytaradi (yo'q bo'lsa undefined). */
export function unitIconImage(unitId: string): string | undefined {
  return UNIT_ICON_IMAGES[unitId];
}
