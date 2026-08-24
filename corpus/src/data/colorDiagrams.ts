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
  l1: "/img/color/l1.jpg", // Umurtqa pog'onasi bo'limlari
  l2: "/img/color/l2.jpg", // Umurtqa, ust tomondan
  l3: "/img/color/l2.jpg", // O'simtalar (l2 bilan bir xil rasm)
  l4: "/img/color/l4.jpg", // Tipik bo'yin umurtqasi (C3–C7)
  l5: "/img/color/l5.jpg", // Atlas (C1)
  l6: "/img/color/l6.jpg", // Axis (C2)
  l7: "/img/color/l4.jpg", // C3–C7 umurtqalar (l4 bilan bir xil rasm)
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
  l18: "/img/color/l18.jpg", // Chanoq suyagi (os coxae)
  l19: "/img/color/l19.jpg", // Son suyagi (femur)
  l20: "/img/color/l20.jpg", // Oyoq panjasi suyaklari
  l21: "/img/color/l21.jpg", // Kalla suyaklari (old tomondan)
  l22: "/img/color/l22.jpg", // Ensa suyagi (os occipitale)
  l23: "/img/color/l23.jpg", // Chakka suyagi (os temporale)
  l24: "/img/color/l24.jpg", // Ustki jag' suyagi (maxilla)
  l25: "/img/color/l25.jpg", // Pastki jag' suyagi (mandibula) — ichki tomondan
  l26: "/img/color/l26.jpg", // Bo'g'im tuzilishi (kesma)
  l27: "/img/color/l27.jpg", // Yelka bo'g'imi
  l28: "/img/color/l28.jpg", // Mushak turlari (A duksimon, B yassi)
  l29: "/img/color/l29.jpg", // Tana mushaklari, old tomondan
  l30: "/img/color/l30.jpg", // Yelka kamari va yelka mushaklari
  l47: "/img/color/l47.jpg", // Chok turlari
  l48: "/img/color/l48.jpg", // Tirsak bo'g'imi
  l49: "/img/color/l49.jpg", // Tizza bo'g'imi
  l50: "/img/color/l50.jpg", // Oyoq panjasi bo'g'imlari
  l31: "/img/color/l31.jpg", // Hazm tizimi (umumiy)
  l32: "/img/color/l32.jpg", // Oshqozon
  l33: "/img/color/l33.jpg", // Qorin bo'shlig'i a'zolari
  l65: "/img/color/l65.jpg", // Tish tuzilishi
  l66: "/img/color/l66.jpg", // Qizilo'ngach devori
  l67: "/img/color/l67.jpg", // Oshqozon osti bezi
  l34: "/img/color/l34.jpg", // Burun bo'shlig'i to'sig'i
  l35: "/img/color/l35.jpg", // Kekirdak va bronxlar
  l68: "/img/color/l68.jpg", // Hiqildoq tog'aylari
  l69: "/img/color/l69.jpg", // O'pka va plevra
  l36: "/img/color/l36.jpg", // Buyrak
  l37: "/img/color/l37.jpg", // Siydik yo'llari
  l70: "/img/color/l70.jpg", // Nefron
  l71: "/img/color/l71.jpg", // Siydik chiqarish nayining prostata qismi
  l72: "/img/color/l72.jpg", // O'ng moyak va moyak ortig'i
  l73: "/img/color/l73.jpg", // Ayollarning jinsiy a'zolari
  l74: "/img/color/l74.jpg", // Qalqonsimon bez
  l75: "/img/color/l75.jpg", // Buyrak usti bezlari
  l76: "/img/color/l76.jpg", // Bo'yin mushaklari
  l77: "/img/color/l77.jpg", // Boshning mimika mushaklari
  l78: "/img/color/l78.jpg", // Bosh va bo'yin arteriyalari
  l79: "/img/color/l79.jpg", // Yuqori kavak vena
  l40: "/img/color/l40.jpg", // Katta va kichik qon aylanish doirasi
  l41: "/img/color/l41.jpg", // Arteriya devorining tuzilishi
  l42: "/img/color/l42.jpg", // Limfa tuguni shakllari
  l43: "/img/color/l43.jpg", // Bosh miya asosi va nervlari
  l44: "/img/color/l44.jpg", // Orqa miya nervlari
  l57: "/img/color/l57.jpg", // Orqa miyaning ko'ndalang kesimi
  l58: "/img/color/l58.jpg", // Uzunchoq miyaning ko'ndalang kesmasi
  l59: "/img/color/l59.jpg", // Miyacha o'zaklari
  l60: "/img/color/l60.jpg", // Bosh miya yarim pallasi
  l45: "/img/color/l45.jpg", // Ko'z olmasi kesimi
  l46: "/img/color/l46.jpg", // Ta'm sezish — til so'rg'ichlari
  l51: "/img/color/l51.jpg", // Orqaning yuza mushaklari
  l52: "/img/color/l52.jpg", // Qorin mushaklari, old tomondan
  l53: "/img/color/l53.jpg", // Bilakning oldingi guruh mushaklari
  l54: "/img/color/l54.jpg", // Chap son mushaklari
  l56: "/img/color/l56.jpg", // Vena devorining tuzilishi
  l62: "/img/color/l62.jpg", // Simpatik poyaning qismlari
  l63: "/img/color/l63.jpg", // Ko'z gavhari va ushlab turuvchi hosilalar
  l64: "/img/color/l64.jpg", // Dahliz-chig'anoq a'zosi
  l80: "/img/color/l80.jpg", // Bo'yin chigali
  l81: "/img/color/l81.jpg", // Bel va dumg'aza chigallari
};

/**
 * Savol uchun alohida rasmlar: faqat O'SHA qism bo'yalgan + strelka bilan
 * ko'rsatilgan, qolgan qismlar xira (kulrang). Kalit: dars → qism raqami → rasm.
 */
export const COLOR_HIGHLIGHTS: Record<string, Record<string, string>> = {
  l1: {
    "1": "/img/color/l1_1.jpg", // Bo'yin qismi (Pars cervicalis)
    "2": "/img/color/l1_2.jpg", // Ko'krak qismi (Pars thoracica)
    "3": "/img/color/l1_3.jpg", // Bel qismi (Pars lumbalis)
    "4": "/img/color/l1_4.jpg", // Dumg'aza qismi (Os sacrum)
    "5": "/img/color/l1_5.jpg", // Dum qismi (Os coccygis)
  },
  l2: {
    "1": "/img/color/l2_1.jpg", // Corpus vertebrae
    "2": "/img/color/l2_2.jpg", // Fovea costalis superior
    "3": "/img/color/l2_3.jpg", // Pedunculus arcus vertebrae
    "4": "/img/color/l2_4.jpg", // Facies articularis superior
    "5": "/img/color/l2_5.jpg", // Fovea costalis processus transversi
    "6": "/img/color/l2_6.jpg", // Processus transversus
    "7": "/img/color/l2_7.jpg", // Arcus vertebrae
    "8": "/img/color/l2_8.jpg", // Processus spinosus
    "9": "/img/color/l2_9.jpg", // Foramen vertebrale
    "10": "/img/color/l2_10.jpg", // Processus articularis superior
    "11": "/img/color/l2_11.jpg", // Pedunculus arcus vertebrae
  },
  l3: {
    "1": "/img/color/l2_1.jpg", // Corpus vertebrae
    "2": "/img/color/l2_2.jpg", // Fovea costalis superior
    "3": "/img/color/l2_3.jpg", // Pedunculus arcus vertebrae
    "4": "/img/color/l2_4.jpg", // Facies articularis superior
    "5": "/img/color/l2_5.jpg", // Fovea costalis processus transversi
    "6": "/img/color/l2_6.jpg", // Processus transversus
    "7": "/img/color/l2_7.jpg", // Arcus vertebrae
    "8": "/img/color/l2_8.jpg", // Processus spinosus
    "9": "/img/color/l2_9.jpg", // Foramen vertebrale
    "10": "/img/color/l2_10.jpg", // Processus articularis superior
    "11": "/img/color/l2_11.jpg", // Pedunculus arcus vertebrae
  },
  l7: {
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
    "3": "/img/color/l17_3.jpg", // Tuberositas radii
    "4": "/img/color/l17_4.jpg", // Margo interossea
    "5": "/img/color/l17_5.jpg", // Processus styloideus
    "6": "/img/color/l17_6.jpg", // Margo anterior
    "7": "/img/color/l17_7.jpg", // Facies anterior
    "8": "/img/color/l17_8.jpg", // Foramen nutricium
    "9": "/img/color/l17_9.jpg", // Circumferentia articularis
  },
  l18: {
    "1": "/img/color/l18_1.jpg", // Facies glutea
    "2": "/img/color/l18_2.jpg", // Spina iliaca anterior superior
    "3": "/img/color/l18_3.jpg", // Linea glutea inferior
    "4": "/img/color/l18_4.jpg", // Spina iliaca anterior inferior
    "5": "/img/color/l18_5.jpg", // Corpus ossis ilii
    "6": "/img/color/l18_6.jpg", // Facies lunata
    "7": "/img/color/l18_7.jpg", // Fossa acetabuli
    "8": "/img/color/l18_8.jpg", // Corpus ossis pubis
    "9": "/img/color/l18_9.jpg", // Ramus superior ossis pubis
    "10": "/img/color/l18_10.jpg", // Tuberculum pubicum
    "11": "/img/color/l18_11.jpg", // Os pubis
    "12": "/img/color/l18_12.jpg", // Ramus inferior ossis pubis
    "13": "/img/color/l18_13.jpg", // Ramus ossis ischii
    "14": "/img/color/l18_14.jpg", // Os ischii
    "15": "/img/color/l18_15.jpg", // Tuber ischiadicum
    "16": "/img/color/l18_16.jpg", // Foramen obturatum
    "17": "/img/color/l18_17.jpg", // Incisura acetabuli
    "18": "/img/color/l18_18.jpg", // Corpus ossis ischii
    "19": "/img/color/l18_19.jpg", // Incisura ischiadica minor
    "20": "/img/color/l18_20.jpg", // Spina ischiadica
    "21": "/img/color/l18_21.jpg", // Incisura ischiadica major
    "22": "/img/color/l18_22.jpg", // Spina iliaca posterior inferior
    "23": "/img/color/l18_23.jpg", // Spina iliaca posterior superior
    "24": "/img/color/l18_24.jpg", // Linea glutea posterior
    "25": "/img/color/l18_25.jpg", // Linea intermedia cristae iliacae
    "26": "/img/color/l18_26.jpg", // Linea glutea anterior
    "27": "/img/color/l18_27.jpg", // Labium externum cristae iliacae
    "28": "/img/color/l18_28.jpg", // Ala ossis ilii
    "29": "/img/color/l18_29.jpg", // Crista iliaca
  },
  l19: {
    "1": "/img/color/l19_1.jpg", // Caput femoris
    "2": "/img/color/l19_2.jpg", // Fovea capitis femoris
    "3": "/img/color/l19_3.jpg", // Collum femoris
    "4": "/img/color/l19_4.jpg", // Trochanter minor
    "5": "/img/color/l19_5.jpg", // Trochanter major
    "6": "/img/color/l19_6.jpg", // Crista intertrochanterica
    "7": "/img/color/l19_7.jpg", // Tuberositas glutea
    "8": "/img/color/l19_8.jpg", // Linea pectinea
    "9": "/img/color/l19_9.jpg", // Corpus femoris
    "10": "/img/color/l19_10.jpg", // Linea aspera
    "11": "/img/color/l19_11.jpg", // Labium laterale lineae asperae
    "12": "/img/color/l19_12.jpg", // Labium mediale lineae asperae
    "13": "/img/color/l19_13.jpg", // Facies poplitea
    "14": "/img/color/l19_14.jpg", // Linea intercondylaris
    "15": "/img/color/l19_15.jpg", // Condylus lateralis
    "16": "/img/color/l19_16.jpg", // Fossa intercondylaris
    "17": "/img/color/l19_17.jpg", // Condylus medialis
    "18": "/img/color/l19_18.jpg", // Epicondylus medialis
    "19": "/img/color/l19_19.jpg", // Facies patellaris
    "20": "/img/color/l19_20.jpg", // Epicondylus lateralis
    "21": "/img/color/l19_21.jpg", // Facies anterior
    "22": "/img/color/l19_22.jpg", // Trochanter major
    "23": "/img/color/l19_23.jpg", // Linea intertrochanterica
  },
  l20: {
    "1": "/img/color/l20_1.jpg", // Calcaneus
    "2": "/img/color/l20_2.jpg", // Talus
    "3": "/img/color/l20_3.jpg", // Trochlea tali
    "4": "/img/color/l20_4.jpg", // Os naviculare
    "5": "/img/color/l20_5.jpg", // Os cuneiforme intermedium
    "6": "/img/color/l20_6.jpg", // Os cuneiforme mediale
    "7": "/img/color/l20_7.jpg", // Basis ossis metatarsi I
    "8": "/img/color/l20_8.jpg", // Os metatarsi I
    "9": "/img/color/l20_9.jpg", // Corpus ossis metatarsi
    "10": "/img/color/l20_10.jpg", // Caput ossis metatarsi
    "11": "/img/color/l20_11.jpg", // Phalanx proximalis
    "12": "/img/color/l20_12.jpg", // Phalanx distalis
    "13": "/img/color/l20_13.jpg", // Tuberositas phalangis distalis
    "14": "/img/color/l20_12.jpg", // Phalanx distalis (takror)
    "15": "/img/color/l20_14.jpg", // Phalanx media
    "16": "/img/color/l20_11.jpg", // Phalanx proximalis (takror)
    "17": "/img/color/l20_15.jpg", // Caput phalangis
    "18": "/img/color/l20_16.jpg", // Corpus phalangis
    "19": "/img/color/l20_17.jpg", // Basis phalangis
    "20": "/img/color/l20_18.jpg", // Ossa metatarsi
    "21": "/img/color/l20_19.jpg", // Tuberositas ossis metatarsi V
    "22": "/img/color/l20_20.jpg", // Os cuboideum
    "23": "/img/color/l20_21.jpg", // Os cuneiforme laterale
  },
  l21: {
    "1": "/img/color/l21_1.jpg", // Squama frontalis
    "2": "/img/color/l21_2.jpg", // Os nasale
    "3": "/img/color/l21_3.jpg", // Foramen supraorbitale
    "4": "/img/color/l21_4.jpg", // Os parietale
    "5": "/img/color/l21_5.jpg", // Canalis opticus
    "6": "/img/color/l21_6.jpg", // Facies temporalis alae majoris ossis sphenoidalis
    "7": "/img/color/l21_7.jpg", // Facies orbitalis alae majoris ossis sphenoidalis
    "8": "/img/color/l21_8.jpg", // Pars squamosa ossis temporalis
    "10": "/img/color/l21_9.jpg", // Fissura orbitalis inferior
    "11": "/img/color/l21_10.jpg", // Foramen zygomaticofaciale
    "12": "/img/color/l21_11.jpg", // Os zygomaticum
    "14": "/img/color/l21_12.jpg", // Concha nasalis inferior
    "15": "/img/color/l21_13.jpg", // Maxilla
    "16": "/img/color/l21_14.jpg", // Spina nasalis anterior
    "17": "/img/color/l21_17.jpg", // Ramus mandibulae
    "18": "/img/color/l21_18.jpg", // Tuberositas masseterica
    "19": "/img/color/l21_19.jpg", // Angulus mandibulae
    "20": "/img/color/l21_20.jpg", // Juga alveolaria
    "21": "/img/color/l21_21.jpg", // Foramen mentale
    "22": "/img/color/l21_22.jpg", // Tuberculum mentale
    "23": "/img/color/l21_23.jpg", // Corpus mandibulae
    "24": "/img/color/l21_24.jpg", // Vomer
    "25": "/img/color/l21_25.jpg", // Lamina perpendicularis ossis ethmoidalis
    "26": "/img/color/l21_26.jpg", // Margo infraorbitalis
    "27": "/img/color/l21_27.jpg", // Concha nasalis media
    "28": "/img/color/l21_28.jpg", // Os lacrimale
    "29": "/img/color/l21_29.jpg", // Fissura orbitalis superior
    "30": "/img/color/l21_30.jpg", // Margo supraorbitalis
    "31": "/img/color/l21_31.jpg", // Incisura supraorbitalis
  },
  l22: {
    "1": "/img/color/l22_1.jpg", // Crista occipitalis externa
    "2": "/img/color/l22_2.jpg", // Protuberantia occipitalis externa
    "3": "/img/color/l22_3.jpg", // Linea nuchae superior
    "4": "/img/color/l22_4.jpg", // Linea nuchae inferior
    "5": "/img/color/l22_5.jpg", // Foramen magnum
    "6": "/img/color/l22_6.jpg", // Condylus occipitalis
    "7": "/img/color/l22_7.jpg", // Pars basilaris
    "8": "/img/color/l22_8.jpg", // Tuberculum pharyngeum
    "9": "/img/color/l22_9.jpg", // Incisura jugularis
    "10": "/img/color/l22_10.jpg", // Canalis condylaris
  },
  l23: {
    "1": "/img/color/l23_1.jpg", // Margo parietalis
    "2": "/img/color/l23_2.jpg", // Pars squamosa
    "3": "/img/color/l23_3.jpg", // Margo sphenoidalis
    "4": "/img/color/l23_4.jpg", // Processus zygomaticus
    "5": "/img/color/l23_5.jpg", // Tuberculum articulare
    "6": "/img/color/l23_6.jpg", // Fossa mandibularis
    "7": "/img/color/l23_7.jpg", // Fissura petrosquamosa
    "8": "/img/color/l23_8.jpg", // Fissura petrotympanica
    "9": "/img/color/l23_9.jpg", // Pars tympanica
    "10": "/img/color/l23_10.jpg", // Processus styloideus
    "11": "/img/color/l23_11.jpg", // Meatus acusticus externus
    "12": "/img/color/l23_12.jpg", // Processus mastoideus
    "13": "/img/color/l23_13.jpg", // Fissura tympanomastoidea
    "14": "/img/color/l23_14.jpg", // Incisura mastoidea
    "15": "/img/color/l23_15.jpg", // Foramen mastoideum
    "16": "/img/color/l23_16.jpg", // Spina suprameatum
    "17": "/img/color/l23_17.jpg", // Incisura parietalis
    "18": "/img/color/l23_18.jpg", // Sulcus arteriae temporalis mediae
  },
  l24: {
    "1": "/img/color/l24_1.jpg", // Processus frontalis
    "2": "/img/color/l24_2.jpg", // Margo infraorbitalis
    "3": "/img/color/l24_3.jpg", // Incisura nasalis
    "4": "/img/color/l24_4.jpg", // Canalis infraorbitalis
    "5": "/img/color/l24_5.jpg", // Fossa canina
    "6": "/img/color/l24_6.jpg", // Spina nasalis anterior
    "7": "/img/color/l24_7.jpg", // Juga alveolaria
    "8": "/img/color/l24_8.jpg", // Arcus alveolaris
    "9": "/img/color/l24_9.jpg", // Foramina alveolaria
    "10": "/img/color/l24_10.jpg", // Tuber maxillae
    "11": "/img/color/l24_11.jpg", // Processus zygomaticus
    "12": "/img/color/l24_12.jpg", // Sulcus infraorbitalis
    "13": "/img/color/l24_13.jpg", // Facies orbitalis
    "14": "/img/color/l24_14.jpg", // Sulcus lacrimalis
    "15": "/img/color/l24_15.jpg", // Crista lacrimalis anterior
  },
  l25: {
    "1": "/img/color/l25_1.jpg", // Processus coronoideus
    "2": "/img/color/l25_2.jpg", // Incisura mandibulae
    "3": "/img/color/l25_3.jpg", // Caput mandibulae
    "4": "/img/color/l25_4.jpg", // Processus condylaris
    "5": "/img/color/l25_5.jpg", // Foramen mandibulae
    "6": "/img/color/l25_6.jpg", // Sulcus mylohyoideus
    "7": "/img/color/l25_7.jpg", // Angulus mandibulae
    "8": "/img/color/l25_8.jpg", // Tuberositas pterygoidea
    "9": "/img/color/l25_9.jpg", // Fovea submandibularis
    "10": "/img/color/l25_10.jpg", // Fossa digastrica
    "11": "/img/color/l25_11.jpg", // Spina mentalis
    "12": "/img/color/l25_12.jpg", // Tuberositas masseterica
    "13": "/img/color/l25_13.jpg", // Ramus mandibulae
    "14": "/img/color/l25_14.jpg", // Fossa sublingualis
  },
  l26: {
    "1": "/img/color/l26_1.jpg", // Membrana synovialis
    "2": "/img/color/l26_2.jpg", // Fissura articularis
    "3": "/img/color/l26_3.jpg", // Cavum articulare
    "4": "/img/color/l26_4.jpg", // Os
    "5": "/img/color/l26_5.jpg", // Cartilago articularis
    "6": "/img/color/l26_6.jpg", // Periosteum
  },
  l27: {
    "1": "/img/color/l27_1.jpg", // Labrum glenoidale
    "2": "/img/color/l27_2.jpg", // Processus coracoideus
    "3": "/img/color/l27_3.jpg", // Cavitas glenoidalis
    "4": "/img/color/l27_4.jpg", // Lig. transversum humeri
    "5": "/img/color/l27_5.jpg", // Collum anatomicum
    "6": "/img/color/l27_6.jpg", // Caput humeri
    "7": "/img/color/l27_7.jpg", // Ikki boshli mushakning uzun boshchasi payi
  },
  l28: {
    "A1": "/img/color/l28_A1.jpg", // Caput — mushak boshi
    "A2": "/img/color/l28_A2.jpg", // Venter — mushak qorni
    "A3": "/img/color/l28_A3.jpg", // Cauda — mushak dumi
    "B1": "/img/color/l28_B1.jpg", // Aponeurosis
  },
  l29: {
    "1": "/img/color/l29_1.jpg", // Venter anterior m. digastrici
    "2": "/img/color/l29_2.jpg", // M. platysma
    "3": "/img/color/l29_3.jpg", // M. deltoideus
    "4": "/img/color/l29_4.jpg", // M. pectoralis major
    "5": "/img/color/l29_5.jpg", // Lamina superficialis fasciae pectoralis
    "7": "/img/color/l29_7.jpg", // Aponeurosis m. obliqui externi
    "12": "/img/color/l29_12.jpg", // Lig. inguinale
    "13": "/img/color/l29_13.jpg", // Linea alba
    "14": "/img/color/l29_14.jpg", // M. obliquus externus abdominis
    "15": "/img/color/l29_15.jpg", // Pars abdominalis m. pectoralis majoris
    "16": "/img/color/l29_16.jpg", // M. serratus anterior
    "17": "/img/color/l29_17.jpg", // M. latissimus dorsi
    "18": "/img/color/l29_18.jpg", // Fossa axillaris
    "19": "/img/color/l29_19.jpg", // M. biceps brachii
    "20": "/img/color/l29_20.jpg", // Aponeurosis m. bicipitis
    "21": "/img/color/l29_21.jpg", // Ulna
    "22": "/img/color/l29_22.jpg", // Radius
    "23": "/img/color/l29_23.jpg", // M. brachioradialis
    "24": "/img/color/l29_24.jpg", // Pars sternocostalis m. pectoralis majoris
    "25": "/img/color/l29_25.jpg", // Clavicula
    "6": "/img/color/l29_6.jpg", // Fascia brachii
    "8": "/img/color/l29_8.jpg", // Fascia lata
    "9": "/img/color/l29_9.jpg", // Funiculus spermaticus
    "10": "/img/color/l29_10.jpg", // V. saphena magna
    "11": "/img/color/l29_11.jpg", // Hiatus saphenus
    "26": "/img/color/l29_3.jpg", // M. deltoideus (takror)
  },
  l30: {
    "1": "/img/color/l30_1.jpg", // M. supraspinatus
    "2": "/img/color/l30_2.jpg", // Incisura scapulae
    "3": "/img/color/l30_3.jpg", // Deltasimon mushak payi
    "4": "/img/color/l30_4.jpg", // M. teres minor
    "5": "/img/color/l30_5.jpg", // Collum chirurgicum
    "6": "/img/color/l30_6.jpg", // Do'mboqchalararo egatning medial chekkasi
    "7": "/img/color/l30_7.jpg", // Foramen quadrilaterum
    "8": "/img/color/l30_8.jpg", // Uchburchaksimon oraliq
    "9": "/img/color/l30_9.jpg", // M. triceps brachii — lateral boshchasi
    "10": "/img/color/l30_10.jpg", // Olecranon
    "11": "/img/color/l30_11.jpg", // Caput longum m. tricipitis
    "12": "/img/color/l30_12.jpg", // M. teres major
    "13": "/img/color/l30_13.jpg", // Foramen trilaterum
    "14": "/img/color/l30_14.jpg", // M. infraspinatus
    "15": "/img/color/l30_15.jpg", // Trapetsiyasimon mushak payi
  },
  l47: {
    "a": "/img/color/l47_a.jpg", // Sutura plana
    "b": "/img/color/l47_b.jpg", // Sutura squamosa
    "c": "/img/color/l47_c.jpg", // Sutura serrata
  },
  l46: {
    "1": "/img/color/l46_1.jpg", // Til (lingua)
    "2": "/img/color/l46_2.jpg", // Ta'm so'rg'ichlari
    "3": "/img/color/l46_3.jpg", // Ta'm kurtaklari
    "4": "/img/color/l46_4.jpg", // Ta'm sezish nerv tolalari
  },
  l48: {
    "1": "/img/color/l48_1.jpg", // Capsula articularis
    "2": "/img/color/l48_2.jpg", // Epicondylus medialis
    "3": "/img/color/l48_3.jpg", // Lig. collaterale ulnare
    "4": "/img/color/l48_4.jpg", // Tuberositas ulnae
    "5": "/img/color/l48_5.jpg", // Tuberositas radii
    "6": "/img/color/l48_6.jpg", // Circumferentia articularis
    "7": "/img/color/l48_7.jpg", // Lig. anulare radii
    "8": "/img/color/l48_8.jpg", // Lig. collaterale radiale
    "9": "/img/color/l48_9.jpg", // Epicondylus lateralis
    "10": "/img/color/l48_10.jpg", // Humerus
  },
  l49: {
    "1": "/img/color/l49_1.jpg", // Facies patellaris
    "2": "/img/color/l49_2.jpg", // Condylus medialis
    "3": "/img/color/l49_3.jpg", // Lig. cruciatum posterius
    "4": "/img/color/l49_4.jpg", // Lig. meniscofemorale anterius
    "5": "/img/color/l49_5.jpg", // Meniscus medialis
    "6": "/img/color/l49_6.jpg", // Lig. collaterale tibiale
    "7": "/img/color/l49_7.jpg", // Lig. patellae
    "8": "/img/color/l49_8.jpg", // Facies articularis patellae
    "9": "/img/color/l49_9.jpg", // Membrana interossea cruris
    "10": "/img/color/l49_10.jpg", // Caput fibulae
    "11": "/img/color/l49_11.jpg", // Lig. capitis fibulae
    "12": "/img/color/l49_12.jpg", // Meniscus lateralis
    "13": "/img/color/l49_13.jpg", // Tendo m. bicipitis femoris
    "14": "/img/color/l49_14.jpg", // Lig. collaterale fibulare
    "15": "/img/color/l49_15.jpg", // Condylus lateralis
    "16": "/img/color/l49_16.jpg", // Lig. transversum genus
    "17": "/img/color/l49_17.jpg", // Lig. cruciatum anterius
  },
  l50: {
    "1": "/img/color/l50_1.jpg", // Tibia
    "2": "/img/color/l50_2.jpg", // Articulatio talocruralis
    "3": "/img/color/l50_3.jpg", // Lig. mediale
    "4": "/img/color/l50_4.jpg", // Lig. talonaviculare
  },
  l51: {
    "1": "/img/color/l51_1.jpg", // Lig. nuchae
    "2": "/img/color/l51_2.jpg", // M. levator scapulae
    "3": "/img/color/l51_3.jpg", // M. rhomboideus minor
    "4": "/img/color/l51_4.jpg", // M. supraspinatus
    "5": "/img/color/l51_5.jpg", // M. infraspinatus
    "6": "/img/color/l51_6.jpg", // M. teres minor
    "7": "/img/color/l51_7.jpg", // M. rhomboideus major
    "8": "/img/color/l51_8.jpg", // M. teres major
    "9": "/img/color/l51_9.jpg", // M. serratus anterior
    "10": "/img/color/l51_10.jpg", // M. latissimus dorsi
    "11": "/img/color/l51_11.jpg", // M. deltoideus
    "12": "/img/color/l51_12.jpg", // M. trapezius
  },

  l52: {
    "1": "/img/color/l52_1.jpg", // M. pectoralis major
    "2": "/img/color/l52_2.jpg", // Lamina anterior vaginae m. recti
    "3": "/img/color/l52_3.jpg", // Linea alba
    "4": "/img/color/l52_4.jpg", // M. obliquus externus abdominis
    "5": "/img/color/l52_5.jpg", // M. rectus abdominis
    "6": "/img/color/l52_6.jpg", // M. obliquus internus abdominis
    "7": "/img/color/l52_7.jpg", // Intersectiones tendineae
    "8": "/img/color/l52_8.jpg", // M. pyramidalis
    "9": "/img/color/l52_9.jpg", // Falx inguinalis
    "10": "/img/color/l52_10.jpg", // Lig. inguinale
    "11": "/img/color/l52_11.jpg", // Lig. pectineum
    "12": "/img/color/l52_12.jpg", // Lig. lacunare
    "13": "/img/color/l52_8.jpg", // M. pyramidalis (takror)
    "14": "/img/color/l52_14.jpg", // Lig. suspensorium penis
    "15": "/img/color/l52_15.jpg", // Fascia cremasterica
    "16": "/img/color/l52_16.jpg", // Tunica dartos
    "17": "/img/color/l52_17.jpg", // Scrotum
    "18": "/img/color/l52_18.jpg", // Fascia spermatica externa
    "19": "/img/color/l52_19.jpg", // M. cremaster
    "20": "/img/color/l52_20.jpg", // Fascia lata
    "21": "/img/color/l52_21.jpg", // V. saphena magna
    "22": "/img/color/l52_22.jpg", // Hiatus saphenus
    "23": "/img/color/l52_23.jpg", // V. femoralis
    "24": "/img/color/l52_24.jpg", // Lig. reflexum
    "25": "/img/color/l52_9.jpg", // Falx inguinalis (takror)
    "26": "/img/color/l52_10.jpg", // Lig. inguinale (takror)
    "27": "/img/color/l52_27.jpg", // Spina iliaca anterior superior
    "28": "/img/color/l52_6.jpg", // M. obliquus internus (takror)
    "29": "/img/color/l52_29.jpg", // Aponeurosis
  },
  l53: {
    "1": "/img/color/l53_1.jpg", // Humerus
    "2": "/img/color/l53_2.jpg", // Epicondylus medialis
    "3": "/img/color/l53_3.jpg", // M. palmaris longus
    "4": "/img/color/l53_4.jpg", // M. flexor carpi ulnaris
    "5": "/img/color/l53_5.jpg", // Ulna
    "6": "/img/color/l53_6.jpg", // Radius
    "7": "/img/color/l53_7.jpg", // M. flexor carpi radialis
  },

  l54: {
    "1": "/img/color/l54_1.jpg", // M. sartorius
    "2": "/img/color/l54_2.jpg", // Quymich kosasidan boshcha
    "3": "/img/color/l54_3.jpg", // Yonbosh suyagidan boshcha
    "4": "/img/color/l54_4.jpg", // M. vastus lateralis
    "5": "/img/color/l54_5.jpg", // M. rectus femoris
    "6": "/img/color/l54_1.jpg", // M. sartorius (takror)
    "7": "/img/color/l54_7.jpg", // M. vastus medialis
    "8": "/img/color/l54_8.jpg", // To'rt boshli mushakning payi
    "9": "/img/color/l54_9.jpg", // Patella
    "10": "/img/color/l54_10.jpg", // Lig. patellae
    "11": "/img/color/l54_11.jpg", // Yuza g'oz panjasi (pes anserinus)
    "12": "/img/color/l54_12.jpg", // M. gracilis
    "13": "/img/color/l54_13.jpg", // M. adductor magnus
    "14": "/img/color/l54_14.jpg", // M. adductor longus
    "15": "/img/color/l54_15.jpg", // M. pectineus
  },

  l56: {
    "1": "/img/color/l56_1.jpg", // Endoteliy
    "2": "/img/color/l56_2.jpg", // Tunica media
    "3": "/img/color/l56_3.jpg", // Tunica externa
    "4": "/img/color/l56_4.jpg", // Ichki elastik membrana
  },

  l31: {
    "1": "/img/color/l31_1.jpg", // Glandula parotis
    "2": "/img/color/l31_2.jpg", // Lingua
    "3": "/img/color/l31_3.jpg", // Esophagus
    "4": "/img/color/l31_4.jpg", // Gaster
    "5": "/img/color/l31_5.jpg", // Pancreas
    "6": "/img/color/l31_6.jpg", // Jejunum
    "7": "/img/color/l31_7.jpg", // Colon transversum
    "8": "/img/color/l31_8.jpg", // Colon descendens
    "9": "/img/color/l31_9.jpg", // Colon sigmoideum
    "10": "/img/color/l31_10.jpg", // Rectum
    "11": "/img/color/l31_11.jpg", // Ileum
    "12": "/img/color/l31_12.jpg", // Appendix vermiformis
    "13": "/img/color/l31_13.jpg", // Caecum
    "14": "/img/color/l31_14.jpg", // Colon ascendens
    "15": "/img/color/l31_15.jpg", // Duodenum
    "16": "/img/color/l31_16.jpg", // Ductus choledochus
    "17": "/img/color/l31_17.jpg", // Vesica biliaris
    "18": "/img/color/l31_18.jpg", // Lobus hepatis dexter
    "19": "/img/color/l31_19.jpg", // Lobus hepatis sinister
    "20": "/img/color/l31_20.jpg", // Glandula submandibularis
    "21": "/img/color/l31_21.jpg", // Glandula sublingualis
    "22": "/img/color/l31_22.jpg", // Cavitas oris
  },
  l32: {
    "1": "/img/color/l32_1.jpg", // Fundus gastricus
    "2": "/img/color/l32_2.jpg", // Curvatura major
    "3": "/img/color/l32_3.jpg", // Corpus gastricum
    "4": "/img/color/l32_4.jpg", // Antrum pyloricum
    "5": "/img/color/l32_5.jpg", // Canalis pyloricus
    "6": "/img/color/l32_6.jpg", // M. sphincter pyloricus
    "7": "/img/color/l32_7.jpg", // Pilorik torayma
    "8": "/img/color/l32_8.jpg", // Pars descendens duodeni
    "9": "/img/color/l32_9.jpg", // Ostium pyloricum
    "10": "/img/color/l32_10.jpg", // Incisura angularis
    "11": "/img/color/l32_11.jpg", // Curvatura minor
    "12": "/img/color/l32_12.jpg", // Pars cardiaca
    "13": "/img/color/l32_13.jpg", // Pars abdominalis esophagi
    "14": "/img/color/l32_14.jpg", // Incisura cardiaca
  },
  l33: {
    "1": "/img/color/l33_1.jpg", // Lig. hepatoduodenale
    "2": "/img/color/l33_2.jpg", // Lig. hepatogastricum
    "3": "/img/color/l33_3.jpg", // Hepar
    "4": "/img/color/l33_4.jpg", // Omentum minus
    "5": "/img/color/l33_5.jpg", // Curvatura minor
    "6": "/img/color/l33_6.jpg", // Gaster
    "7": "/img/color/l33_7.jpg", // Colon descendens
    "8": "/img/color/l33_8.jpg", // Colon sigmoideum
    "9": "/img/color/l33_9.jpg", // Rectum
    "10": "/img/color/l33_10.jpg", // Symphysis pubica
    "11": "/img/color/l33_11.jpg", // Vesica urinaria
    "12": "/img/color/l33_12.jpg", // Appendix vermiformis
    "13": "/img/color/l33_13.jpg", // Mesenterium
    "14": "/img/color/l33_14.jpg", // Colon ascendens
    "15": "/img/color/l33_15.jpg", // Duodenum
    "16": "/img/color/l33_16.jpg", // Foramen omentale
    "17": "/img/color/l33_17.jpg", // Vesica biliaris
  },
  l65: {
    "1": "/img/color/l65_1.jpg", // Enamelum
    "2": "/img/color/l65_2.jpg", // Dentinum
    "3": "/img/color/l65_3.jpg", // Cavum dentis
    "4": "/img/color/l65_4.jpg", // Canalis radicis dentis
    "5": "/img/color/l65_5.jpg", // Cementum
    "6": "/img/color/l65_6.jpg", // Foramen apicis dentis
    "7": "/img/color/l65_7.jpg", // Radix dentis
    "8": "/img/color/l65_8.jpg", // Collum dentis
    "9": "/img/color/l65_9.jpg", // Corona dentis
  },
  l66: {
    "1": "/img/color/l66_1.jpg", // Tunica adventitia
    "2": "/img/color/l66_2.jpg", // Stratum longitudinale
    "3": "/img/color/l66_3.jpg", // Stratum circulare
    "4": "/img/color/l66_4.jpg", // Tela submucosa
    "5": "/img/color/l66_5.jpg", // Tunica mucosa
    "6": "/img/color/l66_6.jpg", // Epithelium
    "7": "/img/color/l66_7.jpg", // Qizilo'ngach bo'shlig'i
    "8": "/img/color/l66_8.jpg", // Plicae tunicae mucosae
  },
  l67: {
    "1": "/img/color/l67_1.jpg", // Ductus pancreaticus accessorius
    "2": "/img/color/l67_2.jpg", // Margo superior
    "3": "/img/color/l67_3.jpg", // Corpus pancreatis
    "4": "/img/color/l67_4.jpg", // Cauda pancreatis
    "5": "/img/color/l67_5.jpg", // Margo inferior
    "6": "/img/color/l67_6.jpg", // Ductus pancreaticus
    "7": "/img/color/l67_7.jpg", // Margo anterior
    "8": "/img/color/l67_8.jpg", // Incisura pancreatis
    "9": "/img/color/l67_9.jpg", // Processus uncinatus
    "10": "/img/color/l67_10.jpg", // Caput pancreatis
    "11": "/img/color/l67_6.jpg", // Ductus pancreaticus (qayta)
    "12": "/img/color/l67_12.jpg", // Ductus choledochus
  },
  l34: {
    "1": "/img/color/l34_1.jpg", // Sinus frontalis
    "2": "/img/color/l34_2.jpg", // Lamina perpend  "2": "/img/color/l35_2.jpg", // Lig. cricothyroideum me "/img/color/l35_2.jpg", // Lig. cricothyroideum medianum
    "3": "/img/color/l35_3.jpg", // Lamina visceralis fasciae
    "4": "/img/color/l35_4.jpg", // Tunica mucosa
    "5": "/img/color/l35_5.jpg", // Bronchus lobaris superior sinister
    "6": "/img/color/l35_6.jpg", // Bronchus segmentalis apicoposterior
    "7": "/img/color/l35_7.jpg", // Bronchus segmentalis anterior
    "8": "/img/color/l35_8.jpg", // Bronchus lingularis superior
    "9": "/img/color/l35_9.jpg", // Bronchus lingularis inferior
    "10": "/img/color/l35_10.jpg", // Bronchus segmentalis superius
    "11": "/img/color/l35_11.jpg", // Bronchus segmentalis basalis medialis
    "12": "/img/color/l35_12.jpg", // Bronchus segmentalis basalis lateralis
    "13": "/img/color/l35_13.jpg", // Bronchus segmentalis basalis posterior
    "14": "/img/color/l35_14.jpg", // Bronchus lobaris inferior sinister
    "15": "/img/color/l35_15.jpg", // Bronchus principalis sinister
    "16": "/img/color/l35_16.jpg", // Bronchus principalis dexter
    "17": "/img/color/l35_17.jpg", // Bronchus segmentalis basalis posterior
    "18": "/img/color/l35_18.jpg", // Bronchus segmentalis basalis lateralis
    "19": "/img/color/l35_19.jpg", // Bronchus segmentalis basalis anterior
    "20": "/img/color/l35_20.jpg", // Bronchus segmentalis basalis medialis
    "21": "/img/color/l35_21.jpg", // Bronchus lobaris inferior dexter
    "22": "/img/color/l35_22.jpg", // Bronchus segmentalis medialis
    "23": "/img/color/l35_23.jpg", // Bronchus segmentalis lateralis
    "24": "/img/color/l35_24.jpg", // Bronchus lobaris medius dexter
    "25": "/img/color/l35_25.jpg", // Bronchus segmentalis superior
    "26": "/img/color/l35_26.jpg", // Bronchus segmentalis anterior
    "27": "/img/color/l35_27.jpg", // Bronchus segmentalis posterior
    "28": "/img/color/l35_28.jpg", // Bronchus segmentalis apicalis
    "29": "/img/color/l35_29.jpg", // Bronchus lobaris superior dexter
    "30": "/img/color/l35_30.jpg", // Trachea
    "31": "/img/color/l35_31.jpg", // Cartilago cricoidea
  },
  l68: {
    "1": "/img/color/l68_1.jpg", // Corpus ossis hyoidei
    "2": "/img/color/l68_2.jpg", // Cornu minus ossis hyoidei
    "3": "/img/color/l68_3.jpg", // Cornu majus ossis hyoidei
    "4": "/img/color/l68_4.jpg", // Cartilago triticea
    "5": "/img/color/l68_5.jpg", // Cornu superius cartilaginis thyroideae
    "6": "/img/color/l68_6.jpg", // Tuberculum thyroideum superius
    "7": "/img/color/l68_7.jpg", // Lamina sinistra cartilaginis thyroideae
    "8": "/img/color/l68_8.jpg", // Tuberculum thyroideum inferius
    "9": "/img/color/l68_9.jpg", // Cornu inferius cartilaginis thyroideae
    "10": "/img/color/l68_10.jpg", // Arcus cartilaginis cricoideae
    "11": "/img/color/l68_11.jpg", // Cartilagines tracheales
    "12": "/img/color/l68_12.jpg", // Ligg. annularia
    "13": "/img/color/l68_13.jpg", // Lig. cricotracheale
    "14": "/img/color/l68_14.jpg", // Lig. ceratocricoideum anterius
    "15": "/img/color/l68_15.jpg", // Lig. cricothyroideum medianum
    "16": "/img/color/l68_16.jpg", // Lamina dextra cartilaginis thyroideae
    "17": "/img/color/l68_17.jpg", // Incisura thyroidea superior
    "18": "/img/color/l68_18.jpg", // Lig. thyrohyoideum medianum
    "19": "/img/color/l68_19.jpg", // Lig. thyrohyoideum laterale
  },
  l69: {
    "1": "/img/color/l69_1.jpg", // Larynx
    "2": "/img/color/l69_2.jpg", // Trachea
    "3": "/img/color/l69_3.jpg", // Apex pulmonis
    "4": "/img/color/l69_4.jpg", // Facies costalis
    "5": "/img/color/l69_5.jpg", // Lobus superior pulmonis sinistri
    "6": "/img/color/l69_6.jpg", // Pulmo sinister
    "7": "/img/color/l69_7.jpg", // Fissura obliqua
    "8": "/img/color/l69_8.jpg", // Lobus inferior pulmonis sinistri
    "9": "/img/color/l69_9.jpg", // Basis pulmonis
    "10": "/img/color/l69_10.jpg", // Lingula pulmonis sinistri
    "11": "/img/color/l69_11.jpg", // Incisura cardiaca pulmonis sinistri
    "12": "/img/color/l69_12.jpg", // Margo posterior
    "13": "/img/color/l69_13.jpg", // Margo anterior
    "14": "/img/color/l69_14.jpg", // Facies diaphragmatica
    "15": "/img/color/l69_15.jpg", // Margo inferior
    "16": "/img/color/l69_16.jpg", // Lobus inferior pulmonis dextri
    "17": "/img/color/l69_17.jpg", // Lobus medius pulmonis dextri
    "18": "/img/color/l69_18.jpg", // Fissura horizontalis pulmonis dextri
    "19": "/img/color/l69_19.jpg", // Pulmo dexter
    "20": "/img/color/l69_20.jpg", // Lobus superior pulmonis dextri
    "21": "/img/color/l69_21.jpg", // Bifurcatio tracheae
  },
  l36: {
    "1": "/img/color/l36_1.jpg", // Columna renalis
    "2": "/img/color/l36_2.jpg", // Calyces renales majores
    "3": "/img/color/l36_3.jpg", // A. renalis
    "4": "/img/color/l36_4.jpg", // V. renalis
    "5": "/img/color/l36_5.jpg", // Pelvis renalis
    "6": "/img/color/l36_6.jpg", // Ureter
    "7": "/img/color/l36_7.jpg", // Calyces renales minores
    "8": "/img/color/l36_8.jpg", // Sinus renalis
    "9": "/img/color/l36_9.jpg", // Papilla renalis
    "10": "/img/color/l36_10.jpg", // Cortex renis
    "11": "/img/color/l36_11.jpg", // Pyramides renales
  },
  l37: {
    "1": "/img/color/l37_1.jpg", // Ureter
    "2": "/img/color/l37_2.jpg", // Ductus deferens
    "3": "/img/color/l37_3.jpg", // Glandula seminalis
    "4": "/img/color/l37_4.jpg", // Ampulla ductus deferentis
    "5": "/img/color/l37_5.jpg", // Ductus ejaculatorius
    "6": "/img/color/l37_6.jpg", // Glandula bulbourethralis
    "7": "/img/color/l37_7.jpg", // M. transversus perinei profundus
    "8": "/img/color/l37_8.jpg", // Os pubis
    "9": "/img/color/l37_9.jpg", // Prostata
    "10": "/img/color/l37_10.jpg", // Vesica urinaria
  },
  l81: {
    "1": "/img/color/l81_1.jpg", // Truncus lumbosacralis
    "2": "/img/color/l81_2.jpg", // N. gluteus superior
    "3": "/img/color/l81_3.jpg", // N. gluteus inferior
    "4": "/img/color/l81_4.jpg", // Lig. inguinale
    "5": "/img/color/l81_5.jpg", // Nn. m. quadrati femoris et obturatorii interni
    "6": "/img/color/l81_6.jpg", // N. ischiadicus
    "7": "/img/color/l81_7.jpg", // N. cutaneus femoris posterior
    "8": "/img/color/l81_8.jpg", // Nn. clunium perforantes
    "9": "/img/color/l81_9.jpg", // N. obturatorius
    "10": "/img/color/l81_10.jpg", // N. femoralis
    "11": "/img/color/l81_11.jpg", // Lig. sacrospinale
    "12": "/img/color/l81_12.jpg", // R. femoralis n. genitofemoralis
    "13": "/img/color/l81_13.jpg", // Lig. sacrotuberale
    "14": "/img/color/l81_14.jpg", // N. cutaneus femoris lateralis
    "15": "/img/color/l81_15.jpg", // N. ilioinguinalis
    "16": "/img/color/l81_16.jpg", // R. anterior L1
    "17": "/img/color/l81_17.jpg", // R. anterior L2
    "18": "/img/color/l81_18.jpg", // R. anterior L3
  },
  l80: {
    "1": "/img/color/l80_1.jpg", // N. hypoglossus
    "2": "/img/color/l80_2.jpg", // N. accessorius
    "3": "/img/color/l80_3.jpg", // M. sternocleidomastoideus
    "4": "/img/color/l80_4.jpg", // N. auricularis magnus
    "5": "/img/color/l80_5.jpg", // N. occipitalis minor
    "6": "/img/color/l80_6.jpg", // N. occipitalis major
    "7": "/img/color/l80_7.jpg", // M. trapezius
    "8": "/img/color/l80_8.jpg", // N. phrenicus
    "9": "/img/color/l80_9.jpg", // Nn. supraclaviculares
    "10": "/img/color/l80_10.jpg", // Venter inferior m. omohyoidei
    "11": "/img/color/l80_11.jpg", // M. sternocleidomastoideus
    "12": "/img/color/l80_12.jpg", // Ansa cervicalis
    "13": "/img/color/l80_13.jpg", // M. sternohyoideus
    "14": "/img/color/l80_14.jpg", // M. sternothyroideus
    "15": "/img/color/l80_15.jpg", // Venter superior m. omohyoidei
    "16": "/img/color/l80_16.jpg", // N. transversus colli
    "17": "/img/color/l80_17.jpg", // Radix inferior ansae cervicalis
    "18": "/img/color/l80_18.jpg", // Radix superior ansae cervicalis
    "19": "/img/color/l80_19.jpg", // M. thyrohyoideus
    "20": "/img/color/l80_20.jpg", // M. geniohyoideus
  },
  l45: {
    "1": "/img/color/l45_1.jpg", // Zonula ciliaris
    "2": "/img/color/l45_2.jpg", // Iris
    "3": "/img/color/l45_3.jpg", // Lens
    "4": "/img/color/l45_4.jpg", // Cornea
    "5": "/img/color/l45_5.jpg", // Camera anterior bulbi
    "6": "/img/color/l45_6.jpg", // Camera posterior bulbi
    "7": "/img/color/l45_7.jpg", // Angulus iridocornealis
    "8": "/img/color/l45_8.jpg", // Processus ciliares
    "9": "/img/color/l45_9.jpg", // Tunica conjunctiva bulbi
    "10": "/img/color/l45_10.jpg", // Tendo m. recti medialis
    "11": "/img/color/l45_11.jpg", // Ora serrata
    "12": "/img/color/l45_12.jpg", // Corpus vitreum
    "13": "/img/color/l45_13.jpg", // N. opticus
    "14": "/img/color/l45_14.jpg", // A. et v. centralis retinae
    "15": "/img/color/l45_15.jpg", // Vagina externa nervi optici
    "16": "/img/color/l45_16.jpg", // Fovea centralis
    "17": "/img/color/l45_17.jpg", // Spatium episclerale
    "18": "/img/color/l45_18.jpg", // Vagina bulbi
    "19": "/img/color/l45_19.jpg", // Sclera
    "20": "/img/color/l45_20.jpg", // Spatium perichoroideale
    "21": "/img/color/l45_21.jpg", // Choroidea
    "22": "/img/color/l45_22.jpg", // Pars optica retinae
    "23": "/img/color/l45_23.jpg", // Tendo m. recti lateralis
    "24": "/img/color/l45_24.jpg", // Corpus ciliare
    "25": "/img/color/l45_25.jpg", // Sinus venosus sclerae
  },
  l44: {
    "1": "/img/color/l44_1.jpg", // Radix posterior
    "2": "/img/color/l44_2.jpg", // Ganglion spinale
    "3": "/img/color/l44_3.jpg", // Radix anterior
    "4": "/img/color/l44_4.jpg", // Ramus communicans albus
    "5": "/img/color/l44_5.jpg", // Ramus communicans griseus
    "6": "/img/color/l44_6.jpg", // Ramus anterior
    "7": "/img/color/l44_7.jpg", // Ramus posterior
    "8": "/img/color/l44_8.jpg", // Substantia alba
    "9": "/img/color/l44_9.jpg", // Substantia grisea
  },
  l57: {
    "1": "/img/color/l57_1.jpg", // Sulcus medianus posterior
    "2": "/img/color/l57_2.jpg", // Radix posterior
    "3": "/img/color/l57_3.jpg", // Cornu posterius
    "4": "/img/color/l57_4.jpg", // Lig. denticulatum
    "5": "/img/color/l57_5.jpg", // Cornu anterius
    "6": "/img/color/l57_6.jpg", // A. spinalis anterior
    "7": "/img/color/l57_7.jpg", // Fissura mediana anterior
    "8": "/img/color/l57_8.jpg", // Radix anterior
    "9": "/img/color/l57_9.jpg", // Pia mater spinalis
    "10": "/img/color/l57_10.jpg", // Cornu laterale
    "11": "/img/color/l57_11.jpg", // Canalis centralis
    "12": "/img/color/l57_12.jpg", // Sulcus intermedius posterior
  },
  l58: {
    "1": "/img/color/l58_1.jpg", // Nucleus posterior n. vagi
    "2": "/img/color/l58_2.jpg", // Nucleus nervi hypoglossi
    "3": "/img/color/l58_3.jpg", // Pedunculus cerebellaris inferior
    "4": "/img/color/l58_4.jpg", // Formatio reticularis
    "5": "/img/color/l58_5.jpg", // Nucleus olivaris inferior
    "6": "/img/color/l58_6.jpg", // Hilum nuclei olivaris inferioris
    "7": "/img/color/l58_7.jpg", // Tractus pyramidalis
    "8": "/img/color/l58_8.jpg", // Lemniscus medialis
    "9": "/img/color/l58_9.jpg", // Tractus spinocerebellaris anterior
    "10": "/img/color/l58_10.jpg", // Nucleus ambiguus
    "11": "/img/color/l58_11.jpg", // Nucleus spinalis nervi trigemini
    "12": "/img/color/l58_12.jpg", // Tractus spinocerebellaris posterior
    "13": "/img/color/l58_13.jpg", // Nuclei tractus solitarii
    "14": "/img/color/l58_14.jpg", // Nuclei nervi vestibulocochlearis
  },
  l59: {
    "1": "/img/color/l59_1.jpg", // Decussatio pedunculorum cerebellarium superiorum
    "2": "/img/color/l59_2.jpg", // Pedunculi cerebri
    "3": "/img/color/l59_3.jpg", // Velum medullare superius
    "4": "/img/color/l59_4.jpg", // Pedunculus cerebellaris superior
    "5": "/img/color/l59_5.jpg", // Lingula
    "6": "/img/color/l59_6.jpg", // Nucleus dentatus
    "7": "/img/color/l59_7.jpg", // Nucleus emboliformis
    "8": "/img/color/l59_8.jpg", // Nucleus fastigii
    "9": "/img/color/l59_9.jpg", // Vermis
    "10": "/img/color/l59_10.jpg", // Nucleus globosus
    "11": "/img/color/l59_11.jpg", // Ventriculus quartus
  },
  l60: {
    "1": "/img/color/l60_1.jpg", // Gyrus frontalis superior
    "2": "/img/color/l60_2.jpg", // Sulcus precentralis
    "3": "/img/color/l60_3.jpg", // Gyrus precentralis
    "4": "/img/color/l60_4.jpg", // Sulcus centralis
    "5": "/img/color/l60_5.jpg", // Gyrus postcentralis
    "6": "/img/color/l60_6.jpg", // Sulcus postcentralis
    "7": "/img/color/l60_7.jpg", // Lobulus parietalis superior
    "8": "/img/color/l60_8.jpg", // Sulcus intraparietalis
    "9": "/img/color/l60_9.jpg", // Gyrus supramarginalis
    "10": "/img/color/l60_10.jpg", // Gyrus angularis
    "11": "/img/color/l60_11.jpg", // Polus occipitalis
    "12": "/img/color/l60_12.jpg", // Gyrus temporalis inferior
    "13": "/img/color/l60_13.jpg", // Sulcus temporalis inferior
    "14": "/img/color/l60_14.jpg", // Gyrus temporalis medius
    "15": "/img/color/l60_15.jpg", // Sulcus temporalis superior
    "16": "/img/color/l60_16.jpg", // Gyrus temporalis superior
    "17": "/img/color/l60_17.jpg", // Polus temporalis
    "18": "/img/color/l60_18.jpg", // Sulcus lateralis
    "19": "/img/color/l60_19.jpg", // Ramus ascendens
    "20": "/img/color/l60_20.jpg", // Ramus anterior
    "21": "/img/color/l60_21.jpg", // Polus frontalis
    "22": "/img/color/l60_22.jpg", // Pars orbitalis
    "23": "/img/color/l60_23.jpg", // Pars triangularis
    "24": "/img/color/l60_24.jpg", // Pars opercularis
    "26": "/img/color/l60_26.jpg", // Gyrus frontalis medius
  },
  l61: {
    "1": "/img/color/l61_1.jpg", // N. olfactorius
    "2": "/img/color/l61_2.jpg", // N. opticus
    "3": "/img/color/l61_3.jpg", // N. oculomotorius
    "4": "/img/color/l61_4.jpg", // N. trochlearis
    "5": "/img/color/l61_5.jpg", // N. abducens
    "6": "/img/color/l61_6.jpg", // N. trigeminus
    "7": "/img/color/l61_7.jpg", // N. facialis
    "8": "/img/color/l61_8.jpg", // N. intermedius
    "9": "/img/color/l61_9.jpg", // N. cochlearis
    "10": "/img/color/l61_10.jpg", // N. vestibularis
    "11": "/img/color/l61_11.jpg", // N. glossopharyngeus
    "12": "/img/color/l61_12.jpg", // N. vagus
    "13": "/img/color/l61_13.jpg", // N. accessorius
    "14": "/img/color/l61_14.jpg", // N. hypoglossus
  },
  l62: {
    "1": "/img/color/l62_1.jpg", // Ganglia cervicalia
    "2": "/img/color/l62_2.jpg", // Ganglia thoracica
    "3": "/img/color/l62_3.jpg", // Ganglia lumbalia
    "4": "/img/color/l62_4.jpg", // Ganglia sacralia
    "5": "/img/color/l62_5.jpg", // Ganglion impar
  },

  l63: {
    "1": "/img/color/l63_1.jpg", // Sclera
    "4": "/img/color/l63_4.jpg", // Ora serrata
    "5": "/img/color/l63_5.jpg", // Orbiculus ciliaris
    "6": "/img/color/l63_6.jpg", // Lens
    "7": "/img/color/l63_7.jpg", // Fibrae zonulares
    "8": "/img/color/l63_8.jpg", // Processus ciliares
  },
  l64: {
    "1": "/img/color/l64_1.jpg", // Meatus acusticus internus
    "6": "/img/color/l64_6.jpg", // Meatus acusticus externus
    "7": "/img/color/l64_7.jpg", // Auricula
  },
  l43: {
    "1": "/img/color/l43_1.jpg", // Bulbus olfactorius
    "2": "/img/color/l43_2.jpg", // Lobus temporalis
    "3": "/img/color/l43_3.jpg", // N. opticus
    "4": "/img/color/l43_4.jpg", // N. oculomotorius
    "5": "/img/color/l43_5.jpg", // N. trochlearis
    "6": "/img/color/l43_6.jpg", // Radix sensoria n. trigemini
    "7": "/img/color/l43_7.jpg", // Radix motoria n. trigemini
    "8": "/img/color/l43_8.jpg", // N. abducens
    "9": "/img/color/l43_9.jpg", // N. hypoglossus
    "10": "/img/color/l43_10.jpg", // Cerebellum
    "11": "/img/color/l43_11.jpg", // Medulla oblongata
    "12": "/img/color/l43_12.jpg", // Medulla spinalis
    "13": "/img/color/l43_13.jpg", // N. accessorius
    "14": "/img/color/l43_14.jpg", // N. vagus et radix cranialis n. accessorii
    "15": "/img/color/l43_15.jpg", // N. glossopharyngeus
    "16": "/img/color/l43_16.jpg", // N. vestibulocochlearis
    "17": "/img/color/l43_17.jpg", // N. facialis
    "18": "/img/color/l43_18.jpg", // Lobus temporalis
    "19": "/img/color/l43_19.jpg", // Pons
    "20": "/img/color/l43_20.jpg", // Corpora mamillaria
    "21": "/img/color/l43_21.jpg", // Chiasma opticum
    "22": "/img/color/l43_22.jpg", // Lobus frontalis
  },
  l42: {
    "a": "/img/color/l42_a.jpg", // Loviyasimon
    "b": "/img/color/l42_b.jpg", // Yumaloq
    "d": "/img/color/l42_d.jpg", // Oval
    "e": "/img/color/l42_e.jpg", // Bo'laklarga bo'lingan
    "f": "/img/color/l42_f.jpg", // Tasmasimon
  },
  l41: {
    "1": "/img/color/l41_1.jpg", // Endoteliy
    "2": "/img/color/l41_2.jpg", // Endoteliy osti qavati
    "3": "/img/color/l41_3.jpg", // Vasa vasorum
    "4": "/img/color/l41_4.jpg", // N. vasorum
    "5": "/img/color/l41_5.jpg", // Tunica externa
    "6": "/img/color/l41_6.jpg", // Vasa vasorum
    "7": "/img/color/l41_7.jpg", // Tashqi elastik membrana
    "8": "/img/color/l41_8.jpg", // Tunica media
    "9": "/img/color/l41_9.jpg", // Ichki elastik membrana
    "10": "/img/color/l41_10.jpg", // Bazal membrana
  },
  l40: {
    "1": "/img/color/l40_1.jpg", // Bosh va qo'l kapillyarlari
    "2": "/img/color/l40_2.jpg", // O'pka kapillyarlari
    "3": "/img/color/l40_3.jpg", // A. carotis communis
    "4": "/img/color/l40_4.jpg", // Truncus pulmonalis
    "5": "/img/color/l40_5.jpg", // Vv. pulmonales sinistrae
    "6": "/img/color/l40_6.jpg", // Atrium sinistrum
    "7": "/img/color/l40_7.jpg", // Ventriculus sinister
    "8": "/img/color/l40_8.jpg", // Truncus coeliacus
    "9": "/img/color/l40_9.jpg", // A. hepatica propria
    "10": "/img/color/l40_10.jpg", // Aorta
    "11": "/img/color/l40_11.jpg", // A. gastrica sinistra
    "12": "/img/color/l40_12.jpg", // A. splenica
    "13": "/img/color/l40_13.jpg", // Oshqozon kapillyarlari
    "14": "/img/color/l40_14.jpg", // A. mesenterica superior
    "15": "/img/color/l40_15.jpg", // Tananing pastki qismi va oyoq kapillyarlari
    "16": "/img/color/l40_16.jpg", // V. cava inferior
    "17": "/img/color/l40_17.jpg", // A. renalis
    "18": "/img/color/l40_18.jpg", // V. renalis
    "19": "/img/color/l40_19.jpg", // V. portae hepatis
    "20": "/img/color/l40_20.jpg", // Vv. hepaticae
    "21": "/img/color/l40_21.jpg", // Ductus thoracicus
    "22": "/img/color/l40_22.jpg", // Ventriculus dexter
    "23": "/img/color/l40_23.jpg", // Atrium dextrum
    "24": "/img/color/l40_24.jpg", // V. cava superior
    "25": "/img/color/l40_25.jpg", // Arcus aortae
    "26": "/img/color/l40_26.jpg", // Vv. pulmonales dextrae
  },
  l79: {
    "1": "/img/color/l79_1.jpg", // V. jugularis interna sinistra
    "2": "/img/color/l79_2.jpg", // V. subclavia sinistra
    "3": "/img/color/l79_3.jpg", // V. brachiocephalica sinistra
    "4": "/img/color/l79_4.jpg", // V. intercostalis suprema sinistra
    "5": "/img/color/l79_5.jpg", // V. hemiazygos accessoria
    "6": "/img/color/l79_6.jpg", // V. hemiazygos
    "7": "/img/color/l79_7.jpg", // V. cava inferior
    "8": "/img/color/l79_8.jpg", // Vv. intercostales
    "9": "/img/color/l79_9.jpg", // V. azygos
    "10": "/img/color/l79_10.jpg", // Atrium dextrum
    "11": "/img/color/l79_11.jpg", // V. cava superior
    "12": "/img/color/l79_12.jpg", // V. intercostalis superior
    "13": "/img/color/l79_13.jpg", // V. vertebralis dextra
    "14": "/img/color/l79_14.jpg", // V. jugularis interna dextra
  },
  l78: {
    "1": "/img/color/l78_1.jpg", // A. supraorbitalis
    "2": "/img/color/l78_2.jpg", // A. temporalis profunda anterior
    "3": "/img/color/l78_3.jpg", // A. temporalis profunda posterior
    "4": "/img/color/l78_4.jpg", // Rr. pterygoidei
    "5": "/img/color/l78_5.jpg", // A. meningea media
    "6": "/img/color/l78_6.jpg", // R. frontalis a. temporalis superficialis
    "7": "/img/color/l78_7.jpg", // R. parietalis a. temporalis superficialis
    "8": "/img/color/l78_8.jpg", // A. occipitalis
    "9": "/img/color/l78_9.jpg", // A. transversa faciei
    "10": "/img/color/l78_10.jpg", // A. maxillaris
    "11": "/img/color/l78_11.jpg", // A. temporalis superficialis
    "12": "/img/color/l78_12.jpg", // A. auricularis posterior
    "13": "/img/color/l78_13.jpg", // A. alveolaris inferior
    "14": "/img/color/l78_14.jpg", // R. mylohyoideus
    "15": "/img/color/l78_15.jpg", // A. pharyngea ascendens
    "16": "/img/color/l78_16.jpg", // A. occipitalis
    "17": "/img/color/l78_17.jpg", // A. palatina ascendens
    "18": "/img/color/l78_18.jpg", // A. facialis
    "19": "/img/color/l78_19.jpg", // A. lingualis
    "20": "/img/color/l78_20.jpg", // A. pharyngea ascendens
    "21": "/img/color/l78_21.jpg", // A. carotis interna sinistra
    "22": "/img/color/l78_22.jpg", // N. vagus
    "23": "/img/color/l78_23.jpg", // M. scalenus medius
    "24": "/img/color/l78_24.jpg", // N. phrenicus
    "25": "/img/color/l78_25.jpg", // A. carotis communis
  },
  l77: {
    "1": "/img/color/l77_1.jpg", // M. auricularis anterior
    "2": "/img/color/l77_2.jpg", // M. auricularis superior
    "3": "/img/color/l77_3.jpg", // Galea aponeurotica
    "4": "/img/color/l77_4.jpg", // Venter occipitalis m. occipitofrontalis
    "5": "/img/color/l77_5.jpg", // M. auricularis posterior
    "6": "/img/color/l77_6.jpg", // M. platysma
    "7": "/img/color/l77_7.jpg", // M. buccinator
    "8": "/img/color/l77_8.jpg", // M. risorius
    "9": "/img/color/l77_9.jpg", // M. depressor anguli oris
    "10": "/img/color/l77_10.jpg", // M. mentalis
    "11": "/img/color/l77_11.jpg", // M. depressor labii inferioris
    "12": "/img/color/l77_12.jpg", // M. orbicularis oris
    "13": "/img/color/l77_13.jpg", // M. zygomaticus major
    "14": "/img/color/l77_14.jpg", // M. zygomaticus minor
    "15": "/img/color/l77_15.jpg", // M. levator labii superioris
    "16": "/img/color/l77_16.jpg", // M. levator labii superioris alaeque nasi
    "17": "/img/color/l77_17.jpg", // M. nasalis
    "18": "/img/color/l77_18.jpg", // M. procerus
    "19": "/img/color/l77_19.jpg", // M. orbicularis oculi
    "20": "/img/color/l77_20.jpg", // Venter frontalis m. occipitofrontalis
  },
  l76: {
    "1": "/img/color/l76_1.jpg", // M. styloglossus
    "2": "/img/color/l76_2.jpg", // Ramus mandibulae
    "3": "/img/color/l76_3.jpg", // Glandula parotidea
    "4": "/img/color/l76_4.jpg", // M. masseter
    "5": "/img/color/l76_5.jpg", // Glandula submandibularis
    "6": "/img/color/l76_6.jpg", // M. hyoglossus
    "7": "/img/color/l76_7.jpg", // M. omohyoideus
    "8": "/img/color/l76_8.jpg", // Corpus mandibulae
    "9": "/img/color/l76_9.jpg", // Venter anterior m. digastrici
    "10": "/img/color/l76_10.jpg", // Os hyoideum
    "11": "/img/color/l76_11.jpg", // M. thyrohyoideus
    "12": "/img/color/l76_12.jpg", // Venter superior m. omohyoidei
    "13": "/img/color/l76_13.jpg", // M. sternohyoideus
    "14": "/img/color/l76_14.jpg", // M. sternothyroideus
    "15": "/img/color/l76_15.jpg", // Manubrium sterni
    "16": "/img/color/l76_16.jpg", // M. sternocleidomastoideus
    "17": "/img/color/l76_17.jpg", // M. pectoralis major
    "18": "/img/color/l76_18.jpg", // Clavicula
    "19": "/img/color/l76_19.jpg", // Venter inferior m. omohyoidei
    "20": "/img/color/l76_20.jpg", // M. deltoideus
    "21": "/img/color/l76_21.jpg", // Acromion
    "22": "/img/color/l76_22.jpg", // M. trapezius
    "23": "/img/color/l76_23.jpg", // M. scalenus anterior
    "24": "/img/color/l76_24.jpg", // M. scalenus medius
    "25": "/img/color/l76_25.jpg", // M. scalenus posterior
    "26": "/img/color/l76_26.jpg", // M. levator scapulae
  },
  l75: {
    "a1": "/img/color/l75_a1.jpg", // O'ng: Facies renalis
    "a2": "/img/color/l75_a2.jpg", // O'ng: Margo medialis
    "a3": "/img/color/l75_a3.jpg", // O'ng: Facies posterior
    "b1": "/img/color/l75_b1.jpg", // Chap: Facies posterior
    "b2": "/img/color/l75_b2.jpg", // Chap: Margo medialis
    "b3": "/img/color/l75_b3.jpg", // Chap: Facies renalis
  },
  l74: {
    "1": "/img/color/l74_1.jpg", // Os hyoideum
    "2": "/img/color/l74_2.jpg", // Membrana thyrohyoidea
    "3": "/img/color/l74_3.jpg", // M. thyrohyoideus
    "4": "/img/color/l74_4.jpg", // A. laryngea superior sinistra
    "5": "/img/color/l74_5.jpg", // A. thyroidea superior sinistra
    "6": "/img/color/l74_6.jpg", // Lobus pyramidalis glandulae thyroideae
    "7": "/img/color/l74_7.jpg", // V. thyroidea superior sinistra
    "8": "/img/color/l74_8.jpg", // Lobus sinistra glandulae thyroideae
    "9": "/img/color/l74_9.jpg", // V. thyroidea inferior sinistra
    "10": "/img/color/l74_10.jpg", // Plexus thyroideus impar
    "11": "/img/color/l74_11.jpg", // A. thyroidea inferior sinistra
    "12": "/img/color/l74_12.jpg", // Trachea
    "13": "/img/color/l74_13.jpg", // V. thyroidea ima
    "14": "/img/color/l74_14.jpg", // A. thyroidea ima
    "15": "/img/color/l74_15.jpg", // A. thyroidea inferior dextra
    "16": "/img/color/l74_16.jpg", // V. thyroidea inferior dextra
    "17": "/img/color/l74_17.jpg", // Isthmus glandulae thyroideae
    "18": "/img/color/l74_18.jpg", // Lobus dextra glandulae thyroideae
    "19": "/img/color/l74_19.jpg", // V. thyroidea superior dextra
    "20": "/img/color/l74_20.jpg", // R. glandularis anterior
    "21": "/img/color/l74_21.jpg", // Cartilago thyroidea
    "22": "/img/color/l74_22.jpg", // Incisura thyroidea superior
    "23": "/img/color/l74_23.jpg", // A. thyroidea superior dextra
    "24": "/img/color/l74_24.jpg", // A. laryngea superior dextra
    "25": "/img/color/l74_25.jpg", // Cornu majus ossis hyoidei
    "26": "/img/color/l74_26.jpg", // Cornu minus ossis hyoidei
  },
  l73: {
    "1": "/img/color/l73_1.jpg", // Rectum
    "2": "/img/color/l73_2.jpg", // Canalis analis
    "3": "/img/color/l73_3.jpg", // M. sphincter ani
    "4": "/img/color/l73_4.jpg", // Urethra feminina
    "5": "/img/color/l73_5.jpg", // Vesica urinaria
    "6": "/img/color/l73_6.jpg", // Vagina
    "7": "/img/color/l73_7.jpg", // Uterus
    "8": "/img/color/l73_8.jpg", // Ovarium
    "9": "/img/color/l73_9.jpg", // Tuba uterina
  },
  l72: {
    "1": "/img/color/l72_1.jpg", // Funiculus spermaticus
    "2": "/img/color/l72_2.jpg", // Fascia spermatica interna
    "3": "/img/color/l72_3.jpg", // Caput epididymidis
    "4": "/img/color/l72_4.jpg", // Appendix testis
    "5": "/img/color/l72_5.jpg", // Tunica vaginalis testis
    "6": "/img/color/l72_6.jpg", // Testis
    "7": "/img/color/l72_7.jpg", // Margo anterior
    "8": "/img/color/l72_8.jpg", // Extremitas inferior
    "9": "/img/color/l72_9.jpg", // Lig. epididymidis inferior
    "10": "/img/color/l72_10.jpg", // Cauda epididymidis
    "11": "/img/color/l72_11.jpg", // Corpus epididymidis
    "12": "/img/color/l72_12.jpg", // Sinus epididymidis
  },
  l71: {
    "1": "/img/color/l71_1.jpg", // Sinus prostaticus
    "2": "/img/color/l71_2.jpg", // Crista urethralis
    "3": "/img/color/l71_3.jpg", // Colliculus seminalis
    "4": "/img/color/l71_4.jpg", // Zona glandularum periurethralium
    "5": "/img/color/l71_5.jpg", // Substantia muscularis
    "6": "/img/color/l71_6.jpg", // Oraliqning chuqur yumshoq to'qimasi
    "7": "/img/color/l71_7.jpg", // Oraliq pardasi
    "8": "/img/color/l71_8.jpg", // M. sphincter urethrae externus
    "9": "/img/color/l71_9.jpg", // Ductus ejaculatorius teshigi
    "10": "/img/color/l71_10.jpg", // Prostata bezi naychalarining teshigi
    "11": "/img/color/l71_11.jpg", // Utriculus prostaticus
    "12": "/img/color/l71_12.jpg", // Prostata
    "13": "/img/color/l71_13.jpg", // M. sphincter urethrae internus
  },
  l70: {
    "1": "/img/color/l70_1.jpg", // Corpusculum renale
    "2": "/img/color/l70_2.jpg", // Glomerulum
    "3": "/img/color/l70_3.jpg", // Capsula glomerularis
    "4": "/img/color/l70_4.jpg", // A. interlobularis
    "5": "/img/color/l70_5.jpg", // Arteriola glomerularis afferens
    "6": "/img/color/l70_6.jpg", // Arteriola glomerularis efferens
    "7": "/img/color/l70_7.jpg", // Vasa interlobularia
    "8": "/img/color/l70_8.jpg", // V. arcuata
    "9": "/img/color/l70_9.jpg", // A. arcuata
    "10": "/img/color/l70_10.jpg", // Ansa nephroni
    "11": "/img/color/l70_11.jpg", // Rete capillare peritubulare
    "12": "/img/color/l70_12.jpg", // Ductuli papillaris
    "13": "/img/color/l70_13.jpg", // Tubuli renalis colligentes
    "14": "/img/color/l70_14.jpg", // Tubuli conjunctivi
    "15": "/img/color/l70_15.jpg", // Tubuli renalis contorti secunda
    "16": "/img/color/l70_16.jpg", // Tubuli renalis contorti prima
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
