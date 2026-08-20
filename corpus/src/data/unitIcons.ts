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
  // Mushaklar
  "my-1": "/img/icon/my-1.jpg", // Mushaklar — batafsil
  "nh-1": "/img/icon/nh-1.jpg", // Bo'yin mushaklari — batafsil
  // Tomirlar
  "ang-1": "/img/icon/ang-1.jpg", // Tomirlar — batafsil
  "vs-1": "/img/icon/vs-1.jpg", // Arteriyalar — batafsil
  // Nerv tizimi
  "px-1": "/img/icon/px-1.jpg", // Nerv chigallari — batafsil
  "ne-1": "/img/icon/ne-1.jpg", // Markaziy nerv tizimi — batafsil
  "ne-2": "/img/icon/ne-2.jpg", // Bosh miya nervlari — batafsil
  // Sezgi a'zolari
  "sk-1": "/img/icon/sk-1.jpg", // Teri, hid va ta'm — batafsil
  "se-1": "/img/icon/se-1.jpg", // Ko'rish a'zosi — batafsil
  // Jinsiy tizim
  "rp-1": "/img/icon/rp-1.jpg", // Erkak jinsiy a'zolari — batafsil
  // Endokrin bezlar
  "en-1": "/img/icon/en-1.jpg", // Endokrin bezlar — batafsil
  // Umumiy (intro) bo'limlar
  u10: "/img/icon/u10.jpg", // Suyaklarning birlashuvi
  u11: "/img/icon/u11.jpg", // Mushaklar tizimi
  u12: "/img/icon/u12.jpg", // Hazm tizimi
  u13: "/img/icon/u13.jpg", // Nafas tizimi
  u14: "/img/icon/u14.jpg", // Siydik tizimi
  u15: "/img/icon/u15.jpg", // Jinsiy tizim
  u16: "/img/icon/u16.jpg", // Endokrin bezlar
  u17: "/img/icon/u17.jpg", // Yurak va tomirlar
  u18: "/img/icon/u18.jpg", // Nerv tizimi
};

/** Bo'lim uchun rasm-ikoncha yo'lini qaytaradi (yo'q bo'lsa undefined). */
export function unitIconImage(unitId: string): string | undefined {
  return UNIT_ICON_IMAGES[unitId];
}
