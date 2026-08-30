/**
 * MIOLOGIYA (bo'yin va bosh) + ANGIOLOGIYA (tomirlar) — batafsil.
 * Manba: A. Ahmedov "Anatomiya I jild" (292–312) va "Anatomiya II jild" (97–183).
 */
import type { Question, SystemUnit } from "./types";

const q = (x: Question): Question => x;

/* ============================================================
   BO'YIN VA BOSH MUSHAKLARI — batafsil
   ============================================================ */
export const NECK_HEAD_MUSCLES: SystemUnit[] = [
  {
    id: "nh-1",
    title: "Bo'yin mushaklari — batafsil",
    icon: "activity",
    color: "#EC4899",
    intro: "Bo'yin mushaklari yuza, til osti suyagi (usti/osti) va chuqur guruhlarga bo'linadi. Eng muhim yuza mushak — to'sh-o'mrov-so'rg'ichsimon (m. sternocleidomastoideus) boshni buradi va egiadi.",
    lessons: [
      {
        id: "l76",
        title: "Bo'yin mushaklari",
        description: "Yuza, til osti va chuqur bo'yin mushaklari",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "295–303" },
        questions: [
          q({ type: "quiz", prompt: "Bo'yinning asosiy yuza mushagi qaysi?", options: ["M. sternocleidomastoideus", "M. trapezius", "M. platysma", "M. scalenus"], answer: 0, difficulty: "medium", hint: "Sterno-to'sh, cleido-o'mrov, mastoideus-so'rg'ichsimon" }),
          q({ type: "quiz", prompt: "To'sh-o'mrov-so'rg'ichsimon mushak qanday vazifa bajaradi?", options: ["Boshni buradi va egiadi", "Qo'lni ko'taradi", "Nafas oladi", "Kurakni aylantiradi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bo'yinning teri osti mushagi qanday ataladi?", options: ["M. platysma", "M. trapezius", "M. masseter", "M. scalenus"], answer: 0, difficulty: "hard", explanation: "Platysma — bo'yinning teri osti mushagi, yuzning pastki qismini pastga tortadi." }),
          q({ type: "quiz", prompt: "Til osti suyagidan yuqorida joylashgan mushaklar qanday ataladi?", options: ["Til osti usti mushaklari", "Til osti osti mushaklari", "Narvonsimon", "Chuvalchangsimon"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Til osti suyagi ostidagi mushaklar qanday vazifa bajaradi?", options: ["Til osti suyagini pastga tortadi", "Yuqoriga ko'taradi", "Boshni buradi", "Kurakni aylantiradi"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Narvonsimon mushaklar (mm. scaleni) qayerda joylashgan?", options: ["Bo'yinning yon tomonida", "Orqa tomonda", "Old tomonda", "Chuqur ichkarida"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Narvonsimon mushaklar qaysi suyaklarga birikadi?", options: ["Bo'yin umurtqalari va qovurg'alarga", "Kalla va to'sh", "Kurak va o'mrov", "Bel va chanoq"], answer: 0, difficulty: "hard", explanation: "Scalenilar bo'yin umurtqalari ko'ndalang o'simtalaridan I–II qovurg'alarga birikadi (nafasda yordamchi)." }),
          q({ type: "quiz", prompt: "Til osti usti mushaklarining innervatsiyasi qaysi?", options: ["Ansa cervicalis", "N. facialis", "N. trigeminus", "N. vagus"], answer: 0, difficulty: "hard", explanation: "Ansa cervicalis — bo'yin chigalidan til osti usti mushaklariga boradi." }),
          q({ type: "match", prompt: "Bo'yin mushaklarini moslang", pairs: [["M. sternocleidomastoideus", "To'sh-o'mrov-so'rg'ichsimon"], ["M. platysma", "Teri osti mushagi"], ["Mm. scaleni", "Narvonsimon"], ["Ansa cervicalis", "Bo'yin chigali halqasi"]] }),
          q({ type: "tf", prompt: "Sternocleidomastoideus boshni qarama-qarshi tomonga buradi va oldinga egiadi.", statement: true, difficulty: "hard" }),
        ],
      },
      {
        id: "l77",
        title: "Bosh (mimika va chaynov) mushaklari",
        description: "Mimika mushaklari, chaynov mushaklari (masseter, temporalis)",
        xp: 30,
        minutes: 9,
        source: { book: "Anatomiya I jild", page: "304–312" },
        questions: [
          q({ type: "quiz", prompt: "Mimika mushaklari qaysi nerv bilan innervatsiya qilinadi?", options: ["N. facialis (VII)", "N. trigeminus (V)", "N. vagus (X)", "N. hypoglossus (XII)"], answer: 0, difficulty: "medium", explanation: "Mimika mushaklarining barchasi yuz nervi (n. facialis) bilan." }),
          q({ type: "quiz", prompt: "Chaynov mushaklari qaysi nerv bilan innervatsiya qilinadi?", options: ["N. trigeminus (V)", "N. facialis (VII)", "N. vagus (X)", "N. hypoglossus (XII)"], answer: 0, difficulty: "hard", explanation: "Chaynov mushaklari — uch shoxli nervning uchinchi shoxi (n. mandibularis)." }),
          q({ type: "quiz", prompt: "Eng kuchli chaynov mushagi qaysi?", options: ["M. masseter", "M. temporalis", "M. pterygoideus medialis", "M. pterygoideus lateralis"], answer: 0, difficulty: "medium", hint: "Masseter — chaynovchi" }),
          q({ type: "quiz", prompt: "Chakka mushagi qanday ataladi?", options: ["M. temporalis", "M. masseter", "M. buccinator", "M. orbicularis"], answer: 0, difficulty: "medium", hint: "Tempus — chakka" }),
          q({ type: "quiz", prompt: "Peshona mushagi (epicranius peshona qorinchasi) qanday vazifa bajaradi?", options: ["Qoshni ko'taradi", "Qoshni tushiradi", "Ko'zni yumadi", "Labni buradi"], answer: 0, difficulty: "hard", explanation: "Peshona qorincha (venter frontalis) qoshlarni ko'taradi va peshonada burma hosil qiladi." }),
          q({ type: "quiz", prompt: "Qoshlarni bir-biriga yaqinlashtiruvchi mushak qaysi?", options: ["M. corrugator supercilii", "M. frontalis", "M. orbicularis oculi", "M. procerus"], answer: 0, difficulty: "hard", explanation: "Corrugator supercilii — qoshlar o'rtasida tik burma hosil qiladi." }),
          q({ type: "quiz", prompt: "Ko'zni aylana o'rab turuvchi mushak qaysi?", options: ["M. orbicularis oculi", "M. orbicularis oris", "M. buccinator", "M. frontalis"], answer: 0, difficulty: "medium", hint: "Orbicularis — aylana, oculus — ko'z" }),
          q({ type: "quiz", prompt: "Og'izni aylana o'rab turuvchi mushak qaysi?", options: ["M. orbicularis oris", "M. orbicularis oculi", "M. buccinator", "M. masseter"], answer: 0, difficulty: "medium", hint: "Oris — og'iz" }),
          q({ type: "quiz", prompt: "Yuzning chuqur mushagi (qizdo'ppi) qanday ataladi?", options: ["M. buccinator", "M. masseter", "M. temporalis", "M. zygomaticus"], answer: 0, difficulty: "hard", explanation: "Buccinator — yonoq mushagi, qizdo'ppini tortadi va ovqatni tishlar orasida ushlaydi." }),
          q({ type: "match", prompt: "Bosh mushaklarini moslang", pairs: [["M. masseter", "Chaynov mushak"], ["M. temporalis", "Chakka mushak"], ["M. orbicularis oculi", "Ko'z aylanasi"], ["M. buccinator", "Yonoq mushak"]] }),
          q({ type: "tf", prompt: "Mimika mushaklari suyakka emas, teriga birikib, yuz ifodalarini hosil qiladi.", statement: true, difficulty: "hard" }),
        ],
      },
    ],
  },
];

/* ============================================================
   TOMIRLAR — arteriya va venalar batafsil
   ============================================================ */
export const VESSELS_DETAIL: SystemUnit[] = [
  {
    id: "vs-1",
    title: "Arteriyalar — batafsil",
    icon: "heart",
    color: "#EF4444",
    intro: "Aorta ravog'idan bosh-bo'yin poyasi, chap umumiy uyqu va chap o'mrov osti arteriyalari chiqadi. Qo'l: o'mrov osti → qo'ltiq osti → yelka → bilak arteriyalari. Oyoq: son → taqim osti → boldir arteriyalari.",
    lessons: [
      {
        id: "l78",
        title: "Bosh, qo'l va oyoq arteriyalari",
        description: "Uyqu, qo'ltiq osti, yelka, bilak, son, taqim osti arteriyalari",
        xp: 35,
        minutes: 10,
        source: { book: "Anatomiya II jild", page: "98–148" },
        questions: [
          q({ type: "quiz", prompt: "Aorta ravog'idan nechta yirik tarmoq chiqadi?", options: ["3", "2", "4", "5"], answer: 0, difficulty: "hard", explanation: "Bosh-bo'yin poyasi (truncus brachiocephalicus), chap umumiy uyqu, chap o'mrov osti." }),
          q({ type: "quiz", prompt: "Qo'ltiq osti arteriyasi qanday ataladi?", options: ["A. axillaris", "A. subclavia", "A. brachialis", "A. radialis"], answer: 0, difficulty: "medium", hint: "Axilla — qo'ltiq" }),
          q({ type: "quiz", prompt: "Yelka arteriyasi qanday ataladi?", options: ["A. brachialis", "A. axillaris", "A. radialis", "A. ulnaris"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Yelka arteriyasi qayerda puls seziladi?", options: ["Tirsak sohasida", "Bilakda", "Qo'ltiqda", "Bo'yinda"], answer: 0, difficulty: "hard", explanation: "A. brachialis — tirsak sohasida, ikki boshli mushak ichki chetida bosiladi (qon bosimini o'lchash)." }),
          q({ type: "quiz", prompt: "Bilak arteriyalari qaysilar?", options: ["A. radialis va a. ulnaris", "A. brachialis va a. axillaris", "A. femoralis va a. poplitea", "A. carotis"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bilak sohasida puls qaysi arteriyada seziladi?", options: ["A. radialis", "A. ulnaris", "A. brachialis", "A. axillaris"], answer: 0, difficulty: "medium", explanation: "A. radialis — bilak ichki yuzasida puls seziladigan klassik joy." }),
          q({ type: "quiz", prompt: "Son arteriyasi qanday ataladi?", options: ["A. femoralis", "A. poplitea", "A. tibialis", "A. iliaca"], answer: 0, difficulty: "medium", hint: "Femur — son" }),
          q({ type: "quiz", prompt: "Taqim osti arteriyasi qanday ataladi?", options: ["A. poplitea", "A. femoralis", "A. tibialis", "A. fibularis"], answer: 0, difficulty: "hard", hint: "Poplitea — taqim" }),
          q({ type: "quiz", prompt: "Taqim osti arteriyasi qaysi arteriyalarga bo'linadi?", options: ["Oldingi va orqa boldir arteriyalariga", "Bilak arteriyalariga", "Uyqu arteriyalariga", "O'pka arteriyalariga"], answer: 0, difficulty: "hard", explanation: "A. poplitea → a. tibialis anterior va posterior." }),
          q({ type: "quiz", prompt: "Uyqu arteriyasi qanday ataladi?", options: ["A. carotis", "A. femoralis", "A. brachialis", "A. subclavia"], answer: 0, difficulty: "easy" }),
          q({ type: "match", prompt: "Arteriyalarni joylashuvi bilan moslang", pairs: [["A. axillaris", "Qo'ltiq osti"], ["A. brachialis", "Yelka"], ["A. radialis", "Bilak (puls)"], ["A. poplitea", "Taqim osti"]] }),
          q({ type: "tf", prompt: "Qon bosimi odatda yelka arteriyasida (a. brachialis) o'lchanadi.", statement: true, difficulty: "hard" }),
        ],
      },
      {
        id: "l79",
        title: "Venalar — batafsil",
        description: "Kavak venalar, bo'yin, qo'l va oyoq venalari, darvoza venasi",
        xp: 35,
        minutes: 10,
        source: { book: "Anatomiya II jild", page: "151–183" },
        questions: [
          q({ type: "quiz", prompt: "Yuqori kavak vena qanday ataladi?", options: ["V. cava superior", "V. cava inferior", "V. portae", "V. jugularis"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Pastki kavak vena qanday ataladi?", options: ["V. cava inferior", "V. cava superior", "V. portae", "V. femoralis"], answer: 0, difficulty: "medium" }),
          q({ type: "quiz", prompt: "Bo'yinning yirik venalari qanday ataladi?", options: ["Vv. jugulares", "Vv. femorales", "Vv. brachiales", "Vv. renales"], answer: 0, difficulty: "medium", hint: "Jugulum — bo'yinturuq" }),
          q({ type: "quiz", prompt: "Ichki bo'yinturuq vena qanday ataladi?", options: ["V. jugularis interna", "V. jugularis externa", "V. subclavia", "V. cava"], answer: 0, difficulty: "hard", explanation: "V. jugularis interna — bosh va bo'yindan qon yig'uvchi eng katta vena." }),
          q({ type: "quiz", prompt: "Qo'lning yuza venalari qaysilar?", options: ["V. cephalica va v. basilica", "V. femoralis", "V. poplitea", "V. jugularis"], answer: 0, difficulty: "hard", explanation: "V. cephalica (tashqi) va v. basilica (ichki) — qo'lning yuza venalari." }),
          q({ type: "quiz", prompt: "Oyoqning yuza venasi qaysi?", options: ["V. saphena magna", "V. femoralis", "V. poplitea", "V. cephalica"], answer: 0, difficulty: "hard", hint: "Saphena — yuza" }),
          q({ type: "quiz", prompt: "Vena qopqoqlari (klapanlar) qanday vazifa bajaradi?", options: ["Qonning teskari oqishini oldini oladi", "Qonni tezlashtiradi", "Suyak hosil qiladi", "Nerv o'tkazadi"], answer: 0, difficulty: "easy" }),
          q({ type: "quiz", prompt: "Darvoza venasi (v. portae) qaysi a'zodan o'tadi?", options: ["Jigardan", "O'pkadan", "Buyrakdan", "Yurakdan"], answer: 0, difficulty: "medium", explanation: "V. portae qorin a'zolaridan jigarga qon olib keladi (darvoza tizimi)." }),
          q({ type: "quiz", prompt: "Oyoq venalarida qon oqishiga nima yordam beradi?", options: ["Mushaklar qisqarishi va klapanlar", "Faqat yurak", "Faqat tortishish", "Hech narsa"], answer: 0, difficulty: "hard", explanation: "Mushak nasosi va vena klapanlari qonni yuqoriga (yurakka) haydaydi." }),
          q({ type: "match", prompt: "Venalarni moslang", pairs: [["V. cava superior", "Yuqori kavak"], ["V. jugularis interna", "Ichki bo'yinturuq"], ["V. cephalica", "Qo'l tashqi venasi"], ["V. portae", "Darvoza venasi"]] }),
          q({ type: "tf", prompt: "Venalarda klapanlar bo'lib, qon teskari oqishini oldini oladi.", statement: true, difficulty: "medium" }),
        ],
      },
    ],
  },
];
