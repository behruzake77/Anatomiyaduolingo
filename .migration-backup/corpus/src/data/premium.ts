/**
 * VAQTINCHA: Premium o'chirilgan — BARCHA funksiyalar hamma uchun BEPUL.
 * Qayta yoqish uchun PREMIUM_DISABLED = false qiling (kodlar saqlanadi).
 */
export const PREMIUM_DISABLED = true;

/**
 * Premium — faollashtirish kodlari va imtiyozlar ro'yxati.
 * Server yo'q (PWA) — kodlar lokal tekshiriladi (checksum asosida).
 * Yangi kod qo'shish: CORPUS-XXXX-YYYY formatida, checksum mos bo'lishi kerak
 * (quyidagi formula bo'yicha hisoblanadi).
 */

/**
 * Kod tekshiruvi (checksum): CORPUS-XXXX-YYYY formatidagi kod,
 * XXXX+YYYY qismining belgi kodlari yig'indisi 7 ga bo'linishi kerak.
 */
export function isValidPremiumCode(code: string): boolean {
  const c = code.trim().toUpperCase();
  if (!/^CORPUS-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) return false;
  const body = c.slice(7).replace("-", "");
  let sum = 0;
  for (const ch of body) sum += ch.charCodeAt(0);
  return sum % 7 === 0;
}

/** Tekshirish uchun namuna kod (demo). */
export function demoPremiumCode(): string {
  // "PRO0-DEM2" → belgi kodlari yig'indisi 553, 7 ga bo'linadi (553/7=79).
  return "CORPUS-PRO0-DEM2";
}

export interface PremiumBenefit {
  icon: string;
  title: string;
  text: string;
}

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  { icon: "🚫", title: "Reklamasiz", text: "Butun ilova reklamasiz — toza muhit" },
  { icon: "🃏", title: "Flash-kartalar", text: "Anki uslubida tez yodlash" },
  { icon: "🧠", title: "Klinik vaziyatlar", text: "Imtihonga tayyorlov savollari" },
  { icon: "📊", title: "Chuqur tahlil", text: "Zaif mavzular va progress tahlili" },
  { icon: "✨", title: "Premium dizayn", text: "Oltin muhit va maxsus animatsiyalar" },
  { icon: "📚", title: "Offline kutubxona", text: "Barcha kitoblar internetsiz" },
];

export const PREMIUM_PLANS = [
  { id: "monthly", name: "Oylik", price: "15 000", period: "so'm/oy" },
  { id: "yearly", name: "Yillik", price: "80 000", period: "so'm/yil", best: true },
  { id: "lifetime", name: "Umrboqiy", price: "150 000", period: "bir martalik" },
];
