/**
 * Tizim (system) ikonchalari — haqiqiy, ko'zni tortadigan anatomik rasmlar.
 * Manba: har bir tizim mavzusiga mos rangli vektor illyustratsiya
 * (Ahmedov darsligidagi mavzular asosida, fakt emas — faqat vizual).
 * Rasm bo'lmasa, eski lucide ikonka ishlatiladi (fallback).
 */
export const SYSTEM_ICON_IMAGES: Record<string, string> = {
  skeletal: "/img/sys/skeletal.jpg", // Suyaklar tizimi
  arthrology: "/img/sys/arthrology.jpg", // Bo'g'imlar
  muscular: "/img/sys/muscular.jpg", // Mushaklar tizimi
  digestive: "/img/sys/digestive.jpg", // Hazm tizimi
  respiratory: "/img/sys/respiratory.jpg", // Nafas tizimi
  circulatory: "/img/sys/circulatory.jpg", // Yurak-qon tomir tizimi
  nervous: "/img/sys/nervous.jpg", // Asab tizimi
  urinary: "/img/sys/urinary.jpg", // Siydik tizimi
  reproductive: "/img/sys/reproductive.jpg", // Jinsiy tizim
  endocrine: "/img/sys/endocrine.jpg", // Endokrin bezlar
  // sensory: "/img/sys/sensory.jpg", // Sezgi a'zolari (navbatdagi)
};

/** Tizim uchun rasm-ikoncha yo'lini qaytaradi (yo'q bo'lsa undefined). */
export function systemIconImage(systemId: string): string | undefined {
  return SYSTEM_ICON_IMAGES[systemId];
}
