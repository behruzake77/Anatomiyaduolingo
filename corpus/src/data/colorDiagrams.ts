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
    "2": "/img/color/l34_2.jpg", // Lamina perpendicularis
    "3": "/img/color/l34_3.jpg", // Sinus sphenoidalis
    "4": "/img/color/l34_4.jpg", // Sella turcica
    "5": "/img/color/l34_5.jpg", // Crista nasalis
    "6": "/img/color/l34_6.jpg", // Vomer
    "7": "/img/color/l34_7.jpg", // Spina nasalis anterior
    "8": "/img/color/l34_8.jpg", // Cartilago septi nasi
    "9": "/img/color/l34_9.jpg", // Os nasale
  },
  l35: {
    "1": "/img/color/l35_1.jpg", // Cartilago thyroidea
    "2": "/img/color/l35_2.jpg", // Lig. cricothyroideum medianum
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
