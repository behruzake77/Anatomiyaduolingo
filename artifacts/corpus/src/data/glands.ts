/**
 * JINSIY + ENDOKRIN tizimlar (batafsil, kitobdan).
 * Manba: A. Ahmedov "Anatomiya II jild" (2018), 27–72-bet.
 */
import type { Question, SystemUnit } from "./types";

const q = (x: Question): Question => x;

/* ============================================================
   JINSIY TIZIM — batafsil
   ============================================================ */
export const REPRODUCTIVE_DETAIL: SystemUnit[] = [
  {
    id: "rp-1",
    title: "Erkak jinsiy a'zolari — batafsil",
    icon: "users",
    color: "#F472B6",
    intro: "Erkak jinsiy a'zolari ichki (moyak, moyak ortiq, urug' nay, prostata) va tashqi (jinsiy olat, yorg'oq) qismlarga bo'linadi. Moyak — juft bez, urug' hujayralari (spermatozoid) va gormon ishlab chiqaradi.",
    lessons: [
      {
        id: "l72",
        title: "Moyak va urug' yo'llari",
        description: "Moyak, moyak ortiq, urug' olib ketuvchi nay, urug' tizimchasi",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "29–40" },
        questions: [
          q({ type: "quiz", prompt: "Erkak jinsiy bezi qanday ataladi?", options: ["Moyak (testis)", "Tuxumdon", "Prostata", "Epididymis"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Moyak lotinchada qanday ataladi?", options: ["Testis", "Ovarium", "Epididymis", "Scrotum"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Moyak qanday bezlar turkumiga kiradi?", options: ["Aralash bez (tashqi va ichki sekretsiya)", "Faqat ichki", "Faqat tashqi", "Bez emas"], answer: 0, difficulty: "hard", explanation: "Moyak — aralash bez: spermatozoid (tashqi) va testosteron (ichki) ishlab chiqaradi." }),
          q({ type: "quiz", prompt: "Moyak ortig'i lotinchada qanday ataladi?", options: ["Epididymis", "Testis", "Ductus deferens", "Prostata"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Moyak ortig'ining qismlari qaysilar?", options: ["Boshi, tanasi, dumi", "Toj, bo'yin, ildiz", "Tana, ravoq, teshik", "Uchi, asosi, qanoti"], answer: 0, difficulty: "hard", explanation: "Caput (boshi), corpus (tanasi) va cauda (dumi)." }),
          q({ type: "quiz", prompt: "Urug' olib ketuvchi nay qanday ataladi?", options: ["Ductus deferens", "Ductus epididymidis", "Urethra", "Ureter"], answer: 0, difficulty: "medium", hint: "Deferens — olib ketuvchi" }),
          q({ type: "quiz", prompt: "Urug' olib ketuvchi nayning devori nechta qavatdan iborat?", options: ["3", "2", "4", "1"], answer: 0, difficulty: "hard", explanation: "Uch qavat: shilliq, mushak va tashqi (adventitsial)." }),
          q({ type: "quiz", prompt: "Prostata qayerda joylashgan?", options: ["Qovuq ostida", "Buyrak ustida", "Jigarda", "Moyakda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Prostata nima ishlab chiqaradi?", options: ["Spermatozoidlarni jadallashtiruvchi suyuqlik", "Safro", "Siydik", "Gormon"], answer: 0, difficulty: "hard", explanation: "Prostata urug' suyuqligining bir qismini — spermatozoidlar harakatini jadallashtiruvchi suyuqlik ishlab chiqaradi." }),
          q({ type: "quiz", prompt: "Urug' tizimchasi (vesicula seminalis) nima ishlab chiqaradi?", options: ["Urug' suyuqligi", "Spermatozoid", "Testosteron", "Siydik"], answer: 0, difficulty: "medium" }),
          q({ type: "match", prompt: "Erkak jinsiy a'zolarini moslang", pairs: [["Testis", "Moyak"], ["Epididymis", "Moyak ortig'i"], ["Ductus deferens", "Urug' nayi"], ["Prostata", "Prostata bezi"]] }),
          q({ type: "tf", prompt: "Moyak aralash bez bo'lib, spermatozoid va testosteron ishlab chiqaradi.", statement: true, difficulty: "hard" }),
        ],
      },
      {
        id: "l73",
        title: "Ayol jinsiy a'zolari — batafsil",
        description: "Tuxumdon, bachadon, bachadon nayi, qin",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "42–54" },
        questions: [
          q({ type: "quiz", prompt: "Ayol jinsiy bezi qanday ataladi?", options: ["Tuxumdon (ovarium)", "Moyak", "Bachadon", "Prostata"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Tuxumdon lotinchada qanday ataladi?", options: ["Ovarium", "Uterus", "Tuba", "Vagina"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Tuxum hujayra chiqaradigan pufakcha qanday ataladi?", options: ["Follikula", "Alveola", "Glomerula", "Nefron"], answer: 0, difficulty: "hard", explanation: "Follikula — tuxumdon ichidagi pufakcha, tuxum hujayra shu yerda yetiladi." }),
          q({ type: "quiz", prompt: "Bachadon lotinchada qanday ataladi?", options: ["Uterus", "Ovarium", "Tuba", "Vagina"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Bachadonning pastki toraygan qismi qanday ataladi?", options: ["Cervix uteri (bachadon bo'yni)", "Fundus uteri", "Corpus uteri", "Isthmus"], answer: 0, difficulty: "hard", hint: "Cervix — bo'yin" }),
          q({ type: "quiz", prompt: "Bachadonning yuqori gumbazsimon qismi qanday ataladi?", options: ["Fundus uteri", "Cervix uteri", "Corpus uteri", "Isthmus"], answer: 0, difficulty: "medium", hint: "Fundus — tub" }),
          q({ type: "quiz", prompt: "Bachadon nayi lotinchada qanday ataladi?", options: ["Tuba uterina", "Uterus", "Ovarium", "Vagina"], answer: 0, difficulty: "medium", hint: "Tuba — nay" }),
          q({ type: "quiz", prompt: "Bachadon nayining kengaygan uchki qismi qanday ataladi?", options: ["Infundibulum", "Ampulla", "Isthmus", "Fimbria"], answer: 0, difficulty: "hard", explanation: "Infundibulum — nayning voronkasimon kengaygan uchi." }),
          q({ type: "quiz", prompt: "Urug'lanish odatda qayerda sodir bo'ladi?", options: ["Bachadon nayida", "Bachadonda", "Tuxumdonda", "Qinda"], answer: 0, difficulty: "medium", explanation: "Urug'lanish odatda bachadon nayining ampulasida sodir bo'ladi." }),
          q({ type: "quiz", prompt: "Bachadon devorining ichki shilliq qavati qanday ataladi?", options: ["Endometrium", "Myometrium", "Perimetrium", "Serosa"], answer: 0, difficulty: "hard", explanation: "Endometrium — har oy yo'g'onlashib, urug'lanishga tayyorlanadigan ichki qavat." }),
          q({ type: "quiz", prompt: "Bachadon devorining mushak qavati qanday ataladi?", options: ["Myometrium", "Endometrium", "Perimetrium", "Serosa"], answer: 0, difficulty: "hard", hint: "Myo — mushak" }),
          q({ type: "match", prompt: "Ayol jinsiy a'zolarini moslang", pairs: [["Ovarium", "Tuxumdon"], ["Uterus", "Bachadon"], ["Tuba uterina", "Bachadon nayi"], ["Vagina", "Qin"]] }),
          q({ type: "tf", prompt: "Urug'lanish odatda bachadon nayida sodir bo'ladi.", statement: true, difficulty: "medium" }),
        ],
      },
    ],
  },
];

/* ============================================================
   ENDOKRIN — batafsil
   ============================================================ */
export const ENDOCRINE_DETAIL: SystemUnit[] = [
  {
    id: "en-1",
    title: "Endokrin bezlar — batafsil",
    icon: "activity",
    color: "#F59E0B",
    intro: "Endokrin bezlar gormonlar ishlab chiqarib, qonga ajratadi. Asosiylari: gipofiz, qalqonsimon, qalqon oldi, buyrak usti bezlari, oshqozon osti orolchalari va jinsiy bezlar.",
    lessons: [
      {
        id: "l74",
        title: "Gipofiz va qalqonsimon bez",
        description: "Gipofiz bo'laklari, qalqonsimon/qalqon oldi bezlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "62–72" },
        questions: [
          q({ type: "quiz", prompt: "Endokrin bezlar nima ajratadi?", options: ["Gormonlar", "Safro", "So'lak", "Fermentlar"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Gipofiz qayerda joylashgan?", options: ["Ponasimon suyakning turk egari (sella turcica)da", "Bo'yinda", "Qorinda", "Ko'krakda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Gipofizning oldingi bo'lagi qanday ataladi?", options: ["Adenogipofiz", "Neyrogipofiz", "Epifiz", "Timus"], answer: 0, difficulty: "hard", explanation: "Adenogipofiz — gipofizning oldingi (bezli) bo'lagi." }),
          q({ type: "quiz", prompt: "Gipofizning orqa bo'lagi qanday ataladi?", options: ["Neyrogipofiz", "Adenogipofiz", "Epifiz", "Timus"], answer: 0, difficulty: "hard", explanation: "Neyrogipofiz — gipofizning orqa (asab) bo'lagi." }),
          q({ type: "quiz", prompt: "Gipofiz qaysi tuzilma bilan bog'langan?", options: ["Gipotalamus", "Talamus", "Miyacha", "Ko'prik"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Qalqonsimon bez lotinchada qanday ataladi?", options: ["Glandula thyroidea", "Glandula parathyroidea", "Glandula suprarenalis", "Hypophysis"], answer: 0, difficulty: "medium", hint: "Thyroidea — qalqonsimon" }),
          q({ type: "quiz", prompt: "Qalqonsimon bez qayerda joylashgan?", options: ["Bo'yinda, hiqildoq oldida", "Qorinda", "Ko'krakda", "Chanoqda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Qalqonsimon bez qaysi gormon ishlab chiqaradi?", options: ["Tiroksin", "Insulin", "Adrenalin", "Testosteron"], answer: 0, difficulty: "hard", explanation: "Tiroksin — moddalar almashinuvini boshqaruvchi gormon." }),
          q({ type: "quiz", prompt: "Bolada qalqonsimon bez faoliyati pasaysa nima rivojlanadi?", options: ["Kretinizm", "Akromegaliya", "Qandli diabet", "Basedov kasalligi"], answer: 0, difficulty: "hard", explanation: "Kretinizm — bolalikda tiroksin yetishmasligi (jismoniy/ruhiy rivojlanish orqada qoladi)." }),
          q({ type: "quiz", prompt: "Qalqon oldi bezi qanday ataladi?", options: ["Glandula parathyroidea", "Glandula thyroidea", "Thymus", "Pancreas"], answer: 0, difficulty: "medium", hint: "Para — oldi" }),
          q({ type: "quiz", prompt: "Qalqon oldi bezi nechta?", options: ["4", "2", "6", "1"], answer: 0, difficulty: "hard", explanation: "To'rtta mayda qalqon oldi bezlari — qalqonsimon bez orqasida." }),
          q({ type: "quiz", prompt: "Qalqon oldi bezi qaysi modda almashinuvini boshqaradi?", options: ["Kaltsiy (paratgormon)", "Yod", "Glyukoza", "Natriy"], answer: 0, difficulty: "hard", explanation: "Paratgormon — qonda kaltsiy darajasini boshqaradi." }),
          q({ type: "match", prompt: "Endokrin bezlarni moslang", pairs: [["Hypophysis", "Gipofiz"], ["Glandula thyroidea", "Qalqonsimon"], ["Glandula parathyroidea", "Qalqon oldi"], ["Adenogipofiz", "Gipofiz old bo'lagi"]] }),
          q({ type: "tf", prompt: "Gipofiz gipotalamus bilan bog'langan va gormonlar ishlab chiqarishni boshqaradi.", statement: true, difficulty: "medium" }),
        ],
      },
      {
        id: "l75",
        title: "Buyrak usti va oshqozon osti orolchalari",
        description: "Buyrak usti bezi qavatlari, Langerhans orolchalari, g'urrasimon bez",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "66–72" },
        questions: [
          q({ type: "quiz", prompt: "Buyrak usti bezi lotinchada qanday ataladi?", options: ["Glandula suprarenalis", "Glandula thyroidea", "Hypophysis", "Thymus"], answer: 0, difficulty: "medium", hint: "Supra — ustida, renalis — buyrak" }),
          q({ type: "quiz", prompt: "Buyrak usti bezi qayerda joylashgan?", options: ["Buyrak ustida", "Buyrak ostida", "Jigarda", "Taloqda"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Buyrak usti bezining tashqi qavati qanday ataladi?", options: ["Po'stloq (cortex)", "Mag'iz (medulla)", "Nefron", "Glomerula"], answer: 0, difficulty: "hard", explanation: "Buyrak usti bezi po'stloq va mag'iz qavatlardan iborat." }),
          q({ type: "quiz", prompt: "Buyrak usti bezining mag'iz qavati qaysi gormon ishlab chiqaradi?", options: ["Adrenalin", "Kortizol", "Aldosteron", "Insulin"], answer: 0, difficulty: "hard", explanation: "Mag'iz qavat adrenalin (epinefrin) ishlab chiqaradi." }),
          q({ type: "quiz", prompt: "Buyrak usti po'stlog'i qaysi gormon ishlab chiqaradi?", options: ["Kortizol", "Adrenalin", "Insulin", "Tiroksin"], answer: 0, difficulty: "hard", explanation: "Po'stloq kortizol (stress gormoni) ishlab chiqaradi." }),
          q({ type: "quiz", prompt: "Langerhans orolchalari qayerda joylashgan?", options: ["Oshqozon osti bezida", "Jigarda", "Buyrakda", "Taloqda"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Langerhans orolchalari qaysi gormon ishlab chiqaradi?", options: ["Insulin", "Adrenalin", "Tiroksin", "Kortizol"], answer: 0, difficulty: "medium", explanation: "Beta-hujayralar insulin ishlab chiqaradi (glyukozani pasaytiradi)." }),
          q({ type: "quiz", prompt: "Insulin yetishmasligi qanday kasallikka olib keladi?", options: ["Qandli diabet", "Kretinizm", "Akromegaliya", "Basedov"], answer: 0, difficulty: "hard", explanation: "Insulin yetishmasa — qandli diabet (giperglikemiya)." }),
          q({ type: "quiz", prompt: "G'urrasimon bez (timus) lotinchada qanday ataladi?", options: ["Thymus", "Thyroidea", "Hypophysis", "Thyreoglossus"], answer: 0, difficulty: "medium", hint: "Thymus — g'urrasimon" }),
          q({ type: "quiz", prompt: "Timus (g'urrasimon bez) qanday vazifa bajaradi?", options: ["Immun tizimini shakllantiradi (T-limfotsitlar)", "Safro ishlab chiqaradi", "Siydik filtrlash", "Ovqat hazm qilish"], answer: 0, difficulty: "hard", explanation: "Timus — T-limfotsitlarning yetilish joyi (immunitet)." }),
          q({ type: "match", prompt: "Bezlarni vazifasi bilan moslang", pairs: [["Glandula suprarenalis", "Adrenalin/kortizol"], ["Langerhans orolchalari", "Insulin"], ["Thymus", "Immunitet"], ["Hypophysis", "Bosh bez"]] }),
          q({ type: "tf", prompt: "Adrenalin — buyrak usti bezining mag'iz qavatida ishlab chiqariladi.", statement: true, difficulty: "hard" }),
        ],
      },
    ],
  },
];
