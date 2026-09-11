export type OrganId = 'heart' | 'brain' | 'lungs' | 'liver' | 'kidneys' | 'muscles' | 'skeleton' | 'nerves';

export interface QuizQuestion {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

export interface DiagramLabel {
  text: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  side: 'left' | 'right';
}

export interface Organ {
  id: OrganId;
  name: string;
  image: string;
  stats: string[];
  description: string;
  heroDescription: string[];
  labels: DiagramLabel[];
  facts: { title: string; text: string }[];
  questions: QuizQuestion[];
}

export const organs: Organ[] = [
  {
    id: 'heart',
    name: 'Yurak',
    image: '/images/heart.jpg',
    stats: ["4 ta bo'lim", '4 ta klapan', 'Uzluksiz qon aylanishi'],
    description: 'Har urish bilan tanangizga hayot beradi.',
    heroDescription: ["4 ta bo'lim", '4 ta klapan', 'Uzluksiz qon aylanishi.'],
    labels: [
      { text: 'Aorta', x: 166, y: 66, targetX: 249, targetY: 97, side: 'left' },
      { text: "O'ng bo'lmacha", x: 139, y: 206, targetX: 226, targetY: 204, side: 'left' },
      { text: "O'ng qorincha", x: 161, y: 326, targetX: 249, targetY: 313, side: 'left' },
      { text: "Chap bo'lmacha", x: 461, y: 172, targetX: 390, targetY: 169, side: 'right' },
      { text: 'Chap qorincha', x: 461, y: 285, targetX: 373, targetY: 282, side: 'right' },
    ],
    facts: [
      { title: "To'rt bo'lim, bitta mukammal tizim", text: "Yurak ikkita bo'lmacha va ikkita qorinchadan iborat. O'ng tomon qonni o'pkaga, chap tomon esa butun tanaga yuboradi." },
      { title: "Klapanlar bir yo'nalishni saqlaydi", text: "Yurakdagi to'rtta klapan qonning orqaga oqishiga yo'l qo'ymaydi. Ular har bir yurak urishida navbat bilan ochilib-yopiladi." },
      { title: 'Aorta: katta qon aylanishining boshlanishi', text: 'Kislorodga boy qon chap qorinchadan aortaga, undan esa tana a`zolariga tarqaladi.' },
    ],
    questions: [
      { question: "Inson yuragi nechta bo'limdan iborat?", answers: ['2 ta', '3 ta', '4 ta', '6 ta'], correct: 2, explanation: "Yurakda ikkita bo'lmacha va ikkita qorincha, jami to'rtta bo'lim bor." },
      { question: 'Aortaga qon yurakning qaysi qismidan chiqadi?', answers: ["O'ng bo'lmacha", 'Chap qorincha', "O'ng qorincha", "Chap bo'lmacha"], correct: 1, explanation: 'Chap qorincha kislorodga boy qonni aorta orqali butun tanaga haydaydi.' },
      { question: 'Yurak klapanlarining asosiy vazifasi nima?', answers: ['Kislorod ishlab chiqarish', 'Qonni filtrlash', 'Qon hujayralarini yaratish', 'Qonning orqaga oqishini oldini olish'], correct: 3, explanation: "Klapanlar qonning faqat bir yo'nalishda harakatlanishini ta`minlaydi." },
    ],
  },
  {
    id: 'brain',
    name: 'Miya',
    image: '/images/brain.jpg',
    stats: ['86 milliard neyron', '2 yarimshar', 'Boshqaruv markazi'],
    description: 'Fikr, xotira va harakatning ajoyib markazi.',
    heroDescription: ['Fikr. Xotira.', 'Nazorat.'],
    labels: [
      { text: 'Katta yarimsharlar', x: 150, y: 115, targetX: 247, targetY: 138, side: 'left' },
      { text: 'Miyacha', x: 458, y: 280, targetX: 372, targetY: 283, side: 'right' },
      { text: 'Miya ustuni', x: 163, y: 335, targetX: 290, targetY: 319, side: 'left' },
    ],
    facts: [
      { title: 'Tanangizning boshqaruv markazi', text: 'Miya sezgilar, harakat, nutq, fikrlash va xotirani boshqaradi. Unda taxminan 86 milliard neyron mavjud.' },
      { title: 'Ikki yarimshar birga ishlaydi', text: "Chap va o'ng yarimsharlar nerv tolalari orqali bog'langan. Ular ko'p vazifalarni birgalikda bajaradi." },
      { title: 'Miyacha muvozanatni saqlaydi', text: 'Miyacha harakatlarni aniq muvofiqlashtirish, tana holati va muvozanatni saqlashda ishtirok etadi.' },
    ],
    questions: [
      { question: 'Miyada taxminan nechta neyron mavjud?', answers: ['86 million', '86 milliard', '1 milliard', '206 ta'], correct: 1, explanation: 'Katta yoshli inson miyasida taxminan 86 milliard neyron mavjud.' },
      { question: 'Muvozanat va aniq harakatlarni qaysi qism boshqaradi?', answers: ['Miyacha', 'Aorta', 'Buyrak', 'Jigar'], correct: 0, explanation: 'Miyacha harakatlarni muvofiqlashtirish va muvozanatni saqlashga yordam beradi.' },
      { question: 'Miya nechta katta yarimshardan iborat?', answers: ['1 ta', '3 ta', '4 ta', '2 ta'], correct: 3, explanation: "Miya o'zaro bog'langan chap va o'ng katta yarimshardan iborat." },
    ],
  },
  {
    id: 'lungs',
    name: "O'pka",
    image: '/images/lungs.jpg',
    stats: ["2 ta o'pka", "5 ta bo'lak", 'Gaz almashinuvi'],
    description: 'Har bir nafasingiz ortidagi mukammal tizim.',
    heroDescription: ['Nafas olish', 'Hayot.'],
    labels: [
      { text: 'Traxeya', x: 168, y: 76, targetX: 299, targetY: 100, side: 'left' },
      { text: "O'ng o'pka", x: 136, y: 226, targetX: 238, targetY: 241, side: 'left' },
      { text: "Chap o'pka", x: 457, y: 226, targetX: 373, targetY: 242, side: 'right' },
    ],
    facts: [
      { title: 'Nafas olishning asosi', text: "O'pkalar havodan kislorodni qonga o'tkazadi va karbonat angidridni tanadan chiqaradi." },
      { title: 'Alveolalar: juda kichik, juda muhim', text: "Gaz almashinuvi millionlab mayda havo pufakchalari, ya`ni alveolalarda sodir bo'ladi." },
      { title: 'Ikki tomon bir xil emas', text: "O'ng o'pka uchta, chap o'pka esa ikkita bo'lakdan iborat. Chap tomonda yurak uchun joy bor." },
    ],
    questions: [
      { question: "O'pkada gaz almashinuvi qayerda sodir bo'ladi?", answers: ['Traxeyada', 'Alveolalarda', 'Qovurg`alarda', 'Yurakda'], correct: 1, explanation: 'Alveolalarning yupqa devorlari orqali kislorod va karbonat angidrid almashinadi.' },
      { question: "O'ng o'pka nechta bo'lakdan iborat?", answers: ['1 ta', '2 ta', '3 ta', '4 ta'], correct: 2, explanation: "O'ng o'pka uchta: yuqori, o'rta va pastki bo'lakdan iborat." },
      { question: 'Nafas chiqarishda qaysi gaz tanadan chiqariladi?', answers: ['Karbonat angidrid', 'Geliy', 'Vodorod', 'Ozon'], correct: 0, explanation: 'Hujayralarda hosil bo`lgan karbonat angidrid qon bilan o`pkaga keladi va chiqariladi.' },
    ],
  },
  {
    id: 'liver',
    name: 'Jigar',
    image: '/images/liver.jpg',
    stats: ['500+ vazifa', 'Modda almashinuvi', 'Himoya'],
    description: 'Tanangizning tinimsiz ishlaydigan laboratoriyasi.',
    heroDescription: ['Modda almashinuvi', 'Detoksikatsiya.'],
    labels: [
      { text: "O'ng bo'lak", x: 137, y: 171, targetX: 223, targetY: 200, side: 'left' },
      { text: "Chap bo'lak", x: 460, y: 165, targetX: 377, targetY: 189, side: 'right' },
      { text: "O't pufagi", x: 164, y: 319, targetX: 295, targetY: 297, side: 'left' },
    ],
    facts: [
      { title: '500 dan ortiq muhim vazifa', text: 'Jigar oziq moddalarni qayta ishlaydi, energiya zaxirasini saqlaydi va ko`plab muhim oqsillarni ishlab chiqaradi.' },
      { title: "O't suyuqligi hazmga yordam beradi", text: "Jigar ishlab chiqaradigan o't suyuqligi yog'larni hazm qilishga yordam beradi. U o't pufagida saqlanadi." },
      { title: 'Tabiiy himoya tizimi', text: 'Jigar dorilar va zararli moddalarni qayta ishlab, ularni tanadan chiqarishga tayyorlaydi.' },
    ],
    questions: [
      { question: "O't suyuqligini qaysi organ ishlab chiqaradi?", answers: ['Buyrak', 'Yurak', 'Jigar', 'Miya'], correct: 2, explanation: "O't suyuqligi jigarda ishlab chiqariladi va o't pufagida saqlanadi." },
      { question: "O't suyuqligi asosan nimani hazm qilishga yordam beradi?", answers: ["Yog'larni", 'Suvni', 'Minerallarni', 'Kislorodni'], correct: 0, explanation: "O't tarkibidagi moddalar yog'larning parchalanishi va so'rilishiga yordam beradi." },
      { question: 'Jigar energiyani asosan qaysi shaklda saqlaydi?', answers: ['Kalsiy', 'Kislorod', 'Kollagen', 'Glikogen'], correct: 3, explanation: 'Jigar glyukozani glikogenga aylantirib, energiya zaxirasi sifatida saqlaydi.' },
    ],
  },
  {
    id: 'kidneys',
    name: 'Buyrak',
    image: '/images/kidneys.jpg',
    stats: ['2 ta buyrak', 'Millionlab nefronlar', 'Filtrlash'],
    description: 'Tozalik va ichki muvozanatning posbonlari.',
    heroDescription: ['Filtrlash', 'Muvozanat', 'Hayotiy funksiyalar.'],
    labels: [
      { text: 'Buyrak arteriyasi', x: 147, y: 145, targetX: 270, targetY: 171, side: 'left' },
      { text: "Buyrak po'stlog'i", x: 457, y: 183, targetX: 376, targetY: 195, side: 'right' },
      { text: 'Siydik nayi', x: 157, y: 338, targetX: 275, targetY: 320, side: 'left' },
    ],
    facts: [
      { title: 'Qoningizning tabiiy filtri', text: 'Buyraklar qondagi chiqindi moddalar va ortiqcha suvni ajratib, siydik hosil qiladi.' },
      { title: 'Nefron: eng kichik ishchi birlik', text: 'Har bir buyrakda taxminan bir million nefron bor. Aynan ular qonni filtrlash vazifasini bajaradi.' },
      { title: 'Muvozanatni saqlash', text: 'Buyraklar tanadagi suv, tuzlar va kislota-ishqor muvozanatini tartibga solishda qatnashadi.' },
    ],
    questions: [
      { question: 'Buyrakning asosiy funksional birligi nima?', answers: ['Neyron', 'Alveola', 'Nefron', 'Mushak tolasi'], correct: 2, explanation: 'Nefron buyrakning filtrlash va siydik hosil qilishga javobgar funksional birligidir.' },
      { question: 'Odatda insonda nechta buyrak bo`ladi?', answers: ['1 ta', '2 ta', '3 ta', '4 ta'], correct: 1, explanation: 'Odatda insonda umurtqa pog`onasining ikki yonida ikkita buyrak joylashgan.' },
      { question: 'Buyraklar qaysi muvozanatni saqlashga yordam beradi?', answers: ['Faqat tana haroratini', 'Faqat ko`rishni', 'Faqat eshitishni', 'Suv va tuz muvozanatini'], correct: 3, explanation: 'Buyraklar ortiqcha suv va tuzlarni chiqarib, ichki muhit muvozanatini saqlaydi.' },
    ],
  },
  {
    id: 'muscles',
    name: 'Mushaklar',
    image: '/images/anatomy-light.jpg',
    stats: ['600+ mushak', 'Harakat', 'Kuch va muvozanat'],
    description: 'Har bir harakatingizni amalga oshiruvchi kuch.',
    heroDescription: ['Harakat.', 'Kuch. Muvozanat.'],
    labels: [
      { text: 'Deltasimon mushak', x: 149, y: 137, targetX: 237, targetY: 159, side: 'left' },
      { text: 'Katta ko`krak mushagi', x: 436, y: 221, targetX: 344, targetY: 235, side: 'right' },
      { text: 'Biseps', x: 162, y: 303, targetX: 226, targetY: 283, side: 'left' },
    ],
    facts: [
      { title: 'Harakat ortidagi kuch', text: 'Tanada 600 dan ortiq skelet mushaklari bor. Ular qisqarib, suyaklarni harakatga keltiradi.' },
      { title: 'Mushaklarning uch turi', text: 'Skelet, silliq va yurak mushaklari mavjud. Har bir tur o`ziga xos tuzilish va vazifaga ega.' },
      { title: 'Juft bo`lib ishlash', text: 'Ko`p mushaklar qarama-qarshi juftliklarda ishlaydi. Masalan, biseps qo`lni bukadi, triseps esa yozadi.' },
    ],
    questions: [
      { question: 'Inson tanasida nechta skelet mushagi bor?', answers: ['206 ta', '50 ta', '600 dan ortiq', '86 ta'], correct: 2, explanation: 'Inson tanasida 600 dan ortiq skelet mushaklari mavjud.' },
      { question: 'Bisepsning asosiy vazifasi nima?', answers: ['Qo`lni tirsakdan bukish', 'Oyoqni yozish', 'Nafas chiqarish', 'Ko`zni yumish'], correct: 0, explanation: 'Biseps qisqarganda qo`l tirsak bo`g`imida bukiladi.' },
      { question: 'Qaysi mushak turi ixtiyoriy boshqariladi?', answers: ['Yurak mushagi', 'Ichak mushagi', 'Qon tomir mushagi', 'Skelet mushagi'], correct: 3, explanation: 'Skelet mushaklarini ongli ravishda boshqarishimiz mumkin.' },
    ],
  },
  {
    id: 'skeleton',
    name: 'Skelet',
    image: '/images/skeleton.jpg',
    stats: ['206 ta suyak', 'Tayanch', 'Himoya va harakat'],
    description: 'Tanangizning mustahkam va tirik poydevori.',
    heroDescription: ['Tayanch. Himoya.', 'Harakat.'],
    labels: [
      { text: 'Bosh suyagi', x: 157, y: 55, targetX: 300, targetY: 62, side: 'left' },
      { text: 'Qovurg`alar', x: 450, y: 168, targetX: 347, targetY: 168, side: 'right' },
      { text: 'Yelka suyagi', x: 149, y: 214, targetX: 230, targetY: 216, side: 'left' },
      { text: 'Chanoq suyagi', x: 450, y: 355, targetX: 341, targetY: 350, side: 'right' },
    ],
    facts: [
      { title: '206 ta suyak, yagona tayanch', text: 'Katta yoshli inson skeleti odatda 206 ta suyakdan iborat. U tanaga shakl beradi va ichki a`zolarni himoya qiladi.' },
      { title: 'Eng uzun suyak', text: 'Son suyagi (femur) inson tanasidagi eng uzun va eng mustahkam suyak hisoblanadi.' },
      { title: 'Suyak ham tirik to`qima', text: 'Suyaklar doimiy yangilanib turadi. Ular kalsiy saqlaydi, suyak ko`migi esa qon hujayralarini hosil qiladi.' },
    ],
    questions: [
      { question: 'Inson tanasidagi eng uzun suyak qaysi?', answers: ['Femur (son suyagi)', 'Humerus (yelka suyagi)', 'Radius (bilak suyagi)', 'Ulna (tirsak suyagi)'], correct: 0, explanation: 'Femur, ya`ni son suyagi, inson tanasidagi eng uzun va mustahkam suyakdir.' },
      { question: 'Katta yoshli inson skeletida odatda nechta suyak bor?', answers: ['106 ta', '306 ta', '206 ta', '600 ta'], correct: 2, explanation: 'Katta yoshli inson skeleti odatda 206 ta suyakdan iborat.' },
      { question: 'Qon hujayralari asosan qayerda hosil bo`ladi?', answers: ['Suyak sirtida', 'Suyak ko`migida', 'Tog`ayda', 'Paylarda'], correct: 1, explanation: 'Qizil suyak ko`migi qon hujayralarini ishlab chiqaradi.' },
    ],
  },
  {
    id: 'nerves',
    name: 'Nerv tizimi',
    image: '/images/nervous.jpg',
    stats: ['Markaziy tizim', 'Periferik tizim', 'Nerv impulslari'],
    description: 'Tanangizning tezkor aloqa tarmog`i.',
    heroDescription: ['Sezgi. Aloqa.', 'Boshqaruv.'],
    labels: [
      { text: 'Bosh miya', x: 171, y: 55, targetX: 301, targetY: 54, side: 'left' },
      { text: 'Orqa miya', x: 455, y: 172, targetX: 310, targetY: 183, side: 'right' },
      { text: 'Periferik nervlar', x: 150, y: 294, targetX: 233, targetY: 278, side: 'left' },
    ],
    facts: [
      { title: 'Tezkor aloqa tarmog`i', text: 'Nerv tizimi tana qismlari orasida elektr va kimyoviy signallar orqali ma`lumot uzatadi.' },
      { title: 'Markaziy va periferik tizim', text: 'Markaziy nerv tizimi bosh miya va orqa miyadan iborat. Periferik nervlar ularni tananing boshqa qismlari bilan bog`laydi.' },
      { title: 'Reflekslar sizni himoya qiladi', text: 'Refleks bu ta`sirga tez, avtomatik javobdir. Issiq narsadan qo`lni tortib olish bunga misol bo`ladi.' },
    ],
    questions: [
      { question: 'Markaziy nerv tizimi nimalardan iborat?', answers: ['Yurak va tomirlar', 'Bosh miya va orqa miya', 'Mushaklar va suyaklar', 'O`pka va traxeya'], correct: 1, explanation: 'Bosh miya va orqa miya markaziy nerv tizimini tashkil qiladi.' },
      { question: 'Nerv tizimining asosiy hujayrasi nima?', answers: ['Eritrotsit', 'Nefron', 'Neyron', 'Alveola'], correct: 2, explanation: 'Neyronlar signallarni qabul qiluvchi va uzatuvchi nerv hujayralaridir.' },
      { question: 'Refleks nima?', answers: ['Ta`sirga tez va avtomatik javob', 'Faqat ongli harakat', 'Suyakning o`sishi', 'Qonning ivishi'], correct: 0, explanation: 'Reflekslar tez, avtomatik javob bo`lib, ko`pincha tanani xavfdan himoya qiladi.' },
    ],
  },
];

export function getOrgan(id: OrganId): Organ {
  return organs.find((organ) => organ.id === id) ?? organs[0];
}

export const learningPath: { name: string; organ: OrganId; initiallyComplete?: boolean }[] = [
  { name: 'Anatomiya asoslari', organ: 'brain', initiallyComplete: true },
  { name: 'Skelet tizimi', organ: 'skeleton', initiallyComplete: true },
  { name: 'Mushaklar tizimi', organ: 'muscles' },
  { name: 'Yurak va qon aylanishi', organ: 'heart' },
  { name: 'Nafas olish tizimi', organ: 'lungs' },
  { name: 'Nerv tizimi', organ: 'nerves' },
];