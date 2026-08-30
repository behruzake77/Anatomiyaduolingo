// ============================================================
// AnatomiLingo — Kontent bazasi (manba havolalari bilan)
// BOOK → CHAPTER → TOPIC → LESSON → STRUCTURES → QUESTIONS
// Manbalar: Anatomiya I/II jild (darslik) + Odam anatomiyasi Atlas (I/II)
// ============================================================

// ---------- Manbalar (kitoblar) ----------
const BOOKS = {
  p1: { id: "p1", title: "Anatomiya I jild", sub: "Suyaklar, bo'g'imlar, mushaklar, hazm va nafas a'zolari", author: "A. Ahmedov va boshq.", year: 2018, file: "Anatomiya_1jild_qism1..qism6b.pdf" },
  p2: { id: "p2", title: "Anatomiya II jild", sub: "Siydik-tanosil, endokrin, yurak-tomir, nerv, sezgi a'zolari", author: "A. Ahmedov va boshq.", year: 2018, file: "Ahmedov. anatomiya_2_jild.pdf" },
  at1: { id: "at1", title: "Odam anatomiyasi — Atlas, I jild", sub: "Suyaklar, bo'g'imlar, mushaklar, ichki a'zolar", author: "N.K. Ahmedov", year: 2004, file: "Atlas_1jild_qism1..qism3.pdf" },
  at2: { id: "at2", title: "Odam anatomiyasi — Atlas, II jild", sub: "Tomirlar, nerv sistemasi, sezgi a'zolari", author: "N.K. Ahmedov", year: 2005, file: "Atlas_2jild_qism1..qism3.pdf" }
};

// ---------- O'quv dasturi xaritasi ----------
// Har bir chapter (bo'lim) → topics (mavzular) → lessons (birliklar)
// source: {book, page} — kitobdagi aniq manba sahifasi
const CURRICULUM = [
  {
    chapter: "Osteologiya — suyaklar haqidagi ta'limot",
    book: "p1", page: "25–148",
    topics: [
      { topic: "Umurtqa pog'onasi", page: "33–45", units: ["u1", "u2", "u3", "u4"] },
      { topic: "Ko'krak qafasi suyaklari", page: "46–50", units: ["u5"] },
      { topic: "Qo'l skeleti", page: "51–71", units: ["u6"] },
      { topic: "Oyoq skeleti", page: "72–93", units: ["u7"] },
      { topic: "Kalla skeleti", page: "94–148", units: ["u8", "u9"] }
    ]
  },
  {
    chapter: "Artrologiya — suyaklarning qo'shilishi",
    book: "p1", page: "149–210",
    topics: [
      { topic: "Bo'g'imlar haqida ta'limot", page: "149–159", units: ["u10"] }
    ]
  },
  {
    chapter: "Miologiya — mushaklar haqidagi ta'limot",
    book: "p1", page: "211–312",
    topics: [
      { topic: "Mushaklar tizimi", page: "211–312", units: ["u11"] }
    ]
  },
  {
    chapter: "Splanxnologiya — ichki a'zolar",
    book: "p1", page: "313–425",
    topics: [
      { topic: "Hazm a'zolari", page: "314–391", units: ["u12"] },
      { topic: "Nafas a'zolari", page: "392–424", units: ["u13"] }
    ]
  },
  {
    chapter: "Siydik va tanosil apparati",
    book: "p2", page: "5–60",
    topics: [
      { topic: "Siydik a'zolari", page: "5–26", units: ["u14"] },
      { topic: "Jinsiy a'zolar tizimi", page: "27–60", units: ["u15"] }
    ]
  },
  {
    chapter: "Endokrin bezlar",
    book: "p2", page: "62–72",
    topics: [
      { topic: "Ichki sekretsiya bezlari", page: "62–72", units: ["u16"] }
    ]
  },
  {
    chapter: "Yurak va tomirlar tizimi (Angiologiya)",
    book: "p2", page: "74–212",
    topics: [
      { topic: "Yurak", page: "77–92", units: ["u17"] },
      { topic: "Qon tomirlar va limfa", page: "93–200", units: ["u17"] },
      { topic: "Immun tizimi a'zolari", page: "200–212", units: ["u17"] }
    ]
  },
  {
    chapter: "Nerv tizimi (Nevrologiya)",
    book: "p2", page: "213–371",
    topics: [
      { topic: "Markaziy nerv tizimi", page: "218–301", units: ["u18"] },
      { topic: "Periferik nerv tizimi", page: "302–352", units: ["u18"] },
      { topic: "Avtonom nerv tizimi", page: "353–371", units: ["u18"] }
    ]
  },
  {
    chapter: "Sezuv a'zolari",
    book: "p2", page: "372–410",
    topics: [
      { topic: "Ko'rish va eshitish a'zolari", page: "373–405", units: ["u19"] },
      { topic: "Teri, hid va ta'm", page: "406–409", units: ["u19"] }
    ]
  }
];

// ---------- Atlas xaritasi (tuzilma → atlas sahifasi) ----------
const ATLAS_MAP = {
  "Umurtqa pog'onasi": { atlas: "at1", page: "8–9", img: "assets/img/atlas/umurtqa.jpg" },
  "Yurak": { atlas: "at2", page: "6", img: "assets/img/atlas/yurak.jpg" }
};
