/**
 * KENGAYTIRILGAN bo'limlar — kitobdan (chala qolgan mavzular).
 * Manba: A. Ahmedov "Anatomiya I jild" (bo'g'imlar 151–212, mushaklar 213–290)
 *        va "Anatomiya II jild" (arteriya/venalar 93–183).
 */
import type { Question, Lesson, SystemUnit } from "./types";

const q = (x: Question): Question => x;

/* ============================================================
   ARTROLOGIYA — bo'g'imlar (batafsil)
   ============================================================ */
export const ARTROLOGY_DETAIL: SystemUnit[] = [
  {
    id: "ar-1",
    title: "Bo'g'imlar — batafsil",
    icon: "link",
    color: "#06b6d4",
    intro: "Suyaklar uch xil: fibroz to'qima (junctura fibrosa), tog'ay (junctura cartilaginea) va suyak to'qimasi (synostosis) orqali birlashadi. Harakatchan bo'g'imlar (sinovial) esa bo'g'im yuzalari, xalta, bo'shliq va boylamlardan tashkil topgan.",
    lessons: [
      {
        id: "l47",
        title: "Birlashuv turlari va bo'g'im tasnifi",
        description: "Fibroz, tog'ay, suyak birikishlar; bo'g'im shakllari va o'qlari",
        xp: 25,
        minutes: 8,
        source: { book: "Anatomiya I jild", page: "151–159" },
        questions: [
          q({ type: "quiz", prompt: "Kalla suyaklarini biriktiruvchi tishli chok qanday ataladi?", options: ["Sutura squamosa", "Sutura serrata", "Sutura plana", "Symphysis"], answer: 1, difficulty: "medium", explanation: "Tishli chok (sutura serrata) — suyaklarning tishli chekkalari bir-biriga kirishib turadi." }),
          q({ type: "quiz", prompt: "Tog'ay orqali bo'ladigan birikish qanday ataladi?", options: ["Synostosis", "Syndesmosis", "Synchondrosis", "Sutura"], answer: 2, difficulty: "medium", explanation: "Synchondrosis — tog'ay to'qimasi orqali birikish (masalan, qovurg'a tog'aylari)." }),
          q({ type: "quiz", prompt: "Qov suyaklari orasidagi yarim bo'g'im (symphysis) qaysi turga kiradi?", options: ["Fibroz", "Tog'ay", "Suyak", "Sinovial"], answer: 1, difficulty: "medium", explanation: "Symphysis — tog'ay orqali yarimharakatchan birikish (symphysis pubica)." }),
          q({ type: "quiz", prompt: "Sinovial bo'g'imning asosiy elementlari qaysilar?", options: ["Yuzalar, xalta, bo'shliq, boylamlar", "Chok, tog'ay, suyak", "Tana, ravoq, teshik", "Qorin, pay, parda"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Bo'g'im yuzalarini qoplovchi silliq tog'ay qanday ataladi?", options: ["Cartilago articularis", "Capsula articularis", "Ligamentum", "Meniscus"], answer: 0, difficulty: "easy", hint: "Articularis — bo'g'imga oid" }),
          q({ type: "quiz", prompt: "Sharsimon bo'g'im lotinchada qanday ataladi?", options: ["Articulatio spheroidea", "Articulatio ellipsoidea", "Articulatio trochoidea", "Articulatio plana"], answer: 0, difficulty: "medium", hint: "Sphera — shar" }),
          q({ type: "quiz", prompt: "Bir o'qli bloksimon bo'g'im qanday ataladi?", options: ["Ginglymus", "Spheroidea", "Sellaris", "Ellipsoidea"], answer: 0, difficulty: "hard", explanation: "Ginglymus (blokli) — bir o'q atrofida bukiladi va yoziladi (masalan, barmoq bo'g'imlari)." }),
          q({ type: "quiz", prompt: "Egarli bo'g'imga misol qaysi?", options: ["Bosh barmoq kaft-usti bo'g'imi", "Tizza bo'g'imi", "Yelka bo'g'imi", "Chanoq-son bo'g'imi"], answer: 0, difficulty: "hard", explanation: "Bosh barmoqning kaft-usti bo'g'imi egarli (articulatio sellaris) — qarama-qarshi qo'yish imkonini beradi." }),
          q({ type: "match", prompt: "Bo'g'im turlarini moslang", pairs: [["Sutura serrata", "Tishli chok"], ["Synchondrosis", "Tog'ay birikish"], ["Synostosis", "Suyak birikish"], ["Symphysis", "Yarim bo'g'im"]] }),
          q({ type: "tf", prompt: "Sinovial bo'g'imda suyaklar orasida bo'shliq (cavitas articularis) bor.", statement: true, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Ko'p o'qli (har tomonga harakatlanadigan) bo'g'im qaysi?", options: ["Ginglymus", "Spheroidea", "Trochoidea", "Plana"], answer: 1, difficulty: "hard", explanation: "Sharsimon bo'g'im ko'p o'qli — uch o'q atrofida harakatlanadi." }),
        ],
      },
      {
        id: "l48",
        title: "Yelka va tirsak bo'g'imlari",
        description: "To'sh-o'mrov, yelka, tirsak va bilak bo'g'imlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "173–183" },
        questions: [
          q({ type: "quiz", prompt: "O'mrov suyagi to'sh suyagi bilan qanday bo'g'im hosil qiladi?", options: ["Articulatio sternoclavicularis", "Articulatio acromioclavicularis", "Articulatio humeri", "Articulatio cubiti"], answer: 0, difficulty: "easy", hint: "Sterno — to'sh" }),
          q({ type: "quiz", prompt: "O'mrovning akromion bilan bo'g'imi qanday ataladi?", options: ["Articulatio sternoclavicularis", "Articulatio acromioclavicularis", "Articulatio humeri", "Articulatio radiocarpea"], answer: 1, difficulty: "medium", hint: "Acromion + clavicula" }),
          q({ type: "quiz", prompt: "Yelka bo'g'imi (articulatio humeri) qanday shaklda?", options: ["Sharsimon (spheroidea)", "Blokli (ginglymus)", "Egarli (sellaris)", "Yassi (plana)"], answer: 0, difficulty: "medium", explanation: "Yelka bo'g'imi sharsimon — eng harakatchan bo'g'im." }),
          q({ type: "quiz", prompt: "Yelka bo'g'imining bo'g'im labi (labrum glenoidale) qaysi vazifani bajaradi?", options: ["Chuqurchani chuqurlashtiradi", "Bo'g'imni sovitadi", "Suyak hosil qiladi", "Nerv o'tkazadi"], answer: 0, difficulty: "hard", explanation: "Labrum glenoidale — cavitas glenoidalis'ni chuqurlashtirib, bo'g'imni mustahkamlaydi." }),
          q({ type: "quiz", prompt: "Tirsak bo'g'imi (articulatio cubiti) nechta bo'g'imdan iborat?", options: ["3", "1", "2", "4"], answer: 0, difficulty: "hard", explanation: "Uchta: humeroulnaris, humeroradialis va radioulnaris proximalis." }),
          q({ type: "quiz", prompt: "Yelka suyagi bloki (trochlea) bilan bo'g'im hosil qiluvchi suyak qaysi?", options: ["Bilak suyagi (ulna)", "Radius", "Kurak suyagi", "To'sh suyagi"], answer: 0, difficulty: "medium", explanation: "Trochlea humeri — ulnaning blokli chuqurchasi bilan bo'g'im hosil qiladi." }),
          q({ type: "quiz", prompt: "Bilakni ichkariga burish (pronatio) va tashqariga burish (supinatio) qaysi bo'g'imlarda sodir bo'ladi?", options: ["Radius va ulna orasidagi bo'g'imlarda", "Yelka bo'g'imida", "Tizza bo'g'imida", "Kaft bo'g'imlarida"], answer: 0, difficulty: "hard", explanation: "Pronatio/supinatio — radius ulna atrofida aylanadi (radioulnaris bo'g'imlari)." }),
          q({ type: "quiz", prompt: "Ikki boshli mushakning uzun boshi payi yelka bo'g'imi orqali qayerga boradi?", options: ["Sulcus intertubercularis orqali", "Foramen magnum orqali", "Canalis carpi orqali", "Hiatus sacralis orqali"], answer: 0, difficulty: "hard", explanation: "Biceps uzun boshi payi do'mboqchalararo egat (sulcus intertubercularis)dan o'tadi." }),
          q({ type: "match", prompt: "Bo'g'imlarni lotincha nomi bilan moslang", pairs: [["Articulatio humeri", "Yelka bo'g'imi"], ["Articulatio cubiti", "Tirsak bo'g'imi"], ["Articulatio radiocarpea", "Bilak-kaft bo'g'imi"], ["Articulatio acromioclavicularis", "Kurak-o'mrov bo'g'imi"]] }),
          q({ type: "tf", prompt: "Yelka bo'g'imi eng harakatchan bo'g'im, shuning uchun chiqishlar ko'p uchraydi.", statement: true, difficulty: "medium", explanation: "Katta harakatchanlik = kamroq barqarorlik, shuning uchun chiqish ko'p." }),
        ],
      },
      {
        id: "l49",
        title: "Chanoq-son va tizza bo'g'imlari",
        description: "Chanoq-son bo'g'imi boylamlari va tizza menisk/boylamlari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "191–203" },
        questions: [
          q({ type: "quiz", prompt: "Chanoq-son bo'g'imi (articulatio coxae) qaysi tuzilmalardan hosil bo'ladi?", options: ["Femur boshi va acetabulum", "Humerus va glenoidalis", "Tibia va femur", "Scapula va clavicula"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Acetabulum chuqurligini chuqurlashtiruvchi lab qanday ataladi?", options: ["Labrum acetabulare", "Labrum glenoidale", "Meniscus", "Discus"], answer: 0, difficulty: "medium", explanation: "Labrum acetabulare — chanoq bo'g'im chuqurchasini chuqurlashtiradi." }),
          q({ type: "quiz", prompt: "Chanoq-son bo'g'imining eng kuchli boylami qaysi?", options: ["Lig. iliofemorale", "Lig. ischiofemorale", "Lig. pubofemorale", "Lig. capitis femoris"], answer: 0, difficulty: "hard", explanation: "Lig. iliofemorale — tanadagi eng mustahkam boylamlardan biri." }),
          q({ type: "quiz", prompt: "Tizza bo'g'imida nechta menisk bor?", options: ["2", "1", "3", "4"], answer: 0, difficulty: "easy", hint: "Medial va lateral" }),
          q({ type: "quiz", prompt: "Yarimoysimon medial menisk lotinchada qanday ataladi?", options: ["Meniscus medialis", "Meniscus lateralis", "Discus articularis", "Labrum"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Tizzaning xochsimon boylamlari qaysilar?", options: ["Lig. cruciatum anterius et posterius", "Lig. collaterale mediale et laterale", "Lig. patellae", "Lig. popliteum"], answer: 0, difficulty: "medium", hint: "Cruciatum — xochsimon" }),
          q({ type: "quiz", prompt: "Son suyagining orqa xochsimon boylami qayerga birikadi?", options: ["Katta boldir orqa sohasiga", "Tizza qopqog'iga", "Kichik boldir boshiga", "Tovon suyagiga"], answer: 0, difficulty: "hard", explanation: "Lig. cruciatum posterius — tibianing orqa sohasiga birikadi." }),
          q({ type: "quiz", prompt: "Tizza qopqog'i (patella) qaysi mushak payi ichida joylashgan?", options: ["To'rt boshli son mushagi (quadriceps)", "Ikki boshli son mushagi", "Tikuvchi mushak", "Uch boshli boldir"], answer: 0, difficulty: "hard", explanation: "Patella m. quadriceps femoris payi ichida joylashgan sesamsimon suyak." }),
          q({ type: "match", prompt: "Boylamlarni moslang", pairs: [["Lig. iliofemorale", "Chanoq-son eng kuchli boylami"], ["Lig. cruciatum anterius", "Oldingi xochsimon boylam"], ["Meniscus medialis", "Ichki yarimoysimon"], ["Lig. patellae", "Tizza qopqog'i boylami"]] }),
          q({ type: "tf", prompt: "Chanoq-son bo'g'imi sharsimon (ko'p o'qli) bo'g'imdir.", statement: true, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Tizzada bukilish va yozish (ginglymus tipi) bilan birga qanday harakat ham bor?", options: ["Aylanish (rotatsiya)", "Sirpanish", "Qarama-qarshi qo'yish", "Olib ketish"], answer: 0, difficulty: "hard", explanation: "Tizza bukilganda ozgina aylanish ham mumkin (rotatsiya)." }),
        ],
      },
      {
        id: "l50",
        title: "To'piq va oyoq panjasi bo'g'imlari",
        description: "To'piq bo'g'imi va oyoq gumbazlari",
        xp: 25,
        minutes: 8,
        source: { book: "Anatomiya I jild", page: "204–212" },
        questions: [
          q({ type: "quiz", prompt: "To'piq bo'g'imi lotinchada qanday ataladi?", options: ["Articulatio talocruralis", "Articulatio genus", "Articulatio coxae", "Articulatio radiocarpea"], answer: 0, difficulty: "easy", hint: "Talus — oshiq suyagi" }),
          q({ type: "quiz", prompt: "To'piq bo'g'imini qaysi suyaklar hosil qiladi?", options: ["Tibia, fibula va talus", "Femur, tibia, patella", "Talus va calcaneus", "Tibia va femur"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Oyoq panjasining bo'ylama gumbazlari nechta?", options: ["5", "2", "3", "1"], answer: 0, difficulty: "hard", explanation: "Bo'ylama gumbazlar beshta — tovon suyagidan boshlanadi." }),
          q({ type: "quiz", prompt: "Oyoq gumbazlari qanday vazifa bajaradi?", options: ["Prujina (amortizatsiya) vazifasini", "Suyak hosil qiladi", "Qon aylantiradi", "Nerv o'tkazadi"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Tovon suyagi (calcaneus) ostida qaysi tuzilma joylashgan?", options: ["Tovon do'mbog'i (tuber calcanei)", "Malleolus medialis", "Tuberositas tibiae", "Processus styloideus"], answer: 0, difficulty: "medium", explanation: "Tuber calcanei — Axill payi birikadigan tovon do'mbog'i." }),
          q({ type: "quiz", prompt: "To'piqning tashqi bo'rtig'i (malleolus lateralis) qaysi suyakka tegishli?", options: ["Fibula", "Tibia", "Talus", "Calcaneus"], answer: 0, difficulty: "medium", hint: "Lateralis — tashqi" }),
          q({ type: "quiz", prompt: "Oyoq panjasining ko'ndalang gumbazi qayerdan o'tadi?", options: ["Kaft suyaklari sohasidan", "Tovon suyagidan", "Barmoqlardan", "To'piqdan"], answer: 0, difficulty: "hard", explanation: "Ko'ndalang gumbaz kaft usti suyaklari sohasidan o'tadi." }),
          q({ type: "quiz", prompt: "Yassioyoqlik (platypodia) nima?", options: ["Gumbazlarning yassilanishi", "Gumbazning balandlashuvi", "Suyak sinishi", "Bo'g'im chiqishi"], answer: 0, difficulty: "medium", explanation: "Yassioyoqlik — oyoq gumbazlarining pastga tushishi." }),
          q({ type: "match", prompt: "To'piq va panja atamalarini moslang", pairs: [["Articulatio talocruralis", "To'piq bo'g'imi"], ["Malleolus lateralis", "Tashqi to'piq"], ["Tuber calcanei", "Tovon do'mbog'i"], ["Arcus pedis", "Oyoq gumbazi"]] }),
          q({ type: "tf", prompt: "To'piq bo'g'imida bukilish (plantar flexio) va yozish (dorsal flexio) harakatlari bor.", statement: true, difficulty: "medium" }),
        ],
      },
    ],
  },
];

/* ============================================================
   MIOLOGIYA — mushaklar (batafsil)
   ============================================================ */
export const MYOLOGY_DETAIL: SystemUnit[] = [
  {
    id: "my-1",
    title: "Mushaklar — batafsil",
    icon: "activity",
    color: "#EC4899",
    intro: "Orqa mushaklari yuza va chuqur guruhlarga bo'linadi. Yuza mushaklar kurak va qo'lni harakatlantiradi (trapetsiya, keng orqa), chuqur mushaklar esa umurtqa pog'onasini tik tutadi.",
    lessons: [
      {
        id: "l51",
        title: "Orqa mushaklari",
        description: "Trapetsiyasimon, keng orqa, rombasimon va chuqur orqa mushaklari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "221–229" },
        questions: [
          q({ type: "quiz", prompt: "Trapetsiyasimon mushak (m. trapezius) qanday vazifa bajaradi?", options: ["Kurakni ko'taradi va yaqinlashtiradi", "Qo'lni bukadi", "Nafas chiqaradi", "Boshni buradi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Orqaning eng keng mushagi qanday ataladi?", options: ["M. latissimus dorsi", "M. trapezius", "M. rhomboideus", "M. erector spinae"], answer: 0, difficulty: "easy", hint: "Latissimus — keng" }),
          q({ type: "quiz", prompt: "Keng orqa mushagi qanday vazifa bajaradi?", options: ["Qo'lni keltiradi va ichkariga buradi", "Qo'lni uzoqlashtiradi", "Boshni egiadi", "Nafas oladi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Rombasimon mushak (m. rhomboideus) qayerda joylashgan?", options: ["Kurak va umurtqa pog'onasi orasida", "Yelka oldida", "Son sohasida", "Bo'yinda"], answer: 0, difficulty: "medium", explanation: "Rombasimon mushak kurakni umurtqa pog'onasiga tortadi." }),
          q({ type: "quiz", prompt: "Kurakni ko'taruvchi mushak qanday ataladi?", options: ["M. levator scapulae", "M. trapezius", "M. latissimus dorsi", "M. deltoideus"], answer: 0, difficulty: "medium", hint: "Levator — ko'taruvchi" }),
          q({ type: "quiz", prompt: "Umurtqa pog'onasini tik tutuvchi chuqur mushak qanday ataladi?", options: ["M. erector spinae", "M. trapezius", "M. rectus abdominis", "Diaphragma"], answer: 0, difficulty: "hard", explanation: "M. erector spinae — umurtqani yozadi va tik tutadi." }),
          q({ type: "quiz", prompt: "Pastki tishli orqa mushak (m. serratus posterior inferior) qanday vazifa bajaradi?", options: ["Qovurg'alarni tushiradi (nafas chiqarish)", "Qovurg'alarni ko'taradi", "Kurakni aylantiradi", "Boshni buradi"], answer: 0, difficulty: "hard" }),
          q({ type: "match", prompt: "Orqa mushaklarini moslang", pairs: [["M. trapezius", "Trapetsiyasimon mushak"], ["M. latissimus dorsi", "Keng orqa mushagi"], ["M. levator scapulae", "Kurakni ko'taruvchi"], ["M. erector spinae", "Umurtqani tiklovchi"]] }),
          q({ type: "tf", prompt: "Chuqur orqa mushaklari umurtqa pog'onasini tik tutadi va yozadi.", statement: true, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Katta ko'krak mushagi (m. pectoralis major) qanday vazifa bajaradi?", options: ["Qo'lni keltiradi va ichkariga buradi", "Qo'lni uzoqlashtiradi", "Boshni egiadi", "Nafas chiqaradi"], answer: 0, difficulty: "medium" }),
        ],
      },
      {
        id: "l52",
        title: "Qorin va diafragma mushaklari",
        description: "Qorin devori mushaklari, oq chiziq va diafragma",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "230–241" },
        questions: [
          q({ type: "quiz", prompt: "Qorin old devorining to'g'ri mushagi qanday ataladi?", options: ["M. rectus abdominis", "M. obliquus externus", "M. transversus abdominis", "M. quadratus lumborum"], answer: 0, difficulty: "easy", hint: "Rectus — to'g'ri" }),
          q({ type: "quiz", prompt: "Qorinning tashqi qiya mushagi qanday ataladi?", options: ["M. obliquus externus abdominis", "M. obliquus internus", "M. rectus", "M. transversus"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Qorinning eng chuqur mushagi qaysi?", options: ["M. transversus abdominis", "M. obliquus externus", "M. obliquus internus", "M. rectus abdominis"], answer: 0, difficulty: "hard", explanation: "M. transversus — tolalari ko'ndalang joylashgan eng chuqur qorin mushagi." }),
          q({ type: "quiz", prompt: "Ikki to'g'ri qorin mushagi orasidagi oq chiziq qanday ataladi?", options: ["Linea alba", "Linea aspera", "Linea terminalis", "Linea nuchae"], answer: 0, difficulty: "medium", hint: "Alba — oq" }),
          q({ type: "quiz", prompt: "To'g'ri qorin mushagidagi ko'ndalang pay tutamlari qanday ataladi?", options: ["Intersectiones tendineae", "Linea alba", "Aponeurosis", "Tendo"], answer: 0, difficulty: "hard", explanation: "Intersectiones tendineae — to'g'ri mushakdagi ko'ndalang pay tutamlari (kubikchalarni hosil qiladi)." }),
          q({ type: "quiz", prompt: "Diafragma qisqarganda nima sodir bo'ladi?", options: ["Gumbazi pastga tushadi, nafas olinadi", "Gumbazi ko'tariladi, nafas chiqariladi", "Yurak tezlashadi", "Hech narsa o'zgarmaydi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Diafragmaning asosiy teshiklari qaysilar?", options: ["Hiatus aorticus, oesophageus, cavalis", "Foramen magnum", "Foramen ovale", "Hiatus sacralis"], answer: 0, difficulty: "hard", explanation: "Diafragmada aorta, qizilo'ngach va pastki kavak vena teshiklari bor." }),
          q({ type: "quiz", prompt: "Qovurg'alararo mushaklar qanday ataladi?", options: ["Mm. intercostales", "Mm. obliqui", "Mm. pectorales", "Mm. scaleni"], answer: 0, difficulty: "medium", hint: "Inter — oraliq, costa — qovurg'a" }),
          q({ type: "match", prompt: "Qorin mushaklarini moslang", pairs: [["M. rectus abdominis", "To'g'ri qorin mushagi"], ["M. obliquus externus", "Tashqi qiya"], ["M. transversus abdominis", "Ko'ndalang mushak"], ["Linea alba", "Oq chiziq"]] }),
          q({ type: "tf", prompt: "Diafragma — asosiy nafas olish mushagi.", statement: true, difficulty: "easy" }),
        ],
      },
      {
        id: "l53",
        title: "Qo'l mushaklari",
        description: "Delta, ikki/uch boshli, bilak va kaft mushaklari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "242–263" },
        questions: [
          q({ type: "quiz", prompt: "Yelkani yumaloqlab turuvchi mushak qanday ataladi?", options: ["M. deltoideus", "M. trapezius", "M. biceps", "M. triceps"], answer: 0, difficulty: "easy", hint: "Delta — uchburchak" }),
          q({ type: "quiz", prompt: "Delta mushak qanday vazifa bajaradi?", options: ["Qo'lni uzoqlashtiradi", "Qo'lni keltiradi", "Bilakni bukadi", "Barmoqlarni ochadi"], answer: 0, difficulty: "medium", explanation: "M. deltoideus — qo'lni 90 gradusgacha uzoqlashtiradi." }),
          q({ type: "quiz", prompt: "Ikki boshli yelka mushagi (m. biceps brachii) qanday vazifa bajaradi?", options: ["Bilakni bukadi va supinatsiya qiladi", "Bilakni yozadi", "Yelkani uzoqlashtiradi", "Kurakni ko'taradi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Uch boshli yelka mushagi (m. triceps brachii) qanday vazifa bajaradi?", options: ["Bilakni yozadi", "Bilakni bukadi", "Qo'lni keltiradi", "Boshni buradi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bilakning oldingi guruh mushaklari asosan nima qiladi?", options: ["Kaft va barmoqlarni bukadi", "Kaftni yozadi", "Yelkani aylantiradi", "Kurakni ko'taradi"], answer: 0, difficulty: "medium", explanation: "Oldingi guruh — bukuvchilar (flexores)." }),
          q({ type: "quiz", prompt: "Bilakning orqa guruh mushaklari asosan nima qiladi?", options: ["Kaft va barmoqlarni yozadi", "Kaftni bukadi", "Yelkani uzoqlashtiradi", "Kurakni aylantiradi"], answer: 0, difficulty: "medium", explanation: "Orqa guruh — yozuvchilar (extensores)." }),
          q({ type: "quiz", prompt: "Bosh barmoqni qarama-qarshi qo'yuvchi mushak qanday ataladi?", options: ["M. opponens pollicis", "M. flexor pollicis", "M. abductor pollicis", "M. adductor pollicis"], answer: 0, difficulty: "hard", explanation: "Opponens pollicis — bosh barmoqni qarama-qarshi qo'yadi (oppositsiya)." }),
          q({ type: "match", prompt: "Qo'l mushaklarini moslang", pairs: [["M. deltoideus", "Delta mushak"], ["M. biceps brachii", "Ikki boshli mushak"], ["M. triceps brachii", "Uch boshli mushak"], ["M. opponens pollicis", "Bosh barmoq qarama-qarshi qo'yuvchi"]] }),
          q({ type: "tf", prompt: "Bilakning oldingi guruh mushaklari bukuvchilar, orqa guruh esa yozuvchilardir.", statement: true, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Kaft mushaklarining qaysi qismi bosh barmoq tepaligini (thenar) hosil qiladi?", options: ["Bosh barmoq mushaklari", "Jimjiloq mushaklari", "Chuvalchangsimon mushaklar", "Kaftlararo mushaklar"], answer: 0, difficulty: "hard", explanation: "Thenar — bosh barmoq tepaligi, uning mushaklari hosil qiladi." }),
        ],
      },
      {
        id: "l54",
        title: "Oyoq mushaklari",
        description: "Chanoq, son, boldir va panja mushaklari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "265–290" },
        questions: [
          q({ type: "quiz", prompt: "Chanoqning eng katta mushagi (dumba) qanday ataladi?", options: ["M. gluteus maximus", "M. iliopsoas", "M. piriformis", "M. gluteus minimus"], answer: 0, difficulty: "easy", hint: "Gluteus — dumba" }),
          q({ type: "quiz", prompt: "Dumba mushagi qanday vazifa bajaradi?", options: ["Sonni yozadi", "Sonni bukadi", "Tizzani bukadi", "Panjani aylantiradi"], answer: 0, difficulty: "medium", explanation: "M. gluteus maximus — sonni orqaga yozadi (turganda muhim)." }),
          q({ type: "quiz", prompt: "Sonning oldingi to'rt boshli mushagi qanday ataladi?", options: ["M. quadriceps femoris", "M. biceps femoris", "M. sartorius", "M. gracilis"], answer: 0, difficulty: "medium", hint: "Quadriceps — to'rt boshli" }),
          q({ type: "quiz", prompt: "To'rt boshli son mushagi qanday vazifa bajaradi?", options: ["Tizzani yozadi", "Tizzani bukadi", "Sonni uzoqlashtiradi", "Panjani bukadi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Tikuvchi mushak (m. sartorius) qayerda joylashgan?", options: ["Sonning old yuzasida qiya", "Sonning orqasida", "Boldirning orqasida", "Chanoqda"], answer: 0, difficulty: "hard", explanation: "M. sartorius — tanadagi eng uzun mushak, sonni qiya kesib o'tadi." }),
          q({ type: "quiz", prompt: "Sonning orqa guruhi (boldirni bukuvchi) qaysi mushakdan iborat?", options: ["M. biceps femoris", "M. quadriceps femoris", "M. rectus femoris", "M. vastus lateralis"], answer: 0, difficulty: "medium", hint: "Biceps femoris — ikki boshli" }),
          q({ type: "quiz", prompt: "Boldirning orqa yuzasidagi mushak (Axill payini hosil qiladi) qaysi?", options: ["M. triceps surae", "M. tibialis anterior", "M. quadriceps", "M. gastrocnemius"], answer: 0, difficulty: "medium", explanation: "M. triceps surae — gastrocnemius + soleus, Axill payini hosil qiladi." }),
          q({ type: "quiz", prompt: "Boldirning oldingi mushagi qanday ataladi?", options: ["M. tibialis anterior", "M. gastrocnemius", "M. soleus", "M. peroneus"], answer: 0, difficulty: "hard", explanation: "M. tibialis anterior — panjani orqaga bukadi (dorsal flexio)." }),
          q({ type: "match", prompt: "Oyoq mushaklarini moslang", pairs: [["M. gluteus maximus", "Dumba mushagi"], ["M. quadriceps femoris", "To'rt boshli son"], ["M. biceps femoris", "Ikki boshli son"], ["M. triceps surae", "Uch boshli boldir"]] }),
          q({ type: "tf", prompt: "Axill payi m. triceps surae'dan hosil bo'ladi va tovon do'mbog'iga birikadi.", statement: true, difficulty: "hard", explanation: "Axill payi (tendo calcaneus) tovon do'mbog'iga (tuber calcanei) birikadi." }),
        ],
      },
    ],
  },
];

/* ============================================================
   ANGIOLOGIYA — tomirlar (batafsil)
   ============================================================ */
export const ANGIOLOGY_DETAIL: SystemUnit[] = [
  {
    id: "ang-1",
    title: "Tomirlar — batafsil",
    icon: "heart",
    color: "#EF4444",
    intro: "Aorta — organizmdagi eng katta arteriya. U ko'tariluvchi, ravoq va tushuvchi qismlarga bo'linadi. Ravoqdan bosh va qo'lga, tushuvchi qismdan esa tanaga tarmoqlar chiqadi.",
    lessons: [
      {
        id: "l55",
        title: "Aorta tarmoqlari",
        description: "Aorta qismlari, ravoq tarmoqlari, uyqu arteriyalari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "97–150" },
        questions: [
          q({ type: "quiz", prompt: "Aortaning qismlari qaysilar?", options: ["Ko'tariluvchi, ravoq, tushuvchi", "Boshi, bo'yni, tanasi", "Uchi, asosi, qanoti", "Oldi, orqasi, yoni"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Aorta ravog'idan nechta yirik tarmoq chiqadi?", options: ["3", "2", "4", "5"], answer: 0, difficulty: "hard", explanation: "Uchta: bosh-bo'yin poyasi, chap umumiy uyqu va chap o'mrov osti arteriyalari." }),
          q({ type: "quiz", prompt: "Bosh va bo'yinni qon bilan ta'minlovchi arteriya qaysi?", options: ["A. carotis communis", "A. femoralis", "A. radialis", "A. tibialis"], answer: 0, difficulty: "easy", hint: "Carotis — uyqu" }),
          q({ type: "quiz", prompt: "Umumiy uyqu arteriyasi qaysi arteriyalarga bo'linadi?", options: ["Tashqi va ichki uyqu arteriyalari", "Aorta va o'pka", "Son va taqim", "Bilak va kaft"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Miyani qon bilan ta'minlovchi arteriya qaysi?", options: ["A. carotis interna", "A. carotis externa", "A. subclavia", "A. brachialis"], answer: 0, difficulty: "medium", explanation: "Ichki uyqu arteriyasi (a. carotis interna) bosh miyani ta'minlaydi." }),
          q({ type: "quiz", prompt: "Qo'lni qon bilan ta'minlovchi arteriya qaysi?", options: ["A. subclavia", "A. carotis", "A. femoralis", "A. poplitea"], answer: 0, difficulty: "medium", hint: "Subclavia — o'mrov osti" }),
          q({ type: "quiz", prompt: "Yelka arteriyasi qanday ataladi?", options: ["A. brachialis", "A. radialis", "A. ulnaris", "A. axillaris"], answer: 0, difficulty: "medium", hint: "Brachium — yelka" }),
          q({ type: "quiz", prompt: "Aortaning qorin qismi qaysi a'zolarni toq (visseral) tarmoqlar bilan ta'minlaydi?", options: ["Oshqozon, jigar, taloq, ichak", "O'pka", "Yurak", "Miya"], answer: 0, difficulty: "hard", explanation: "Qorin aortasining toq tarmoqlari — truncus coeliacus, a. mesenterica superior/inferior." }),
          q({ type: "quiz", prompt: "Oyoqni qon bilan ta'minlovchi asosiy arteriya qaysi?", options: ["A. femoralis", "A. brachialis", "A. radialis", "A. carotis"], answer: 0, difficulty: "medium", hint: "Femur — son" }),
          q({ type: "match", prompt: "Arteriyalarni moslang", pairs: [["A. carotis communis", "Uyqu arteriyasi"], ["A. subclavia", "O'mrov osti"], ["A. brachialis", "Yelka"], ["A. femoralis", "Son"]] }),
          q({ type: "tf", prompt: "Aorta — organizmdagi eng katta arteriya.", statement: true, difficulty: "easy" }),
        ],
      },
      {
        id: "l56",
        title: "Venalar tizimi",
        description: "Yuqori/pastki kavak venalar, darvoza venasi",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya II jild", page: "151–183" },
        questions: [
          q({ type: "quiz", prompt: "Venalar qonni qayerga olib boradi?", options: ["A'zolardan yurakka", "Yurakdan a'zolarga", "O'pkadan jigarga", "Buyrakdan qovuqqa"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Tananing yuqori qismidan qon yig'uvchi vena qaysi?", options: ["V. cava superior", "V. cava inferior", "V. portae", "V. jugularis"], answer: 0, difficulty: "medium", hint: "Superior — yuqori" }),
          q({ type: "quiz", prompt: "Tananing pastki qismidan qon yig'uvchi vena qaysi?", options: ["V. cava inferior", "V. cava superior", "V. portae", "V. subclavia"], answer: 0, difficulty: "medium", hint: "Inferior — pastki" }),
          q({ type: "quiz", prompt: "Venalarda qonning orqaga qaytishini oldini oluvchi tuzilma qanday ataladi?", options: ["Klapanlar (qopqoqlar)", "Meniskler", "Boylamlar", "Tog'aylar"], answer: 0, difficulty: "medium", explanation: "Venalardagi klapanlar qonning teskari oqishini oldini oladi." }),
          q({ type: "quiz", prompt: "Jigar darvoza venasi (v. portae) qaysi a'zolardan qon yig'adi?", options: ["Oshqozon, ichak, taloq, oshqozon osti bezidan", "O'pkadan", "Miyadan", "Yurakdan"], answer: 0, difficulty: "hard", explanation: "V. portae — juftlanmagan qorin a'zolaridan jigarga qon olib keladi." }),
          q({ type: "quiz", prompt: "Bo'yinning yirik venalari qanday ataladi?", options: ["Vv. jugulares", "Vv. femorales", "Vv. brachiales", "Vv. popliteae"], answer: 0, difficulty: "medium", hint: "Jugulum — bo'yinturuq" }),
          q({ type: "quiz", prompt: "Kichik qon aylanish doirasining venalari qaysilar?", options: ["Vv. pulmonales", "Vv. cavae", "V. portae", "Vv. renales"], answer: 0, difficulty: "hard", explanation: "O'pka venalari (vv. pulmonales) kislorodga boy qonni chap bo'lmachaga olib keladi." }),
          q({ type: "match", prompt: "Venalarni moslang", pairs: [["V. cava superior", "Yuqori kavak"], ["V. cava inferior", "Pastki kavak"], ["V. portae", "Darvoza venasi"], ["Vv. pulmonales", "O'pka venalari"]] }),
          q({ type: "tf", prompt: "O'pka arteriyalari kislorodga boy qon olib boradi.", statement: false, difficulty: "hard", explanation: "O'pka arteriyalari kislorodga KAMBAG'AL (venoz) qonni o'pkaga olib boradi — bu istisno." }),
          q({ type: "quiz", prompt: "Venalar arteriyalardan qaysi belgi bilan farqlanadi?", options: ["Yupqa devorli va klapanli", "Qalin devorli", "Klapansiz", "Doim pulsli"], answer: 0, difficulty: "medium" }),
        ],
      },
    ],
  },
];
