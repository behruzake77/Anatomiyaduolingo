/**
 * Rangli diagrammalar — har bir tana qismini rang bilan ajratib ko'rsatish.
 * Manba: Ahmedov kitobidagi raqamlangan qismlar (legend), rang faqat vizual yordam.
 * Rang tartibi legend raqamiga mos (1-qism = palitraning 1-rangi va h.k.).
 */

/** 12 xil aniq rang — legend raqami tartibida. */
export const COLOR_PALETTE = [
  "#EF4444", // 1  qizil
  "#F97316", // 2  to'q sariq
  "#F59E0B", // 3  sariq
  "#84CC16", // 4  och yashil
  "#22C55E", // 5  yashil
  "#06B6D4", // 6  havorang
  "#3B82F6", // 7  ko'k
  "#8B5CF6", // 8  binafsha
  "#D946EF", // 9  pushti-binafsha
  "#EC4899", // 10 pushti
  "#14B8A6", // 11 to'q firuza
  "#EAB308", // 12 oltingugurt
];

/** Rang nomlari (savollarda ishlatiladi) — palitra tartibida. */
export const COLOR_NAMES = [
  "qizil",
  "to'q sariq",
  "sariq",
  "och yashil",
  "yashil",
  "havorang",
  "ko'k",
  "binafsha",
  "pushti-binafsha",
  "pushti",
  "to'q firuza",
  "oltingugurt",
];

/** Rangli diagrammasi tayyor bo'lgan darslar (bosqichma-bosqich to'ldiriladi). */
export const COLOR_DIAGRAMS: Record<string, string> = {
  l4: "/img/color/l4.jpg", // Tipik bo'yin umurtqasi (C3–C7)
  l5: "/img/color/l5.jpg", // Atlas (C1)
  l6: "/img/color/l6.jpg", // Axis (C2)
  l8: "/img/color/l8.jpg", // Ko'krak umurtqasi
  l9: "/img/color/l9.jpg", // Bel umurtqasi
  l10: "/img/color/l10.jpg", // Dumg'aza — old (chanoq) yuzasi
  l11: "/img/color/l11.jpg", // Dumg'aza — orqa yuzasi
  l12: "/img/color/l12.jpg", // Dum suyagi (coccyx)
  l13: "/img/color/l13.jpg", // Qovurg'a (costa)
  l14: "/img/color/l14.jpg", // To'sh suyagi (sternum)
};

/** Legend raqami → rang (palitradan indeks bo'yicha). */
export function colorForIndex(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

/** Legend raqami (masalan "3") → rang. Son bo'lmagan raqamlar uchun null. */
export function colorForLegendN(n: string): string | null {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 1) return null;
  return colorForIndex(num - 1);
}
