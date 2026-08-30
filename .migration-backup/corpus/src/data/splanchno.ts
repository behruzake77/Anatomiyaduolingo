/**
 * SPLANXNOLOGIYA + SİYDİK — hazm, nafas va siydik tizimlari (batafsil).
 * Manba: A. Ahmedov "Anatomiya I jild" (313–424) va "Anatomiya II jild" (5–26).
 */
import type { Question, SystemUnit } from "./types";

const q = (x: Question): Question => x;

/* ============================================================
   HAZM TIZIMI — batafsil
   ============================================================ */
export const DIGESTIVE_DETAIL: SystemUnit[] = [
  {
    id: "di-1",
    title: "Og'iz bo'shlig'i va tishlar — batafsil",
    icon: "apple",
    color: "#F97316",
    intro: "Og'iz bo'shlig'i (cavitas oris) dahliz (vestibulum oris) va xususiy bo'shliqqa bo'linadi. Tish (dens) uch qismdan: toj (corona), bo'yin (collum) va ildiz (radix)dan iborat. Katta yoshda 32, bolalarda 20 sut tishi bo'ladi.",
    lessons: [
      {
        id: "l65",
        title: "Og'iz bo'shlig'i va tish tuzilishi",
        description: "Og'iz qismlari, tish formulasi, so'lak bezlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "317–328" },
        questions: [
          q({ type: "quiz", prompt: "Og'iz bo'shlig'i lotinchada qanday ataladi?", options: ["Cavitas oris", "Cavitas nasi", "Pharynx", "Vestibulum"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Og'iz bo'shlig'i nechta qismga bo'linadi?", options: ["2", "3", "4", "1"], answer: 0, difficulty: "medium", explanation: "Dahliz (vestibulum oris) va xususiy og'iz bo'shlig'i (cavitas oris propria)." }),
          q({ type: "quiz", prompt: "Tishning ko'rinib turgan qismi qanday ataladi?", options: ["Corona dentis (toj)", "Collum dentis", "Radix dentis", "Pulpa dentis"], answer: 0, difficulty: "medium", hint: "Corona — toj" }),
          q({ type: "quiz", prompt: "Tishning milka ichidagi qismi qanday ataladi?", options: ["Collum dentis (bo'yin)", "Corona", "Radix", "Enamelum"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Tishning eng qattiq tashqi qavati qaysi?", options: ["Enamelum (emal)", "Dentin", "Pulpa", "Cementum"], answer: 0, difficulty: "hard", explanation: "Emal — organizmdagi eng qattiq to'qima, tish tojini qoplaydi." }),
          q({ type: "quiz", prompt: "Katta yoshli odamda nechta doimiy tish bor?", options: ["32", "28", "20", "36"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Bolalarda nechta sut tishi bor?", options: ["20", "24", "28", "32"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Kesuvchi tishlar lotinchada qanday ataladi?", options: ["Dentes incisivi", "Dentes canini", "Dentes premolares", "Dentes molares"], answer: 0, difficulty: "medium", hint: "Incisivi — kesuvchi" }),
          q({ type: "quiz", prompt: "Qoziq tishlar lotinchada qanday ataladi?", options: ["Dentes canini", "Dentes incisivi", "Dentes molares", "Dentes premolares"], answer: 0, difficulty: "medium", hint: "Canis — it (qoziq)" }),
          q({ type: "quiz", prompt: "Eng katta so'lak bezi qaysi?", options: ["Quloq oldi bezi (glandula parotidea)", "Jag' osti bezi", "Til osti bezi", "Me'da bezi"], answer: 0, difficulty: "hard", hint: "Parotis — quloq oldi" }),
          q({ type: "quiz", prompt: "So'lak bezlari nechta yirik juft?", options: ["3", "2", "4", "5"], answer: 0, difficulty: "medium", explanation: "Uch juft: quloq oldi, jag' osti va til osti bezlari." }),
          q({ type: "match", prompt: "Tish qismlarini moslang", pairs: [["Corona dentis", "Tish toji"], ["Collum dentis", "Tish bo'yni"], ["Radix dentis", "Tish ildizi"], ["Enamelum", "Emal"]] }),
          q({ type: "tf", prompt: "Emal organizmdagi eng qattiq to'qima hisoblanadi.", statement: true, difficulty: "medium" }),
        ],
      },
      {
        id: "l66",
        title: "Oshqozon va qizilo'ngach — batafsil",
        description: "Oshqozon qismlari, shira, pepsin; qizilo'ngach",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "341–350" },
        questions: [
          q({ type: "quiz", prompt: "Oshqozon lotinchada qanday ataladi?", options: ["Gaster", "Hepar", "Pancreas", "Ventriculus cordis"], answer: 0, difficulty: "easy", hint: "Yunoncha gaster" }),
          q({ type: "quiz", prompt: "Oshqozonning kirish qismi qanday ataladi?", options: ["Cardia", "Fundus", "Corpus", "Pylorus"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Oshqozonning chiqish (pastki) qismi qanday ataladi?", options: ["Pylorus", "Cardia", "Fundus", "Corpus"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Oshqozon gumbazi qanday ataladi?", options: ["Fundus gastricus", "Cardia", "Pylorus", "Antrum"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Oshqozon shirasida oqsillarni parchalovchi ferment qaysi?", options: ["Pepsin", "Amilaza", "Lipaza", "Tripsin"], answer: 0, difficulty: "hard", explanation: "Pepsin — oshqozonda oqsillarni parchalaydi (kislotali muhitda)." }),
          q({ type: "quiz", prompt: "Oshqozon shirasi tarkibidagi kislota qaysi?", options: ["Xlorid (tuz) kislota", "Sulfat kislota", "Sirka kislota", "Sut kislota"], answer: 0, difficulty: "medium", explanation: "HCl — oshqozon shirasi tarkibidagi xlorid kislota." }),
          q({ type: "quiz", prompt: "Qizilo'ngach lotinchada qanday ataladi?", options: ["Oesophagus", "Pharynx", "Gaster", "Duodenum"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Qizilo'ngach nechta qismdan iborat?", options: ["3 (bo'yin, ko'krak, qorin)", "2", "4", "1"], answer: 0, difficulty: "hard", explanation: "Bo'yin, ko'krak va qorin qismlari." }),
          q({ type: "quiz", prompt: "Oshqozon devori nechta qavatdan iborat?", options: ["3", "2", "4", "5"], answer: 0, difficulty: "hard", explanation: "Shilliq, mushak va seroz (tashqi) qavatlar." }),
          q({ type: "match", prompt: "Oshqozon qismlarini moslang", pairs: [["Cardia", "Kirish qismi"], ["Fundus", "Gumbaz"], ["Corpus", "Tana"], ["Pylorus", "Chiqish qismi"]] }),
          q({ type: "tf", prompt: "Pepsin oqsillarni kislotali muhitda parchalaydi.", statement: true, difficulty: "hard" }),
          q({ type: "quiz", prompt: "Qizilo'ngach ovqatni qaysi harakat bilan o'tkazadi?", options: ["Peristaltika", "Pulsatsiya", "Diffuziya", "Osmos"], answer: 0, difficulty: "medium", explanation: "Peristaltika — devor mushaklarining to'lqinsimon qisqarishi." }),
        ],
      },
      {
        id: "l67",
        title: "Jigar, oshqozon osti va qorinparda",
        description: "Jigar bo'laklari, o't pufagi, pancreas, peritoneum",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "372–391" },
        questions: [
          q({ type: "quiz", prompt: "Jigar lotinchada qanday ataladi?", options: ["Hepar", "Pancreas", "Lien", "Ren"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Jigar nechta bo'lakdan iborat?", options: ["2 (o'ng va chap)", "3", "4", "1"], answer: 0, difficulty: "medium", explanation: "O'ng (katta) va chap bo'lak." }),
          q({ type: "quiz", prompt: "Jigar organizmdagi eng katta bezmi?", options: ["Ha", "Yo'q, eng kichik", "Yo'q, o'pka", "Yo'q, buyrak"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Safro (o't) qayerda to'planadi?", options: ["O't pufagida (vesica biliaris)", "Oshqozonda", "Jigarda", "Ichakda"], answer: 0, difficulty: "medium", hint: "Vesica biliaris" }),
          q({ type: "quiz", prompt: "Safro qaysi moddalarni hazm qilishda muhim?", options: ["Yog'larni", "Oqsillarni", "Uglevodlarni", "Vitaminlarni"], answer: 0, difficulty: "hard", explanation: "Safro yog'larni emulsiya qiladi (mayda tomchilarga bo'ladi)." }),
          q({ type: "quiz", prompt: "Oshqozon osti bezi lotinchada qanday ataladi?", options: ["Pancreas", "Hepar", "Lien", "Glandula"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Oshqozon osti bezi qanday funksiyalar bajaradi?", options: ["Hazm fermenti va gormon (insulin)", "Faqat safro", "Faqat gormon", "Faqat ferment"], answer: 0, difficulty: "hard", explanation: "Pancreas — tashqi sekretsiya (fermentlar) va endokrin (insulin/glukagon)." }),
          q({ type: "quiz", prompt: "Insulin qaysi bez orolchalarida ishlab chiqariladi?", options: ["Langerhans orolchalarida", "Jigar hujayralarida", "Buyrakda", "Taloqda"], answer: 0, difficulty: "hard", explanation: "Langerhans orolchalari — oshqozon osti bezining endokrin qismi." }),
          q({ type: "quiz", prompt: "Qorin bo'shlig'ini ichdan qoplovchi parda qanday ataladi?", options: ["Peritoneum", "Pleura", "Pericardium", "Fascia"], answer: 0, difficulty: "medium", hint: "Peritoneum — qorinparda" }),
          q({ type: "quiz", prompt: "Qorinparda nechta qavatdan iborat?", options: ["2 (parietal va visseral)", "3", "1", "4"], answer: 0, difficulty: "hard", explanation: "Parietal (devor) va visseral (a'zolarni qoplovchi) qavatlar." }),
          q({ type: "match", prompt: "Bezlarni moslang", pairs: [["Hepar", "Jigar"], ["Vesica biliaris", "O't pufagi"], ["Pancreas", "Oshqozon osti bezi"], ["Peritoneum", "Qorinparda"]] }),
          q({ type: "tf", prompt: "Jigar organizmdagi eng katta bezdir.", statement: true, difficulty: "easy" }),
        ],
      },
    ],
  },
];

/* ============================================================
   NAFAS TIZIMI — batafsil
   ============================================================ */
export const RESPIRATORY_DETAIL: SystemUnit[] = [
  {
    id: "re-1",
    title: "Hiqildoq va kekirdak — batafsil",
    icon: "wind",
    color: "#0EA5E9",
    intro: "Hiqildoq (larynx) tog'aylardan tashkil topgan bo'lib, ovoz hosil qiladi va nafas yo'lini himoya qiladi. Asosiy tog'aylar: qalqonsimon (thyroidea), halqasimon (cricoidea), hiqildoq qopqog'i (epiglottis) va cho'michsimon (arytenoidea).",
    lessons: [
      {
        id: "l68",
        title: "Hiqildoq tog'aylari va ovoz",
        description: "Qalqonsimon/halqasimon tog'ay, epiglottis, ovoz boylamlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "400–410" },
        questions: [
          q({ type: "quiz", prompt: "Hiqildoq lotinchada qanday ataladi?", options: ["Larynx", "Pharynx", "Trachea", "Pulmo"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Hiqildoqning eng katta tog'ayi qaysi?", options: ["Cartilago thyroidea", "Cartilago cricoidea", "Epiglottis", "Cartilago arytenoidea"], answer: 0, difficulty: "medium", hint: "Thyroidea — qalqonsimon" }),
          q({ type: "quiz", prompt: "Halqasimon tog'ay lotinchada qanday ataladi?", options: ["Cartilago cricoidea", "Cartilago thyroidea", "Epiglottis", "Arytenoidea"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Yutish paytida hiqildoq kirishini yopadigan tog'ay qaysi?", options: ["Epiglottis (hiqildoq qopqog'i)", "Thyroidea", "Cricoidea", "Arytenoidea"], answer: 0, difficulty: "medium", hint: "Epi — ustida" }),
          q({ type: "quiz", prompt: "Ovoz boylamlari qayerda joylashgan?", options: ["Hiqildoqda", "Kekirdakda", "O'pkada", "Burunda"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Cho'michsimon tog'ay qanday ataladi?", options: ["Cartilago arytenoidea", "Cartilago thyroidea", "Epiglottis", "Cartilago corniculata"], answer: 0, difficulty: "hard", hint: "Arytenoidea — cho'michsimon" }),
          q({ type: "quiz", prompt: "Ovoz boylamlari orasidagi yoriq qanday ataladi?", options: ["Rima glottidis", "Glottis", "Vestibulum", "Fissura"], answer: 0, difficulty: "hard", explanation: "Rima glottidis — ovoz boylamlari orasidagi yoriq." }),
          q({ type: "quiz", prompt: "Hiqildoqning eng tor joyi (ovoz hosil bo'ladi) qanday ataladi?", options: ["Glottis", "Trachea", "Bronchus", "Epiglottis"], answer: 0, difficulty: "hard", explanation: "Glottis — ovoz boylamlari va ular orasidagi yoriq." }),
          q({ type: "quiz", prompt: "Kekirdak lotinchada qanday ataladi?", options: ["Trachea", "Larynx", "Bronchus", "Pharynx"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Kekirdak nechta asosiy bronxga bo'linadi?", options: ["2", "3", "4", "1"], answer: 0, difficulty: "medium", hint: "O'ng va chap" }),
          q({ type: "quiz", prompt: "Kekirdakning asosini nima tashkil qiladi?", options: ["Tog'ay yarim halqalari", "Suyaklar", "Mushaklar", "Bog'lamlar"], answer: 0, difficulty: "medium", explanation: "16–20 ta tog'ay yarim halqalari kekirdakni ochiq tutadi." }),
          q({ type: "match", prompt: "Hiqildoq tog'aylarini moslang", pairs: [["Thyroidea", "Qalqonsimon"], ["Cricoidea", "Halqasimon"], ["Epiglottis", "Qopqoq"], ["Arytenoidea", "Cho'michsimon"]] }),
          q({ type: "tf", prompt: "Epiglottis yutish paytida hiqildoq kirishini yopib, ovqatning nafas yo'liga tushishini oldini oladi.", statement: true, difficulty: "medium" }),
        ],
      },
      {
        id: "l69",
        title: "O'pka va plevra — batafsil",
        description: "O'pka bo'laklari, hilum, plevra qavatlari, ko'ks oralig'i",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "416–424" },
        questions: [
          q({ type: "quiz", prompt: "O'pka lotinchada qanday ataladi?", options: ["Pulmo", "Trachea", "Pleura", "Bronchus"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "O'ng o'pka nechta bo'lakdan iborat?", options: ["3", "2", "4", "1"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Chap o'pka nechta bo'lakdan iborat?", options: ["2", "3", "4", "1"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Chap o'pka nima uchun kamroq bo'lakka ega?", options: ["Yurak uchun joy (incisura cardiaca)", "Jigar uchun", "Oshqozon uchun", "Taloq uchun"], answer: 0, difficulty: "hard", explanation: "Chap o'pkada yurak chuqurchasi (incisura cardiaca) bor." }),
          q({ type: "quiz", prompt: "Bronxlar, tomirlar va nervlar o'pkaga kiradigan joy qanday ataladi?", options: ["Hilum pulmonis", "Apex pulmonis", "Basis pulmonis", "Fissura"], answer: 0, difficulty: "hard", hint: "Hilum — darvoza" }),
          q({ type: "quiz", prompt: "O'pkani o'rab turuvchi parda qanday ataladi?", options: ["Pleura", "Peritoneum", "Pericardium", "Fascia"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Plevra nechta qavatdan iborat?", options: ["2 (parietal va visseral)", "3", "1", "4"], answer: 0, difficulty: "hard", explanation: "Parietal (ko'krak devoriga) va visseral (o'pkaga) qavatlar." }),
          q({ type: "quiz", prompt: "Plevra qavatlari orasidagi bo'shliq qanday ataladi?", options: ["Cavitas pleuralis", "Cavitas pericardii", "Cavitas peritonealis", "Mediastinum"], answer: 0, difficulty: "hard" }),
          q({ type: "quiz", prompt: "Ikkala o'pka orasidagi soha qanday ataladi?", options: ["Ko'ks oralig'i (mediastinum)", "Hilum", "Diafragma", "Plevra"], answer: 0, difficulty: "hard", hint: "Mediastinum — ko'ks oralig'i" }),
          q({ type: "quiz", prompt: "O'pkaning uchi qanday ataladi?", options: ["Apex pulmonis", "Basis pulmonis", "Hilum", "Lobus"], answer: 0, difficulty: "medium", hint: "Apex — uchi" }),
          q({ type: "match", prompt: "O'pka tuzilmalarini moslang", pairs: [["Pulmo", "O'pka"], ["Hilum pulmonis", "O'pka darvozasi"], ["Pleura", "O'pka pardasi"], ["Mediastinum", "Ko'ks oralig'i"]] }),
          q({ type: "tf", prompt: "O'ng o'pka chap o'pkadan kattaroq (3 bo'lak).", statement: true, difficulty: "easy" }),
        ],
      },
    ],
  },
];

/* ============================================================
   SIYDIK TIZIMI — batafsil
   ============================================================ */
export const URINARY_DETAIL: SystemUnit[] = [
  {
    id: "ur-1",
    title: "Buyrak — batafsil",
    icon: "droplet",
    color: "#22C55E",
    intro: "Buyrak (ren) qonni filtrlab siydik hosil qiladi. U po'stloq (cortex) va mag'iz (medulla) moddalardan iborat bo'lib, mag'iz piramidalardan tashkil topgan. Nefron — buyrakning funksional birligi.",
    lessons: [
      {
        id: "l70",
        title: "Buyrak qavatlari va nefron",
        description: "Cortex/medulla, piramidalar, jom, nefron tuzilishi",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "7–19" },
        questions: [
          q({ type: "quiz", prompt: "Buyrak lotinchada qanday ataladi?", options: ["Ren", "Hepar", "Lien", "Pulmo"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Buyrakning po'stloq moddasi qanday ataladi?", options: ["Cortex renalis", "Medulla renalis", "Pelvis renalis", "Capsula"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Buyrakning mag'iz (ichki) moddasi qanday ataladi?", options: ["Medulla renalis", "Cortex renalis", "Pelvis", "Capsula"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Mag'iz moddasi nechta piramidadan iborat?", options: ["10–15", "2–3", "20–30", "1"], answer: 0, difficulty: "hard", explanation: "Buyrak mag'izi 10–15 ta piramidadan (pyramides renales) iborat." }),
          q({ type: "quiz", prompt: "Buyrakning funksional birligi qanday ataladi?", options: ["Nefron", "Neyron", "Alveola", "Lobula"], answer: 0, difficulty: "hard", hint: "Nefron — filtrlovchi birlik" }),
          q({ type: "quiz", prompt: "Nefron qayerdan boshlanadi?", options: ["Buyrak tanachasidan (Malpigi tanachasi)", "Qovuqdan", "Siydik nayidan", "Jomdan"], answer: 0, difficulty: "hard", explanation: "Nefron buyrak tanachasi (glomerula + kapsula)dan boshlanadi." }),
          q({ type: "quiz", prompt: "Qon filtrlash (glomerula) qayerda sodir bo'ladi?", options: ["Buyrak tanachasida", "Qovuqda", "Siydik nayida", "Jomda"], answer: 0, difficulty: "medium", explanation: "Glomerula — kapillarlar to'pi, filtratsiya joyi." }),
          q({ type: "quiz", prompt: "Siydik yig'iladigan joy qanday ataladi?", options: ["Pelvis renalis (jom)", "Cortex", "Medulla", "Capsula"], answer: 0, difficulty: "medium", hint: "Pelvis — jom" }),
          q({ type: "quiz", prompt: "Buyrakning tashqi tola qobig'i qanday ataladi?", options: ["Capsula fibrosa", "Peritoneum", "Pleura", "Pericardium"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Buyraklar qayerda joylashgan?", options: ["Qorin bo'shlig'ining orqa devorida", "Ko'krakda", "Chanoqda", "Bo'yinda"], answer: 0, difficulty: "medium", explanation: "Buyraklar qorin orqa devorida, bel sohasida (retroperitoneal)." }),
          q({ type: "match", prompt: "Buyrak tuzilmalarini moslang", pairs: [["Cortex renalis", "Po'stloq modda"], ["Medulla renalis", "Mag'iz modda"], ["Pelvis renalis", "Jom"], ["Nefron", "Funksional birlik"]] }),
          q({ type: "tf", prompt: "Buyrak juft a'zo bo'lib, qonni filtrlab siydik hosil qiladi.", statement: true, difficulty: "easy" }),
        ],
      },
      {
        id: "l71",
        title: "Siydik yo'llari — batafsil",
        description: "Siydik nayi, qovuq qavatlari, siydik chiqarish nayi",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "20–26" },
        questions: [
          q({ type: "quiz", prompt: "Siydik nayi lotinchada qanday ataladi?", options: ["Ureter", "Urethra", "Uterus", "Uvula"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Siydik qopi (qovuq) lotinchada qanday ataladi?", options: ["Vesica urinaria", "Vesica biliaris", "Vesica seminalis", "Ureter"], answer: 0, difficulty: "medium", hint: "Vesica urinaria" }),
          q({ type: "quiz", prompt: "Siydik chiqarish nayi lotinchada qanday ataladi?", options: ["Urethra", "Ureter", "Uterus", "Uvula"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Siydik nayi (ureter) qayerdan boshlanadi?", options: ["Buyrak jomidan (pelvis renalis)", "Qovuqdan", "Buyrak po'stlog'idan", "Urethradan"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Siydik nayi nechta qavatdan iborat?", options: ["3 (shilliq, mushak, tashqi)", "2", "4", "1"], answer: 0, difficulty: "hard", explanation: "Shilliq, mushak va adventitsial (tashqi) qavatlar." }),
          q({ type: "quiz", prompt: "Qovuqning asosiy vazifasi?", options: ["Siydikni to'plash", "Qonni filtrlash", "Gormon ajratish", "Ovqat hazm qilish"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Qovuq devorining mushak qavati qanday ataladi?", options: ["Detruzor (m. detrusor)", "Diafragma", "Peristaltika", "Sfinkter"], answer: 0, difficulty: "hard", explanation: "M. detrusor — qovuqni bo'shatuvchi mushak qavati." }),
          q({ type: "quiz", prompt: "Siydikni qovuqda ushlab turuvchi mushak qanday ataladi?", options: ["Sfinkter", "Detruzor", "Peristaltika", "Diafragma"], answer: 0, difficulty: "medium", explanation: "Sfinkter — siydikni ushlab turuvchi halqasimon mushak." }),
          q({ type: "quiz", prompt: "Erkaklarda siydik chiqarish nayi qanday uzunlikda?", options: ["Uzun (18–20 sm)", "Qisqa (3–4 sm)", "O'rta", "Yo'q"], answer: 0, difficulty: "hard", explanation: "Erkaklarda urethra uzun (18–20 sm), ayollarda qisqa (3–4 sm)." }),
          q({ type: "match", prompt: "Siydik yo'llarini moslang", pairs: [["Ureter", "Siydik nayi"], ["Vesica urinaria", "Qovuq"], ["Urethra", "Siydik chiqarish nayi"], ["Pelvis renalis", "Buyrak jomi"]] }),
          q({ type: "tf", prompt: "Qovuq siydikni vaqtincha to'playdi va detruzor qisqarganda bo'shatadi.", statement: true, difficulty: "medium" }),
        ],
      },
    ],
  },
];
