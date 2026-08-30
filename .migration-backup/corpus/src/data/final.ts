/**
 * Yakuniy batafsil bo'limlar — nerv chigallari + teri/hid/ta'm.
 * Manba: A. Ahmedov "Anatomiya II jild" (2018), 302–330 va 406–409.
 */
import type { Question, SystemUnit } from "./types";

const q = (x: Question): Question => x;

/* ============================================================
   PERIFERIK NERV CHIGALLARI — batafsil
   ============================================================ */
export const PLEXUS_DETAIL: SystemUnit[] = [
  {
    id: "px-1",
    title: "Nerv chigallari — batafsil",
    icon: "brain",
    color: "#8B6CFF",
    intro: "Orqa miya nervlarining oldingi tarmoqlari o'zaro qo'shilib chigallar (plexus) hosil qiladi: bo'yin (plexus cervicalis), yelka (plexus brachialis), bel (plexus lumbalis) va dumg'aza (plexus sacralis). Yelka chigali qo'lni, bel-dumg'aza chigali esa oyoqni innervatsiya qiladi.",
    lessons: [
      {
        id: "l80",
        title: "Bo'yin va yelka chigallari",
        description: "Bo'yin chigali (C1–C4), yelka chigali (C5–Th1) va qo'l nervlari",
        xp: 35,
        minutes: 10,
        source: { book: "Anatomiya II jild", page: "306–316" },
        questions: [
          q({ type: "quiz", prompt: "Bo'yin chigali qaysi umurtqalar nervlaridan hosil bo'ladi?", options: ["C1–C4", "C5–Th1", "L1–L4", "S1–S4"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bo'yin chigali lotinchada qanday ataladi?", options: ["Plexus cervicalis", "Plexus brachialis", "Plexus lumbalis", "Plexus sacralis"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Diafragmani innervatsiya qiluvchi nerv qaysi?", options: ["N. phrenicus", "N. vagus", "N. radialis", "N. medianus"], answer: 0, difficulty: "hard", explanation: "N. phrenicus — bo'yin chigalidan (C3–C5) chiqib, diafragmani innervatsiya qiladi." }),
          q({ type: "quiz", prompt: "Yelka chigali qaysi nervlardan hosil bo'ladi?", options: ["C5–Th1", "C1–C4", "L1–L4", "S1–S4"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Yelka chigali lotinchada qanday ataladi?", options: ["Plexus brachialis", "Plexus cervicalis", "Plexus lumbalis", "Plexus sacralis"], answer: 0, difficulty: "easy", hint: "Brachium — yelka" }),
          q({ type: "quiz", prompt: "Bilakni yozuvchi va barmoqlarni ochuvchi nerv qaysi?", options: ["N. radialis", "N. medianus", "N. ulnaris", "N. musculocutaneus"], answer: 0, difficulty: "hard", explanation: "N. radialis — orqa guruh (yozuvchilar)." }),
          q({ type: "quiz", prompt: "Kaftning ko'p qismini innervatsiya qiluvchi nerv qaysi?", options: ["N. medianus", "N. radialis", "N. ulnaris", "N. axillaris"], answer: 0, difficulty: "hard", explanation: "N. medianus — kaftning ko'p qismini va 1–3 barmoqlarni." }),
          q({ type: "quiz", prompt: "Jimjiloqni innervatsiya qiluvchi nerv qaysi?", options: ["N. ulnaris", "N. medianus", "N. radialis", "N. musculocutaneus"], answer: 0, difficulty: "hard", explanation: "N. ulnaris — jimjiloq va kaftning medial qismi." }),
          q({ type: "quiz", prompt: "N. radialis qayerda shikastlansa qo'l panjasi osilib qoladi?", options: ["Yelka suyagi sohasida", "Bo'yinda", "Bilakda", "Son sohasida"], answer: 0, difficulty: "hard", explanation: "N. radialis yelka suyagi sulcus nervi radialis'da shikastlansa «osilib qolgan panja» bo'ladi." }),
          q({ type: "match", prompt: "Yelka chigali nervlarini moslang", pairs: [["N. radialis", "Yozuvchi nerv"], ["N. medianus", "Kaft o'rta qismi"], ["N. ulnaris", "Jimjiloq"], ["N. musculocutaneus", "Yelka old guruhi"]] }),
          q({ type: "tf", prompt: "Diafragma n. phrenicus (C3–C5) bilan innervatsiya qilinadi.", statement: true, difficulty: "hard" }),
        ],
      },
      {
        id: "l81",
        title: "Bel va dumg'aza chigallari",
        description: "Bel chigali (L1–L4), dumg'aza chigali (L4–S4), quymich nervi",
        xp: 35,
        minutes: 10,
        source: { book: "Anatomiya II jild", page: "319–330" },
        questions: [
          q({ type: "quiz", prompt: "Bel chigali qaysi nervlardan hosil bo'ladi?", options: ["L1–L4", "C5–Th1", "C1–C4", "S1–S4"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bel chigali lotinchada qanday ataladi?", options: ["Plexus lumbalis", "Plexus brachialis", "Plexus cervicalis", "Plexus sacralis"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Dumg'aza chigali lotinchada qanday ataladi?", options: ["Plexus sacralis", "Plexus lumbalis", "Plexus brachialis", "Plexus cervicalis"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Sonning oldingi guruhini innervatsiya qiluvchi nerv qaysi?", options: ["N. femoralis", "N. ischiadicus", "N. obturatorius", "N. tibialis"], answer: 0, difficulty: "hard", explanation: "N. femoralis — to'rt boshli son mushagini innervatsiya qiladi." }),
          q({ type: "quiz", prompt: "Tanadagi eng katta nerv qaysi?", options: ["N. ischiadicus (quymich nervi)", "N. femoralis", "N. medianus", "N. radialis"], answer: 0, difficulty: "medium", hint: "Ischiadicus — quymich" }),
          q({ type: "quiz", prompt: "Quymich nervi qaysi sohani innervatsiya qiladi?", options: ["Son orqa va boldirni", "Son oldini", "Qo'lni", "Yuzni"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Quymich nervi qaysi nervlarga bo'linadi?", options: ["N. tibialis va n. fibularis", "N. radialis va n. ulnaris", "N. femoralis va n. obturatorius", "N. medianus va n. axillaris"], answer: 0, difficulty: "hard", explanation: "N. ischiadicus → n. tibialis (orqa) va n. fibularis communis (lateral)." }),
          q({ type: "quiz", prompt: "Boldir orqa guruhini innervatsiya qiluvchi nerv qaysi?", options: ["N. tibialis", "N. fibularis", "N. femoralis", "N. obturatorius"], answer: 0, difficulty: "hard" }),
          q({ type: "quiz", prompt: "Quymich nervi og'rig'i (siatica) qayerda seziladi?", options: ["Son orqa va oyoq bo'ylab", "Qo'lda", "Bo'yinda", "Yuzda"], answer: 0, difficulty: "medium", explanation: "Siatica — n. ischiadicus bo'ylab og'riq, dumg'azadan oyoqqa tarqaladi." }),
          q({ type: "match", prompt: "Bel-dumg'aza chigali nervlarini moslang", pairs: [["N. femoralis", "Son old guruhi"], ["N. ischiadicus", "Quymich nervi"], ["N. tibialis", "Boldir orqa"], ["N. fibularis", "Boldir lateral"]] }),
          q({ type: "tf", prompt: "Quymich nervi (n. ischiadicus) tanadagi eng katta nervdir.", statement: true, difficulty: "medium" }),
        ],
      },
    ],
  },
];

/* ============================================================
   TERI, HID va TA'M — batafsil
   ============================================================ */
export const SKIN_DETAIL: SystemUnit[] = [
  {
    id: "sk-1",
    title: "Teri, hid va ta'm — batafsil",
    icon: "sparkles",
    color: "#20D9C5",
    intro: "Teri (cutis) organizmning eng katta a'zosi — epidermis (ustki) va derma (chin teri) qavatlaridan iborat. Hid biluv nervi (n. olfactorius) 15–20 ta hid tolalaridan, ta'm sezish esa til so'rg'ichlaridagi retseptorlardan tashkil topgan.",
    lessons: [
      {
        id: "l82",
        title: "Teri qavatlari va hosilalari",
        description: "Epidermis, derma, soch, tirnoq, ter va yog' bezlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "406–408" },
        questions: [
          q({ type: "quiz", prompt: "Teri lotinchada qanday ataladi?", options: ["Cutis", "Derma", "Epidermis", "Pilis"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Terining ustki qavati qanday ataladi?", options: ["Epidermis", "Derma", "Gipoderma", "Fascia"], answer: 0, difficulty: "medium", hint: "Epi — ustki" }),
          q({ type: "quiz", prompt: "Terining chuqur qavati (chin teri) qanday ataladi?", options: ["Derma", "Epidermis", "Gipoderma", "Cuticula"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Teri ostidagi yog' qavati qanday ataladi?", options: ["Gipoderma", "Epidermis", "Derma", "Fascia"], answer: 0, difficulty: "hard", hint: "Hypo — ostida" }),
          q({ type: "quiz", prompt: "Soch lotinchada qanday ataladi?", options: ["Pilus", "Unguis", "Glandula", "Cutis"], answer: 0, difficulty: "medium", hint: "Pilus — soch" }),
          q({ type: "quiz", prompt: "Tirnoq lotinchada qanday ataladi?", options: ["Unguis", "Pilus", "Cutis", "Glandula"], answer: 0, difficulty: "medium", hint: "Unguis — tirnoq" }),
          q({ type: "quiz", prompt: "Ter bezlari lotinchada qanday ataladi?", options: ["Glandulae sudoriferae", "Glandulae sebaceae", "Glandulae salivariae", "Glandulae endocrinae"], answer: 0, difficulty: "hard", hint: "Sudor — ter" }),
          q({ type: "quiz", prompt: "Yog' (moy) bezlari lotinchada qanday ataladi?", options: ["Glandulae sebaceae", "Glandulae sudoriferae", "Glandulae salivariae", "Glandulae endocrinae"], answer: 0, difficulty: "hard", hint: "Sebum — yog'" }),
          q({ type: "quiz", prompt: "Terining asosiy vazifalari qaysilar?", options: ["Himoya, issiqlik boshqaruvi, sezish", "Faqat himoya", "Faqat sezish", "Ovqat hazm qilish"], answer: 0, difficulty: "easy" }),
          q({ type: "match", prompt: "Teri qavatlari va hosilalarini moslang", pairs: [["Epidermis", "Ustki qavat"], ["Derma", "Chin teri"], ["Pilus", "Soch"], ["Unguis", "Tirnoq"]] }),
          q({ type: "tf", prompt: "Teri organizmdagi eng katta a'zo hisoblanadi.", statement: true, difficulty: "easy" }),
        ],
      },
      {
        id: "l83",
        title: "Hid va ta'm sezish",
        description: "Hid biluv nervi, hid retseptorlari, til so'rg'ichlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "407–409" },
        questions: [
          q({ type: "quiz", prompt: "Hid biluv nervi qanday ataladi?", options: ["N. olfactorius", "N. opticus", "N. trigeminus", "N. facialis"], answer: 0, difficulty: "medium", hint: "Olfactorius — hid biluv" }),
          q({ type: "quiz", prompt: "Hid biluv nervi nechta hid tolalaridan tashkil topgan?", options: ["15–20", "2–3", "5", "30–40"], answer: 0, difficulty: "hard", explanation: "15–20 ta hid biluv tolalari (fila olfactoria) g'alvirsimon plastinka orqali o'tadi." }),
          q({ type: "quiz", prompt: "Hid retseptorlari qayerda joylashgan?", options: ["Burun bo'shlig'ining hid sohasida", "Tilda", "Quloqda", "Ko'zda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Hid tolalari qaysi suyak orqali o'tadi?", options: ["G'alvirsimon suyak (ethmoidale)", "Ponasimon suyak", "Chakka suyagi", "Ensa suyagi"], answer: 0, difficulty: "hard", explanation: "Hid tolalari lamina cribrosa (g'alvirsimon plastinka) orqali o'tadi." }),
          q({ type: "quiz", prompt: "Ta'm retseptorlari qayerda joylashgan?", options: ["Til so'rg'ichlarida", "Burunda", "Quloqda", "Tanglayda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Ta'm sezish nervi qaysi?", options: ["N. facialis va n. glossopharyngeus", "N. opticus", "N. olfactorius", "N. vagus"], answer: 0, difficulty: "hard", explanation: "Ta'm — oldingi 2/3 til (n. facialis), orqa 1/3 (n. glossopharyngeus)." }),
          q({ type: "quiz", prompt: "Tilning qaysi qismida achchiq ta'm ko'proq seziladi?", options: ["Ildiz (orqa) qismida", "Uchida", "Yon qismida", "O'rtasida"], answer: 0, difficulty: "medium", explanation: "Achchiq — til ildizida, shirin — uchida, nordon — yonlarida." }),
          q({ type: "quiz", prompt: "Shirin ta'm asosan tilning qaysi qismida seziladi?", options: ["Uchida", "Ildizida", "Yonlarida", "O'rtasida"], answer: 0, difficulty: "hard" }),
          q({ type: "quiz", prompt: "Til so'rg'ichlari nechta turga bo'linadi?", options: ["4", "2", "3", "5"], answer: 0, difficulty: "hard", explanation: "Ip simon, qo'ziqorinsimon, bargsimon va ariqchali so'rg'ichlar." }),
          q({ type: "match", prompt: "Sezgi tuzilmalarini moslang", pairs: [["N. olfactorius", "Hid biluv"], ["Lamina cribrosa", "G'alvirsimon plastinka"], ["Papillae", "Til so'rg'ichlari"], ["Gustatio", "Ta'm sezish"]] }),
          q({ type: "tf", prompt: "Hid tolalari g'alvirsimon suyakning lamina cribrosa'si orqali o'tadi.", statement: true, difficulty: "hard" }),
        ],
      },
    ],
  },
];
