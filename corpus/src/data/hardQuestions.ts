/**
 * Yuqori saviyali (hard) savollar — klinik / amaliy / taqqoslash.
 * Har bir savol darslik faktlariga asoslangan (ixtiro emas).
 * Kalit: tizim id si → o'sha tizim oxirgi darsiga qo'shiladigan savollar.
 */
import type { Question } from "./types";

export const HARD_QUESTIONS: Record<string, Question[]> = {
  skeletal: [
    {
      type: "quiz",
      prompt:
        "Bo'yin sohasida uyqu arteriyasini bosib qon ketishini to'xtatish uchun qaysi umurtqaga bosiladi?",
      options: ["C1 (Atlas)", "C6 (tuberculum caroticum)", "C7 (prominens)", "Th1"],
      answer: 1,
      difficulty: "hard",
      explanation:
        "Tuberculum caroticum — C6 umurtqaning oldingi do'mboqchasi. Uyqu arteriyasi shu do'mboqchaga bosiladi.",
    },
    {
      type: "quiz",
      prompt: "Yelka suyagida sinishlar eng ko'p uchraydigan joy qaysi?",
      options: ["Collum anatomicum", "Collum chirurgicum", "Caput humeri", "Trochlea humeri"],
      answer: 1,
      difficulty: "hard",
      explanation:
        "Collum chirurgicum (jarrohlik bo'yni) — boshlardan pastroq toraygan joy, sinishlar ko'p uchraydi.",
    },
    {
      type: "quiz",
      prompt: "Atlas (C1)da quyidagilardan qaysi biri YO'Q?",
      options: ["Arcus anterior", "Massae laterales", "Corpus vertebrae", "Foramen transversarium"],
      answer: 2,
      difficulty: "hard",
      explanation: "Atlasda tana (corpus), qirrali o'simta va bo'g'im o'simtalari mavjud emas.",
    },
    {
      type: "quiz",
      prompt: "Dumg'azaning pastki tirqishi (hiatus sacralis) qaysi tibbiy muolaja uchun muhim?",
      options: ["Epidural anesteziya", "Oshqozon yuvish", "Traxeostomiya", "Tomir kateterizatsiyasi"],
      answer: 0,
      difficulty: "hard",
      explanation: "Hiatus sacralis — dumg'aza kanalining pastki ochilishi, epidural anesteziya nuqtasi.",
    },
  ],
  arthrology: [
    {
      type: "quiz",
      prompt: "Tizza bo'g'imida amortizator vazifasini bajaruvchi yarimoysimon tog'aylar qanday ataladi?",
      options: ["Discus", "Meniscus", "Labrum", "Cartilago"],
      answer: 1,
      difficulty: "hard",
      explanation: "Menisklar (meniscus) — tizza bo'g'imidagi yarimoysimon tog'ay plastinkalar.",
    },
    {
      type: "quiz",
      prompt: "Eng harakatchan (sharsimon) bo'g'im qaysi?",
      options: ["Articulatio coxae", "Articulatio genus", "Articulatio humeri", "Articulatio cubiti"],
      answer: 2,
      difficulty: "hard",
      explanation: "Yelka bo'g'imi (articulatio humeri) — sharsimon, eng harakatchan bo'g'im.",
    },
  ],
  muscular: [
    {
      type: "quiz",
      prompt: "Diafragma qisqarganda (pastga tushganda) nima sodir bo'ladi?",
      options: ["Nafas chiqariladi", "Nafas olinadi", "Yurak tezlashadi", "Hech narsa o'zgarmaydi"],
      answer: 1,
      difficulty: "hard",
      explanation: "Diafragma qisqarib pastga tushganda ko'krak bo'shlig'i kengayadi va nafas olinadi.",
    },
    {
      type: "quiz",
      prompt: "Axill payi (tovon payi) qaysi mushak guruhidan hosil bo'ladi?",
      options: ["M. quadriceps femoris", "M. triceps surae", "M. biceps femoris", "M. tibialis anterior"],
      answer: 1,
      difficulty: "hard",
      explanation: "Axill payi boldir orqa guruhidan — m. triceps surae'dan hosil bo'ladi.",
    },
  ],
  digestive: [
    {
      type: "quiz",
      prompt: "Oqsillarni parchalovchi ferment pepsin qaysi a'zoda ajraladi?",
      options: ["Og'iz bo'shlig'i", "Oshqozon", "Ingichka ichak", "Jigar"],
      answer: 1,
      difficulty: "hard",
      explanation: "Pepsin oshqozon shirasi tarkibida ajralib, oqsillarni parchalaydi.",
    },
    {
      type: "quiz",
      prompt: "Safro (o't) qayerda to'planadi va qayerga quyiladi?",
      options: ["Jigarda to'planib oshqozonga", "O't pufagida to'planib o'n ikki barmoqli ichakka", "Oshqozonda to'planib ichakka", "Taloqda"],
      answer: 1,
      difficulty: "hard",
      explanation: "Safro o't pufagida to'planadi va duodenum (o'n ikki barmoqli ichak)ga quyiladi.",
    },
  ],
  respiratory: [
    {
      type: "quiz",
      prompt: "Gaz almashinuvi (kislorod/CO₂) qayerda sodir bo'ladi?",
      options: ["Bronxlarda", "Kekirdakda", "Alveolalarda", "Hiqildoqda"],
      answer: 2,
      difficulty: "hard",
      explanation: "Alveolalar — gaz almashinuvi sodir bo'ladigan mayda havo pufakchalari.",
    },
    {
      type: "quiz",
      prompt: "Chap o'pka nechta bo'lakdan iborat va nima uchun kamroq?",
      options: ["3 bo'lak — yurak uchun joy", "2 bo'lak — yurak uchun joy", "2 bo'lak — jigar uchun", "4 bo'lak"],
      answer: 1,
      difficulty: "hard",
      explanation: "Chap o'pka 2 bo'lakli — yurak uchun joy (incisura cardiaca) qoldirilgan.",
    },
  ],
  circulatory: [
    {
      type: "quiz",
      prompt: "Kichik qon aylanish doirasining to'g'ri yo'nalishi qaysi?",
      options: [
        "O'ng qorincha → o'pka arteriyasi → o'pka → o'pka venalari → chap bo'lmacha",
        "Chap qorincha → aorta → tana → venalar → o'ng bo'lmacha",
        "O'ng bo'lmacha → aorta → o'pka → chap qorincha",
        "Chap bo'lmacha → o'pka → o'ng qorincha",
      ],
      answer: 0,
      difficulty: "hard",
      explanation:
        "Kichik doira: o'ng qorincha → truncus pulmonalis → o'pka → o'pka venalari → chap bo'lmacha.",
    },
    {
      type: "quiz",
      prompt: "O'rta yoshli odam yuragi bir daqiqada o'rtacha necha marta qisqaradi?",
      options: ["30–40", "70–75", "100–120", "150–180"],
      answer: 1,
      difficulty: "hard",
      explanation: "O'rtacha 70–75 marta (Atlas ma'lumoti).",
    },
  ],
  nervous: [
    {
      type: "quiz",
      prompt: "Miyacha (cerebellum) shikastlanganda qanday belgi kuzatiladi?",
      options: ["Ko'rish yo'qoladi", "Muvozanat va harakat muvofiqlashuvi buziladi", "Xotira yo'qoladi", "Ovoz yo'qoladi"],
      answer: 1,
      difficulty: "hard",
      explanation: "Miyacha muvozanat va harakat muvofiqlashtirishni boshqaradi.",
    },
    {
      type: "quiz",
      prompt: "Avtonom nerv tizimining qaysi qismi «kurash yoki qochish» reaksiyasini boshqaradi?",
      options: ["Parasimpatik", "Simpatik", "Somak", "Markaziy"],
      answer: 1,
      difficulty: "hard",
      explanation: "Simpatik qism stress («kurash yoki qochish») reaksiyasini boshqaradi.",
    },
  ],
  urinary: [
    {
      type: "quiz",
      prompt: "Siydik buyrakdan tashqariga qanday tartibda o'tadi?",
      options: [
        "Pelvis renalis → ureter → qovuq → urethra",
        "Urethra → qovuq → ureter → buyrak",
        "Qovuq → ureter → urethra",
        "Ureter → qovuq → buyrak",
      ],
      answer: 0,
      difficulty: "hard",
      explanation: "Jom → siydik nayi (ureter) → qovuq → siydik chiqarish nayi (urethra).",
    },
  ],
  endocrine: [
    {
      type: "quiz",
      prompt: "Gipofiz qayerda joylashgan?",
      options: ["Bo'yinda", "Ponasimon suyakning turk egari (sella turcica)da", "Qorin bo'shlig'ida", "Ko'krakda"],
      answer: 1,
      difficulty: "hard",
      explanation: "Gipofiz ponasimon suyakning sella turcica (turk egari) chuqurligida joylashgan.",
    },
  ],
  sensory: [
    {
      type: "quiz",
      prompt: "Eshitish retseptorlari (Korti a'zosi) qayerda joylashgan?",
      options: ["O'rta quloqda", "Tashqi quloqda", "Ichki quloq chig'anog'ida", "Nog'ora pardada"],
      answer: 2,
      difficulty: "hard",
      explanation: "Eshitish retseptorlari ichki quloq chig'anog'ida (cochlea) joylashgan.",
    },
  ],
  reproductive: [
    {
      type: "quiz",
      prompt: "Bachadonning qaysi qavati har oyda yo'g'onlashib, urug'lanishga tayyorlanadi?",
      options: ["Serosa", "Myometrium", "Endometrium", "Perimetrium"],
      answer: 2,
      difficulty: "hard",
      explanation: "Endometrium — bachadon shilliq qavati, har oy urug'lanishga tayyorlanadi.",
    },
  ],
};

export const TOTAL_HARD = Object.values(HARD_QUESTIONS).reduce((s, arr) => s + arr.length, 0);
