/**
 * Atamalar ta'rifi va vazifasi — FAQAT Ahmedov «Anatomiya I/II jild» darsligidan.
 * Har bir ta'rif kitob matnidan olingan (ixtiro qilinmagan). Lotin atama nomi → ta'rif.
 * Lug'atda yo'q atama — flesh-kartada faqat nom ko'rsatiladi.
 */
export const TERMS_INFO: Record<string, string> = {
  // ===== Umurtqa pog'onasi (I jild, 33–45-bet) =====
  // l1 — bo'limlar
  "Bo'yin qismi (Pars cervicalis)": "7 ta bo'yin umurtqasidan iborat — bo'yin sohasida joylashadi.",
  "Ko'krak qismi (Pars thoracica)": "12 ta ko'krak umurtqasidan iborat — ko'krak sohasida joylashadi.",
  "Bel qismi (Pars lumbalis)": "5 ta bel umurtqasidan iborat — bel sohasida joylashadi.",
  "Dumg'aza qismi (Os sacrum)": "Qo'shilib ketgan 5 dumg'aza umurtqasidan hosil bo'ladi.",
  "Dum qismi (Os coccygis)": "3–5 dum umurtqasidan hosil bo'ladi.",

  // l2/l4 — umurtqa
  "Corpus vertebrae": "Umurtqa tanasi oldinga qaragan bo'lib, asosiy og'irlikni ko'tarib, tayanch vazifasini bajaradi va umurtqalararo disklar vositasida birlashadi.",
  "Arcus vertebrae": "Umurtqa ravog'i tananing orqasida joylashib, tana bilan ikkita oyoqcha vositasida birikib, umurtqa teshigini hosil qiladi.",
  "Pedunculus arcus vertebrae": "Umurtqa ravog'ining oyoqchasi — ravoqni umurtqa tanasi bilan biriktiradi.",
  "Foramen vertebrale": "Umurtqa teshigi — barcha umurtqa teshiklarining qo'shilishidan umurtqa kanali hosil bo'ladi; ichida orqa miya va uning pardalari yotadi.",
  "Processus spinosus": "Orqada o'rta chiziqdan toq o'tkir qirrali o'siqcha chiqadi.",
  "Processus transversus": "Frontal sathda yon tomonga yo'nalgan juft ko'ndalang o'siqcha.",
  "Processus articularis superior": "Ustki bo'g'im o'siqchasi — qo'shni umurtqalar bilan bo'g'im hosil qiladi.",
  "Processus articularis inferior": "Pastki bo'g'im o'siqchasi — qo'shni umurtqalar bilan bo'g'im hosil qiladi.",
  "Facies articularis superior": "Ustki bo'g'im yuzasi — qo'shni umurtqalar bilan bo'g'im hosil qiladi.",
  "Facies articularis inferior": "Pastki bo'g'im yuzasi — qo'shni umurtqalar bilan bo'g'im hosil qiladi.",
  "Fovea costalis superior": "Qovurg'a boshi bilan birikadigan yuqorigi qovurg'a chuqurchasi.",
  "Fovea costalis inferior": "Qovurg'a boshi bilan birikadigan pastki qovurg'a chuqurchasi.",
  "Fovea costalis processus transversi": "Ko'ndalang o'simtaning qovurg'a chuqurchasi — qovurg'a do'mboqchasi bilan birlashadi.",
  "Incisura vertebralis superior": "Umurtqaning ustki kemtigi — qo'shilishidan umurtqalararo teshik hosil bo'ladi.",
  "Incisura vertebralis inferior": "Umurtqaning pastki kemtigi (chuqurroq) — qo'shilishidan umurtqalararo teshik hosil bo'ladi.",
  "Tuberculum anterius": "Oldingi do'mboqcha.",
  "Tuberculum posterius": "Orqa do'mboqcha.",
  "Sulcus nervi spinalis": "Orqa miya nervi egati.",
  "Foramen transversarium": "Ko'ndalang teshik — faqat bo'yin umurtqalariga xos.",
  "Processus costalis": "Bel umurtqasining qovurg'a o'simtasi — rudiment holatdagi qovurg'a.",
  "Processus mamillaris": "So'rg'ichsimon o'siqcha — ustki bo'g'im o'siqchasining yon tomonida.",
  "Processus accessorius": "Qo'shimcha o'siqcha — qovurg'a o'simtasining orqa yuzasining asosida.",
  "Foramen nutricium": "Oziqlantirish teshigi — qon tomirlar o'tadigan teshik (umurtqa tanasining orqa yuzasida).",

  // l5 — atlas
  "Arcus anterior atlantis": "Atlasning oldingi ravog'i — taraqqiyotda tish hosil qilib II umurtqaga birikib ketgan tananing o'rnida hosil bo'ladi.",
  "Arcus posterior atlantis": "Atlasning orqa ravog'i.",
  "Massa lateralis atlantis": "Atlasning yon massasi — oldingi va orqa ravoqlarni o'zaro biriktiradi.",
  "Fovea dentis": "Tish chuqurchasi — II umurtqa tishi bilan bo'g'im hosil qiladi.",
  "Dens": "II bo'yin umurtqasining tishi — atlas bilan bo'g'im hosil qilib, bosh harakatini ta'minlaydi.",
  "Apex dentis": "Tishning uchi.",

  // l8 — ko'krak umurtqasi
  // l9 — bel umurtqasi

  // l10 — dumg'aza
  "Basis ossis sacri": "Dumg'aza suyagining asosi — yuqoriga qaragan keng qismi.",
  "Apex ossis sacri": "Dumg'aza suyagining uchi — pastga qaragan tor qismi.",
  "Pars lateralis": "Dumg'aza suyagining yon qismi.",
  "Foramina sacralia anteriora": "Oldingi dumg'aza teshiklari.",
  "Foramina sacralia posteriora": "Orqa dumg'aza teshiklari.",
  "Os coccygis": "Dum suyagi — 3–5 dum umurtqasining qo'shilishidan hosil bo'ladi.",
  "Lineae transversae": "Ko'ndalang chiziqlar — dumg'aza umurtqalari qo'shilish izlari.",
  "Canalis sacralis": "Dumg'aza kanali — umurtqa kanalining davomi.",
  "Hiatus sacralis": "Dumg'aza yorig'i — dumg'aza kanalining pastki ochilishi.",
  "Cornu sacrale": "Dumg'aza suyagining shoxi.",
  "Cornu coccygeum": "Dum suyagining shoxi.",
  "Crista sacralis mediana": "O'rta (median) dumg'aza qirrasi — o'tkir qirrali o'siqchalarning qo'shilishidan.",
  "Crista sacralis medialis": "O'rta chiziqdagi dumg'aza qirrasi — bo'g'im o'siqchalarining qo'shilishidan.",
  "Crista sacralis lateralis": "Yon dumg'aza qirrasi — ko'ndalang o'siqchalarning qo'shilishidan.",
  "Tuberositas ossis sacri": "Dumg'aza suyagining do'mboqligi.",
};

/** Atama ta'rifini qaytaradi (yo'q bo'lsa undefined). */
export function termDef(term: string): string | undefined {
  return TERMS_INFO[term];
}
