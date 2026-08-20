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
  l15: "/img/color/l15.jpg", // Yelka kamari — o'mrov suyagi (clavicula)
  l16: "/img/color/l16.jpg", // Yelka suyagi (humerus)
  l17: "/img/color/l17.jpg", // Bilak suyagi (radius)
};

/**
 * Savol uchun alohida rasmlar: faqat O'SHA qism bo'yalgan + strelka bilan
 * ko'rsatilgan, qolgan qismlar xira (kulrang). Kalit: dars → qism raqami → rasm.
 */
export const COLOR_HIGHLIGHTS: Record<string, Record<string, string>> = {
  l6: {
    "1": "/img/color/l6_1.jpg", // Apex dentis
    "2": "/img/color/l6_2.jpg", // Dens
    "3": "/img/color/l6_3.jpg", // Facies articularis superior
    "4": "/img/color/l6_4.jpg", // Processus spinosus
    "5": "/img/color/l6_5.jpg", // Corpus vertebrae
  },
  l4: {
    "1": "/img/color/l4_1.jpg", // Corpus vertebrae
    "2": "/img/color/l4_2.jpg", // Processus transversus
    "3": "/img/color/l4_3.jpg", // Facies articularis superior
    "4": "/img/color/l4_4.jpg", // Arcus vertebrae
    "5": "/img/color/l4_5.jpg", // Processus spinosus
    "6": "/img/color/l4_6.jpg", // Foramen vertebrale
    "7": "/img/color/l4_7.jpg", // Processus articularis superior
    "8": "/img/color/l4_8.jpg", // Tuberculum posterius
    "9": "/img/color/l4_9.jpg", // Sulcus nervi spinalis
    "10": "/img/color/l4_10.jpg", // Tuberculum anterius
    "11": "/img/color/l4_11.jpg", // Foramen transversarium
  },
  l5: {
    "1": "/img/color/l5_1.jpg", // Tuberculum anterius
    "2": "/img/color/l5_2.jpg", // Arcus anterior atlantis
    "3": "/img/color/l5_3.jpg", // Facies articularis superior
    "4": "/img/color/l5_4.jpg", // Processus transversus
    "5": "/img/color/l5_5.jpg", // Foramen transversarium
    "6": "/img/color/l5_6.jpg", // Tuberculum posterius
    "7": "/img/color/l5_7.jpg", // Arcus posterior atlantis
    "8": "/img/color/l5_8.jpg", // Massa lateralis atlantis
    "9": "/img/color/l5_9.jpg", // Fovea dentis
  },
  l8: {
    "1": "/img/color/l8_1.jpg", // Fovea costalis superior
    "2": "/img/color/l8_2.jpg", // Processus articularis superior
    "3": "/img/color/l8_3.jpg", // Fovea costalis processus transversi
    "4": "/img/color/l8_4.jpg", // Processus transversus
    "5": "/img/color/l8_5.jpg", // Processus articularis inferior
    "6": "/img/color/l8_6.jpg", // Processus spinosus
    "7": "/img/color/l8_7.jpg", // Facies articularis inferior
    "8": "/img/color/l8_8.jpg", // Incisura vertebralis inferior
    "9": "/img/color/l8_9.jpg", // Fovea costalis inferior
    "10": "/img/color/l8_10.jpg", // Corpus vertebrae
  },
  l9: {
    "1": "/img/color/l9_1.jpg", // Corpus vertebrae
    "2": "/img/color/l9_2.jpg", // Incisura vertebralis superior
    "3": "/img/color/l9_3.jpg", // Processus costalis
    "4": "/img/color/l9_4.jpg", // Processus articularis superior
    "5": "/img/color/l9_5.jpg", // Processus spinosus
    "6": "/img/color/l9_6.jpg", // Arcus vertebrae
    "7": "/img/color/l9_7.jpg", // Facies articularis superior
    "8": "/img/color/l9_8.jpg", // Processus mamillaris
    "9": "/img/color/l9_9.jpg", // Processus accessorius
    "10": "/img/color/l9_10.jpg", // Foramen vertebrale
  },
  l10: {
    "1": "/img/color/l10_1.jpg", // Basis ossis sacri
    "2": "/img/color/l10_2.jpg", // Processus articulares superiores
    "3": "/img/color/l10_3.jpg", // Pars lateralis
    "4": "/img/color/l10_4.jpg", // Foramina sacralia anteriora
    "5": "/img/color/l10_5.jpg", // Apex ossis sacri
    "6": "/img/color/l10_6.jpg", // Os coccygis
    "7": "/img/color/l10_7.jpg", // Lineae transversae
  },
  l11: {
    "1": "/img/color/l11_1.jpg", // Processus articulares superiores
    "2": "/img/color/l11_2.jpg", // Canalis sacralis
    "3": "/img/color/l11_3.jpg", // Tuberositas ossis sacri
    "4": "/img/color/l11_4.jpg", // Crista sacralis medialis
    "5": "/img/color/l11_5.jpg", // Crista sacralis mediana
    "6": "/img/color/l11_6.jpg", // Hiatus sacralis
    "7": "/img/color/l11_7.jpg", // Cornu sacrale
    "8": "/img/color/l11_8.jpg", // Cornu coccygeum
    "9": "/img/color/l11_9.jpg", // Os coccygis
    "10": "/img/color/l11_10.jpg", // Foramina sacralia posteriora
    "11": "/img/color/l11_11.jpg", // Crista sacralis lateralis
    "12": "/img/color/l11_12.jpg", // Facies auricularis
  },
  l12: {
    "1": "/img/color/l12_1.jpg", // Basis ossis sacri
    "2": "/img/color/l12_2.jpg", // Processus articulares superiores
    "3": "/img/color/l12_3.jpg", // Pars lateralis
    "4": "/img/color/l12_4.jpg", // Foramina sacralia anteriora
    "5": "/img/color/l12_5.jpg", // Apex ossis sacri
    "6": "/img/color/l12_6.jpg", // Os coccygis
    "7": "/img/color/l12_7.jpg", // Lineae transversae
  },
  l13: {
    "1": "/img/color/l13_1.jpg", // Angulus costae
    "2": "/img/color/l13_2.jpg", // Tuberculum costae
    "3": "/img/color/l13_3.jpg", // Collum costae
    "4": "/img/color/l13_4.jpg", // Caput costae
    "5": "/img/color/l13_5.jpg", // Facies articularis capitis costae
    "6": "/img/color/l13_6.jpg", // Crista capitis costae
    "7": "/img/color/l13_7.jpg", // Facies articularis tuberculi costae
    "8": "/img/color/l13_8.jpg", // Corpus costae
    "9": "/img/color/l13_9.jpg", // Sulcus costae
  },
  l14: {
    "1": "/img/color/l14_1.jpg", // Incisura clavicularis
    "2": "/img/color/l14_2.jpg", // Incisura jugularis
    "3": "/img/color/l14_3.jpg", // Incisura costalis I
    "4": "/img/color/l14_4.jpg", // Incisura costalis II
    "5": "/img/color/l14_5.jpg", // Incisura costalis III
    "6": "/img/color/l14_6.jpg", // Incisura costalis IV
    "7": "/img/color/l14_7.jpg", // Incisura costalis V
    "8": "/img/color/l14_8.jpg", // Incisura costalis VI
    "9": "/img/color/l14_9.jpg", // Incisura costalis VII
    "10": "/img/color/l14_10.jpg", // Processus xiphoideus
    "11": "/img/color/l14_11.jpg", // Corpus sterni
    "12": "/img/color/l14_12.jpg", // Manubrium sterni
  },
  l15: {
    "1": "/img/color/l15_1.jpg", // Facies articularis acromialis
    "2": "/img/color/l15_2.jpg", // Facies articularis sternalis
    "3": "/img/color/l15_3.jpg", // Extremitas sternalis
    "4": "/img/color/l15_4.jpg", // Impressio ligamenti costoclavicularis
    "5": "/img/color/l15_5.jpg", // Corpus claviculae
    "6": "/img/color/l15_6.jpg", // Sulcus musculi subclavii
    "7": "/img/color/l15_7.jpg", // Tuberculum conoideum
    "8": "/img/color/l15_8.jpg", // Linea trapezoidea
    "9": "/img/color/l15_9.jpg", // Extremitas acromialis
  },
  l16: {
    "1": "/img/color/l16_1.jpg", // Collum anatomicum
    "2": "/img/color/l16_2.jpg", // Caput humeri
    "3": "/img/color/l16_3.jpg", // Tuberculum minus
    "4": "/img/color/l16_4.jpg", // Collum chirurgicum
    "5": "/img/color/l16_5.jpg", // Crista tuberculi minoris
    "6": "/img/color/l16_6.jpg", // Corpus humeri
    "7": "/img/color/l16_7.jpg", // Facies anteromedialis
    "8": "/img/color/l16_8.jpg", // Margo medialis
    "9": "/img/color/l16_9.jpg", // Fossa coronoidea
    "10": "/img/color/l16_10.jpg", // Epicondylus medialis
    "11": "/img/color/l16_11.jpg", // Trochlea humeri
    "12": "/img/color/l16_12.jpg", // Capitulum humeri
    "13": "/img/color/l16_13.jpg", // Epicondylus lateralis
    "14": "/img/color/l16_14.jpg", // Fossa radialis
    "15": "/img/color/l16_15.jpg", // Margo lateralis
    "16": "/img/color/l16_16.jpg", // Facies anterolateralis
    "17": "/img/color/l16_17.jpg", // Crista tuberculi majoris
    "18": "/img/color/l16_18.jpg", // Sulcus intertubercularis
    "19": "/img/color/l16_19.jpg", // Tuberculum majus
  },
  l17: {
    "1": "/img/color/l17_1.jpg", // Caput radii
    "2": "/img/color/l17_2.jpg", // Collum radii
  },
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
