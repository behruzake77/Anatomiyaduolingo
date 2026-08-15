// ============================================================
// OSTEOOLOGIYA — suyaklar haqidagi to‘liq kontent (kitobdan)
// Manba: A. Ahmedov va boshq. "Anatomiya I jild" (2018), 25–148-bet
// ============================================================

import type { Question, Lesson, SystemUnit } from "./types";
export type { Question, Lesson, QuestionType } from "./types";

/** Osteologiya bo'limi (SystemUnit bilan bir xil tuzilishda). */
export type OsteologyUnit = SystemUnit;

/** Savolga aniq tip berish (literal torayishining oldini olish). */
const q = (x: Question): Question => x;

export const u1: OsteologyUnit = {
  id: "u1",
  title: "Umurtqa pog'onasi",
  icon: "bone",
  color: "#58cc02",
  intro: "Umurtqa pog'onasi (columna vertebralis) — tananing o'q skeleti bo'lib, 33–34 umurtqadan tashkil topadi: 7 bo'yin, 12 ko'krak, 5 bel, 5 dumg'aza (qo'shilib os sacrum hosil qiladi) va 3–5 dum umurtqasi. U orqa miyani himoya qiladi, tanani tik tutadi va harakatni ta'minlaydi.",
  lessons: [
    {
      id: "l1",
      title: "Bo'limlar bilan tanishuv",
      description: "Umurtqa pog'onasining bo'limlari va lotincha atamalari",
      xp: 20,
      minutes: 7,
      questions: [
        q({ type: "img", prompt: "Rasmda odam organizmining qaysi tuzilmasi ko\u2018rsatilgan?", image: "/img/skeleton.jpg", options: ["Odam skeleti", "Mushaklar tizimi", "Nafas a\u2019zolari", "Qon aylanish tizimi"], answer: 0, hint: "Suyaklar majmuasi — tayanch vazifasini bajaradi" }),

        q({ type: "quiz", prompt: "«Columna vertebralis» o'zbekchada nimani anglatadi?", options: ["Umurtqa pog'onasi", "Ko'krak qafasi", "Chanoq suyagi", "Elka kamari"], answer: 0, hint: "Columna — ustun, vertebralis — umurtqaga oid" }),
        q({ type: "quiz", prompt: "Bo'yin umurtqalari lotinchada qanday ataladi?", options: ["Vertebrae thoracicae", "Vertebrae cervicales", "Vertebrae lumbales", "Os sacrum"], answer: 1, hint: "Cervix — bo'yin" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Vertebrae cervicales", "Bo'yin umurtqalari"], ["Vertebrae thoracicae", "Ko'krak umurtqalari"], ["Vertebrae lumbales", "Bel umurtqalari"], ["Os sacrum", "Dumg'aza suyagi"]] }),
        q({ type: "quiz", prompt: "Dum suyagi lotinchada qanday ataladi?", options: ["Os sacrum", "Os coccygis", "Os ilium", "Os pubis"], answer: 1 }),
        q({ type: "build", prompt: "«Bel umurtqalari» atamasini yig'ing", answerText: "Vertebrae lumbales", extra: ["cervicales", "sacrum"] }),
        q({ type: "tf", prompt: "Os sacrum — bu dumg'aza suyagi.", statement: true }),
        q({ type: "quiz", prompt: "Umurtqa pog'onasi nechta bo'limdan iborat?", options: ["3", "4", "5", "6"], answer: 2, hint: "Bo'yin, ko'krak, bel, dumg'aza, dum" }),
        q({ type: "build", prompt: "«Ko'krak umurtqalari» atamasini yig'ing", answerText: "Vertebrae thoracicae", extra: ["lumbales", "coccygis"] }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Os coccygis", "Dum suyagi"], ["Columna vertebralis", "Umurtqa pog'onasi"], ["Vertebra", "Umurtqa"], ["Os", "Suyak"]] }),
      ],
    },
    {
      id: "l2",
      title: "Umurtqaning tuzilishi",
      description: "Umurtqaning asosiy tuzilmalari",
      xp: 20,
      minutes: 8,
      questions: [
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan tuzilma nomi?", image: "/img/corpus.jpg", options: ["Corpus vertebrae", "Arcus vertebrae", "Processus spinosus", "Foramen vertebrale"], answer: 0, hint: "Corpus — tana" }),
        q({ type: "quiz", prompt: "«Corpus vertebrae» nimani anglatadi?", options: ["Umurtqa ravog'i", "Umurtqa tanasi", "Umurtqa teshigi", "Umurtqa o'simtasi"], answer: 1 }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan tuzilma nomi?", image: "/img/arcus.jpg", options: ["Corpus vertebrae", "Processus transversus", "Arcus vertebrae", "Foramen intervertebrale"], answer: 2, hint: "Arcus — ravoq (yoy)" }),
        q({ type: "quiz", prompt: "Arcus vertebrae qaysi ikki qismdan iborat?", options: ["Corpus va foramen", "Pediculus va lamina", "Dens va apex", "Basis va apex"], answer: 1, hint: "Oyoqcha va plastinka" }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan teshik?", image: "/img/foramen_vertebrale.jpg", options: ["Foramen transversarium", "Foramen intervertebrale", "Foramen vertebrale", "Foramen sacrale"], answer: 2, hint: "Orqa miya shu teshikdan o'tadi" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Corpus vertebrae", "Umurtqa tanasi"], ["Arcus vertebrae", "Umurtqa ravog'i"], ["Foramen vertebrale", "Umurtqa teshigi"], ["Processus", "O'simta"]] }),
        q({ type: "build", prompt: "«Umurtqa ravog'i» atamasini yig'ing", answerText: "Arcus vertebrae", extra: ["corpus", "foramen"] }),
        q({ type: "quiz", prompt: "Pediculus arcus vertebrae — bu…", options: ["Ravoq plastinkasi", "Ravoq oyoqchasi", "Umurtqa tanasi", "Bo'g'im o'simtasi"], answer: 1 }),
        q({ type: "tf", prompt: "Foramen vertebrale ichidan orqa miya o'tadi.", statement: true }),
        q({ type: "quiz", prompt: "Lamina arcus vertebrae — bu…", options: ["Ravoq oyoqchasi", "Umurtqa teshigi", "Ravoq plastinkasi", "Ko'ndalang o'simta"], answer: 2 }),
      ],
    },
    {
      id: "l3",
      title: "O'simtalar (Processus)",
      description: "Umurtqa o'simtalari (processus)",
      xp: 20,
      minutes: 8,
      questions: [
        q({ type: "quiz", prompt: "Umurtqada nechta turdagi o'simta (processus) bor?", options: ["2", "3", "4", "5"], answer: 2, hint: "Spinosus, transversus, articularis superior va inferior" }),
        q({ type: "img", prompt: "Rasmda qaysi tuzilmalar YASHIL rangda ko'rsatilgan?", image: "/img/proc_transversus.jpg", options: ["Processus spinosus", "Processus transversus", "Processus articularis", "Corpus vertebrae"], answer: 1, hint: "Transversus — ko'ndalang" }),
        q({ type: "quiz", prompt: "«Processus spinosus» o'zbekchada…", options: ["Ko'ndalang o'simta", "Bo'g'im o'simtasi", "Qirrali (o'q) o'simta", "So'rg'ichsimon o'simta"], answer: 2 }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan o'simtalar?", image: "/img/proc_articularis.jpg", options: ["Processus articularis superior et inferior", "Processus spinosus", "Processus transversus", "Processus costarius"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Processus spinosus", "Qirrali o'simta"], ["Processus transversus", "Ko'ndalang o'simta"], ["Processus articularis superior", "Yuqorigi bo'g'im o'simtasi"], ["Processus articularis inferior", "Pastki bo'g'im o'simtasi"]] }),
        q({ type: "build", prompt: "«Yuqorigi bo'g'im o'simtasi» atamasini yig'ing", answerText: "Processus articularis superior", extra: ["inferior", "spinosus"] }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan teshik — ikki umurtqa orasidan nerv chiqadigan joy. U qanday ataladi?", image: "/img/foramen_intervertebrale.jpg", options: ["Foramen vertebrale", "Foramen transversarium", "Foramen intervertebrale", "Hiatus sacralis"], answer: 2, hint: "Inter — oraliq" }),
        q({ type: "tf", prompt: "Processus transversus — qirrali o'simta.", statement: false, explanation: "Processus transversus — ko'ndalang o'simta. Qirrali o'simta — processus spinosus." }),
        q({ type: "quiz", prompt: "Ikki umurtqa orasidagi teshik (nerv chiqadigan) qanday ataladi?", options: ["Foramen vertebrale", "Foramen intervertebrale", "Foramen transversarium", "Canalis sacralis"], answer: 1 }),
        q({ type: "build", prompt: "«Ko'ndalang o'simta» atamasini yig'ing", answerText: "Processus transversus", extra: ["articularis", "superior"] }),
      ],
    },
  ],
};

export const u2: OsteologyUnit = {
  id: "u2",
  title: "Bo'yin umurtqalari",
  icon: "bone",
  color: "#1cb0f6",
  intro: "Bo'yin umurtqalari 7 ta. Tuzilishiga ko'ra tipik (C3–C7) va atipik (C1 atlas, C2 axis) turlarga bo'linadi. Asosiy farqlovchi belgi — processus transversus'dagi foramen transversarium, undan a. vertebralis o'tadi.",
  lessons: [
    {
      id: "l4",
      title: "Tipik bo'yin umurtqasi",
      description: "Tipik bo'yin umurtqasi belgilari",
      xp: 20,
      minutes: 7,
      questions: [
        q({ type: "quiz", prompt: "Bo'yin umurtqalari tuzilishiga ko'ra qanday turlarga bo'linadi?", options: ["Katta va kichik", "Tipik va atipik", "Oldingi va orqa", "Yuqori va pastki"], answer: 1 }),
        q({ type: "quiz", prompt: "Bo'yin umurtqasini boshqa umurtqalardan ajratib turadigan MAXSUS teshik?", options: ["Foramen vertebrale", "Foramen intervertebrale", "Foramen transversarium", "Foramen sacrale"], answer: 2, hint: "Ko'ndalang o'simtadagi teshik" }),
        q({ type: "img", prompt: "Foramen transversarium ichidan qaysi tomir o'tadi?", image: "/img/foramen_transversarium.jpg", options: ["A. carotis", "A. vertebralis", "V. jugularis", "Aorta"], answer: 1, hint: "Umurtqa arteriyasi" }),
        q({ type: "quiz", prompt: "Bo'yin umurtqasining ko'ndalang o'simtasida qanday do'mboqchalar bor?", options: ["Tuberculum anterius va posterius", "Tuberculum majus va minus", "Cornu superius va inferius", "Crista mediana va lateralis"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Foramen transversarium", "Ko'ndalang o'simta teshigi"], ["Tuberculum anterius", "Oldingi do'mboqcha"], ["Tuberculum posterius", "Orqa do'mboqcha"], ["Typicus", "Tipik"]] }),
        q({ type: "img", prompt: "Rasmdagi umurtqalar qaysi bo'limga tegishli?", image: "/img/cervical_overview.jpg", options: ["Vertebrae lumbales", "Vertebrae thoracicae", "Vertebrae cervicales", "Os sacrum"], answer: 2 }),
        q({ type: "build", prompt: "«Ko'ndalang o'simta teshigi» atamasini yig'ing", answerText: "Foramen transversarium", extra: ["vertebrale", "intervertebrale"] }),
        q({ type: "tf", prompt: "Foramen transversarium barcha umurtqalarda uchraydi.", statement: false, explanation: "Bu teshik faqat bo'yin umurtqalarida bor." }),
        q({ type: "quiz", prompt: "Bo'yin umurtqalarining processus spinosus'i (C2–C6) qanday shaklda?", options: ["Uzun va bir uchli", "Uchi ikkiga ayrilgan (bifidus)", "Yumaloq", "Yo'q"], answer: 1 }),
      ],
    },
    {
      id: "l5",
      title: "Atlas (C1)",
      description: "Atlas (C1) tuzilishi",
      xp: 25,
      minutes: 8,
      questions: [
        q({ type: "quiz", prompt: "Birinchi bo'yin umurtqasi qanday nomlanadi?", options: ["Axis", "Atlas", "Vertebra prominens", "Promontorium"], answer: 1, hint: "Yunon afsonasidagi osmoni ko'targan pahlavon" }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan umurtqa?", image: "/img/atlas_green.jpg", options: ["Axis (C2)", "Atlas (C1)", "C7", "Th1"], answer: 1 }),
        q({ type: "quiz", prompt: "Atlasda quyidagilardan qaysi biri MAVJUD EMAS?", options: ["Arcus anterior", "Corpus vertebrae", "Massae laterales", "Foramen transversarium"], answer: 1, hint: "Atlasda tana, qirrali o'simta va bo'g'im o'simtalari yo'q" }),
        q({ type: "quiz", prompt: "Atlasning oldingi ravog'ida joylashgan, tish bilan bo'g'im hosil qiladigan chuqurcha?", options: ["Fovea costalis", "Fovea dentis", "Fovea articularis superior", "Facies auricularis"], answer: 1, hint: "Dens — tish" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Arcus anterior", "Oldingi ravoq"], ["Arcus posterior", "Orqa ravoq"], ["Massae laterales", "Yon massalar"], ["Fovea dentis", "Tish chuqurchasi"]] }),
        q({ type: "quiz", prompt: "Atlasning orqa ravog'i ustidagi egat (a. vertebralis o'tadigan)?", options: ["Sulcus costae", "Sulcus arteriae vertebralis", "Canalis sacralis", "Incisura vertebralis"], answer: 1 }),
        q({ type: "build", prompt: "«Tish chuqurchasi» atamasini yig'ing", answerText: "Fovea dentis", extra: ["costalis", "articularis"] }),
        q({ type: "tf", prompt: "Atlasda processus spinosus mavjud emas.", statement: true, explanation: "Atlasda corpus, processus spinosus va processus articularis yo'q." }),
        q({ type: "img", prompt: "Bosh suyagi bilan bo'g'im hosil qiladigan chuqurcha (atlasning yuqori yuzasida)?", image: "/img/atlas_labeled.jpg", options: ["Fovea articularis superior", "Fovea articularis inferior", "Fovea dentis", "Fovea costalis"], answer: 0 }),
        q({ type: "quiz", prompt: "Atlasning yon massalari qanday ataladi?", options: ["Corpus laterales", "Massae laterales", "Partes laterales", "Alae laterales"], answer: 1 }),
      ],
    },
    {
      id: "l6",
      title: "Axis (C2)",
      description: "Axis (C2) va tish",
      xp: 25,
      minutes: 7,
      questions: [
        q({ type: "quiz", prompt: "Ikkinchi bo'yin umurtqasi qanday nomlanadi?", options: ["Atlas", "Axis", "Prominens", "Sacrum"], answer: 1, hint: "Axis — o'q" }),
        q({ type: "img", prompt: "Axisning eng xarakterli tuzilmasi — tanadan yuqoriga ko'tarilgan «tish». Lotincha nomi?", image: "/img/axis_green.jpg", options: ["Dens", "Apex", "Cornu", "Crista"], answer: 0 }),
        q({ type: "quiz", prompt: "Dens axisning uchi qanday ataladi?", options: ["Basis dentis", "Collum dentis", "Apex dentis", "Corpus dentis"], answer: 2, hint: "Apex — uchi" }),
        q({ type: "quiz", prompt: "Dens axisning bo'yni qanday ataladi?", options: ["Apex dentis", "Collum dentis", "Cervix axis", "Radix dentis"], answer: 1 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Dens", "Tish"], ["Apex dentis", "Tish uchi"], ["Collum dentis", "Tish bo'yni"], ["Facies articularis anterior", "Oldingi bo'g'im yuzasi"]] }),
        q({ type: "img", prompt: "Rasmdagi umurtqa qaysi?", image: "/img/axis_labeled.jpg", options: ["Atlas (C1)", "Axis (C2)", "C7", "L1"], answer: 1 }),
        q({ type: "build", prompt: "«Tish uchi» atamasini yig'ing", answerText: "Apex dentis", extra: ["collum", "axis"] }),
        q({ type: "tf", prompt: "Dens atlasning fovea dentis'i bilan bo'g'im hosil qiladi.", statement: true }),
        q({ type: "quiz", prompt: "Densning oldingi va orqa bo'g'im yuzalari qanday ataladi?", options: ["Fovea anterior et posterior", "Facies articularis anterior et posterior", "Tuberculum anterius et posterius", "Arcus anterior et posterior"], answer: 1 }),
      ],
    },
    {
      id: "l7",
      title: "C3–C7 umurtqalar",
      description: "C3–C7, uyqu do'mboqchasi, prominens",
      xp: 25,
      minutes: 7,
      questions: [
        q({ type: "quiz", prompt: "6-bo'yin umurtqasining oldingi do'mboqchasi alohida nomga ega. U qanday ataladi?", options: ["Tuberculum posterius", "Tuberculum caroticum", "Tuberculum majus", "Promontorium"], answer: 1, hint: "Uyqu arteriyasini bosib qon oqishini to'xtatish mumkin" }),
        q({ type: "quiz", prompt: "Tuberculum caroticum o'zbekchada…", options: ["Uyqu do'mboqchasi", "Bo'yin do'mboqchasi", "Orqa do'mboqcha", "Tish do'mboqchasi"], answer: 0 }),
        q({ type: "quiz", prompt: "7-bo'yin umurtqasi (processus spinosus'i uzun, teridan bo'rtib turadi) qanday nomlanadi?", options: ["Atlas", "Axis", "Vertebra prominens", "Vertebra caroticum"], answer: 2, hint: "Prominens — bo'rtib chiquvchi" }),
        q({ type: "img", prompt: "Tuberculum caroticum qaysi umurtqada joylashgan?", image: "/img/cervical_labeled.jpg", options: ["C1", "C4", "C6", "C7"], answer: 2 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Tuberculum caroticum", "Uyqu do'mboqchasi (C6)"], ["Vertebra prominens", "Bo'rtib turuvchi umurtqa (C7)"], ["Facies articularis superior", "Yuqorigi bo'g'im yuzasi"], ["Facies articularis inferior", "Pastki bo'g'im yuzasi"]] }),
        q({ type: "build", prompt: "«Uyqu do'mboqchasi» atamasini yig'ing", answerText: "Tuberculum caroticum", extra: ["anterius", "prominens"] }),
        q({ type: "tf", prompt: "Vertebra prominens — bu 7-bo'yin umurtqasi.", statement: true }),
        q({ type: "quiz", prompt: "Nima uchun C7 «prominens» deb ataladi?", options: ["Eng kichik bo'lgani uchun", "Processus spinosus'i uzun va teridan bo'rtib turgani uchun", "Teshigi katta bo'lgani uchun", "Tanasi yo'q bo'lgani uchun"], answer: 1 }),
        q({ type: "tf", prompt: "Tuberculum caroticum C4 umurtqada joylashgan.", statement: false, explanation: "Tuberculum caroticum — C6 umurtqaning oldingi do'mboqchasi." }),
      ],
    },
  ],
};

export const u3: OsteologyUnit = {
  id: "u3",
  title: "Ko'krak va bel",
  icon: "bone",
  color: "#ff9600",
  intro: "Ko'krak umurtqalari 12 ta. Asosiy belgisi — qovurg'alar bilan bo'g'im hosil qiluvchi chuqurchalar (foveae costales). Processus spinosus'lari uzun va pastga qiya (cherepitsasimon) yo'nalgan.",
  lessons: [
    {
      id: "l8",
      title: "Ko'krak umurtqalari",
      description: "Ko'krak umurtqalari va qovurg'a chuqurchalari",
      xp: 25,
      minutes: 7,
      questions: [
        q({ type: "quiz", prompt: "Ko'krak umurtqalarini boshqalardan ajratib turuvchi asosiy belgi?", options: ["Foramen transversarium", "Qovurg'a chuqurchalari (fovea costales)", "Dens", "Massae laterales"], answer: 1, hint: "Qovurg'alar bilan bo'g'im hosil qiladi" }),
        q({ type: "img", prompt: "Rasmda ko'rsatilgan qovurg'a boshi birikadigan chuqurchalar qanday ataladi?", image: "/img/thoracic_fovea.jpg", options: ["Fovea dentis", "Fovea costalis superior et inferior", "Fovea articularis", "Foramen costale"], answer: 1 }),
        q({ type: "quiz", prompt: "Ko'ndalang o'simtadagi qovurg'a do'mbog'i birikadigan chuqurcha?", options: ["Fovea costalis transversalis", "Fovea costalis superior", "Fovea dentis", "Incisura costalis"], answer: 0 }),
        q({ type: "quiz", prompt: "«Incisura vertebralis superior» nimani anglatadi?", options: ["Yuqorigi umurtqa o'ymasi", "Yuqorigi bo'g'im o'simtasi", "Yuqorigi teshik", "Yuqorigi ravoq"], answer: 0, hint: "Incisura — o'yma" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Fovea costalis superior", "Yuqorigi qovurg'a chuqurchasi"], ["Fovea costalis inferior", "Pastki qovurg'a chuqurchasi"], ["Fovea costalis transversalis", "Ko'ndalang qovurg'a chuqurchasi"], ["Incisura vertebralis", "Umurtqa o'ymasi"]] }),
        q({ type: "build", prompt: "«Ko'ndalang qovurg'a chuqurchasi» atamasini yig'ing", answerText: "Fovea costalis transversalis", extra: ["superior", "dentis"] }),
        q({ type: "tf", prompt: "Ko'krak umurtqalarida foramen transversarium bor.", statement: false, explanation: "Foramen transversarium faqat bo'yin umurtqalarida. Ko'krak umurtqalarida fovea costales bor." }),
        q({ type: "img", prompt: "Rasmdagi umurtqa qaysi bo'limga tegishli?", image: "/img/thoracic_labeled.jpg", options: ["Bo'yin", "Ko'krak", "Bel", "Dumg'aza"], answer: 1 }),
        q({ type: "quiz", prompt: "Ko'krak umurtqalarining processus spinosus'i qanday yo'nalgan?", options: ["Gorizontal", "Yuqoriga", "Pastga qiya (cherepitsasimon)", "Yon tomonga"], answer: 2 }),
      ],
    },
    {
      id: "l9",
      title: "Bel umurtqalari",
      description: "Bel umurtqalarining xususiyatlari",
      xp: 25,
      minutes: 7,
      questions: [
        q({ type: "quiz", prompt: "Bel umurtqalarining eng katta ajralib turuvchi belgisi?", options: ["Eng kichik tanasi", "Eng katta va massiv tanasi", "Foramen transversarium", "Fovea costales"], answer: 1 }),
        q({ type: "quiz", prompt: "Bel umurtqasidagi qovurg'a rudimenti bo'lgan o'simta?", options: ["Processus costarius", "Processus mamillaris", "Processus accessorius", "Processus spinosus"], answer: 0, hint: "Costa — qovurg'a" }),
        q({ type: "quiz", prompt: "«Processus mamillaris» o'zbekchada…", options: ["Qo'shimcha o'simta", "So'rg'ichsimon o'simta", "Qovurg'a o'simtasi", "Ko'ndalang o'simta"], answer: 1 }),
        q({ type: "quiz", prompt: "«Processus accessorius» o'zbekchada…", options: ["Qo'shimcha o'simta", "So'rg'ichsimon o'simta", "Bo'g'im o'simtasi", "Qirrali o'simta"], answer: 0 }),
        q({ type: "img", prompt: "Rasmdagi umurtqa qaysi bo'limga tegishli?", image: "/img/lumbar_labeled.jpg", options: ["Bo'yin", "Ko'krak", "Bel", "Dum"], answer: 2 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Processus costarius", "Qovurg'a o'simtasi"], ["Processus accessorius", "Qo'shimcha o'simta"], ["Processus mamillaris", "So'rg'ichsimon o'simta"], ["Corpus vertebrae", "Umurtqa tanasi"]] }),
        q({ type: "build", prompt: "«So'rg'ichsimon o'simta» atamasini yig'ing", answerText: "Processus mamillaris", extra: ["costarius", "accessorius"] }),
        q({ type: "tf", prompt: "Bel umurtqalari 5 ta.", statement: true }),
        q({ type: "quiz", prompt: "Bel umurtqalarining processus spinosus'i qanday shaklda?", options: ["Uzun va pastga qiya", "Keng, yassi, gorizontal", "Ikkiga ayrilgan", "Mavjud emas"], answer: 1 }),
      ],
    },
  ],
};

export const u4: OsteologyUnit = {
  id: "u4",
  title: "Dumg'aza va dum",
  icon: "bone",
  color: "#ce82ff",
  intro: "Os sacrum 5 ta dumg'aza umurtqasining qo'shilishidan hosil bo'lgan uchburchaksimon suyak. Yuqori keng qismi — basis, pastki tor uchi — apex. Os coccygis — 3–5 rudimentar umurtqadan iborat dum suyagi.",
  lessons: [
    {
      id: "l10",
      title: "Os sacrum — asosiy qismlar",
      description: "Dumg'aza suyagining asosiy qismlari",
      xp: 25,
      minutes: 8,
      questions: [
        q({ type: "quiz", prompt: "Os sacrum nechta umurtqaning qo'shilishidan hosil bo'ladi?", options: ["3", "4", "5", "7"], answer: 2 }),
        q({ type: "img", prompt: "Dumg'azaning keng yuqori qismi qanday ataladi?", image: "/img/sacrum_basis.jpg", options: ["Apex ossis sacri", "Basis ossis sacri", "Ala ossis sacri", "Cornu sacrale"], answer: 1, hint: "Basis — asos" }),
        q({ type: "quiz", prompt: "Dumg'azaning pastki tor uchi qanday ataladi?", options: ["Basis ossis sacri", "Apex ossis sacri", "Promontorium", "Hiatus sacralis"], answer: 1 }),
        q({ type: "quiz", prompt: "Basis ossis sacri'ning oldinga bo'rtib chiqqan qismi (L5 bilan chegarada)?", options: ["Promontorium", "Apex", "Cornu", "Crista"], answer: 0, hint: "Burun kabi oldinga chiqib turadi" }),
        q({ type: "quiz", prompt: "Dumg'azaning «qanotlari» qanday ataladi?", options: ["Cornua sacralia", "Alae ossis sacri", "Cristae sacrales", "Lineae transversae"], answer: 1, hint: "Ala — qanot" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Basis ossis sacri", "Dumg'aza asosi"], ["Apex ossis sacri", "Dumg'aza uchi"], ["Ala ossis sacri", "Dumg'aza qanoti"], ["Promontorium", "Burtiq (tumshuq)"]] }),
        q({ type: "quiz", prompt: "Dumg'azaning chanoqqa qaragan yuzasi qanday ataladi?", options: ["Facies dorsalis", "Facies pelvina", "Facies auricularis", "Facies articularis"], answer: 1, hint: "Pelvis — chanoq" }),
        q({ type: "build", prompt: "«Dumg'aza asosi» atamasini yig'ing", answerText: "Basis ossis sacri", extra: ["apex", "ala"] }),
        q({ type: "tf", prompt: "Facies pelvina — dumg'azaning orqa (dorsal) yuzasi.", statement: false, explanation: "Facies pelvina — oldingi, chanoqqa qaragan yuzasi. Orqa yuzasi — facies dorsalis." }),
        q({ type: "img", prompt: "Rasmda ko'rsatilgan chanoq yuzasidagi teshiklar qanday ataladi?", image: "/img/sacrum_labeled.jpg", options: ["Foramina sacralia pelvina (anteriora)", "Foramina sacralia dorsalia", "Foramen vertebrale", "Foramen transversarium"], answer: 0 }),
      ],
    },
    {
      id: "l11",
      title: "Os sacrum — qirralar va kanal",
      description: "Dumg'aza qirralari va kanali",
      xp: 25,
      minutes: 8,
      questions: [
        q({ type: "quiz", prompt: "Dumg'azaning orqa yuzasidagi O'RTA qirra qanday ataladi?", options: ["Crista sacralis lateralis", "Crista sacralis mediana", "Crista sacralis intermedia", "Crista iliaca"], answer: 1, hint: "Mediana — o'rta" }),
        q({ type: "quiz", prompt: "Crista sacralis mediana nimaning qo'shilishidan hosil bo'lgan?", options: ["Ko'ndalang o'simtalar", "Processus spinosus'lar", "Bo'g'im o'simtalari", "Qovurg'alar"], answer: 1 }),
        q({ type: "quiz", prompt: "Dumg'aza kanali qanday ataladi?", options: ["Canalis vertebralis", "Canalis sacralis", "Hiatus sacralis", "Foramen sacrale"], answer: 1 }),
        q({ type: "img", prompt: "Kanalning pastki ochiq qismi (rasmda ko'rsatilgan) qanday ataladi?", image: "/img/sacrum_cornu.jpg", options: ["Hiatus sacralis", "Canalis sacralis", "Apex sacralis", "Foramen sacrale"], answer: 0, hint: "Hiatus — tirqish" }),
        q({ type: "quiz", prompt: "Hiatus sacralis yon tomonlarida joylashgan shoxchalar?", options: ["Cornua coccygea", "Cornua sacralia", "Alae sacrales", "Cristae sacrales"], answer: 1, hint: "Cornu — shox" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Crista sacralis mediana", "O'rta qirra"], ["Crista sacralis intermedia", "Oraliq qirra"], ["Crista sacralis lateralis", "Yon qirra"], ["Canalis sacralis", "Dumg'aza kanali"]] }),
        q({ type: "quiz", prompt: "Yonbosh suyagi bilan bo'g'im hosil qiluvchi quloqsimon yuza?", options: ["Facies pelvina", "Facies auricularis", "Facies dorsalis", "Facies lunata"], answer: 1, hint: "Auricula — quloqcha" }),
        q({ type: "img", prompt: "Rasmda YASHIL rangda ko'rsatilgan teshiklar?", image: "/img/sacrum_foramina.jpg", options: ["Foramina sacralia pelvina", "Foramina sacralia dorsalia (posteriora)", "Foramina intervertebralia", "Foramina transversaria"], answer: 1 }),
        q({ type: "build", prompt: "«O'rta dumg'aza qirrasi» atamasini yig'ing", answerText: "Crista sacralis mediana", extra: ["lateralis", "intermedia"] }),
        q({ type: "tf", prompt: "Facies auricularis quloqsimon shaklda bo'lib, yonbosh suyagi bilan bo'g'im hosil qiladi.", statement: true }),
      ],
    },
    {
      id: "l12",
      title: "Os coccygis",
      description: "Dum suyagi (os coccygis)",
      xp: 20,
      minutes: 6,
      questions: [
        q({ type: "quiz", prompt: "Os coccygis — bu…", options: ["Dumg'aza suyagi", "Dum suyagi", "Yonbosh suyagi", "Qov suyagi"], answer: 1 }),
        q({ type: "img", prompt: "Dum suyagining yuqoriga yo'nalgan shoxchalari qanday ataladi?", image: "/img/coccyx_green.jpg", options: ["Cornua sacralia", "Cornua coccygea", "Processus transversi", "Alae coccygea"], answer: 1 }),
        q({ type: "quiz", prompt: "Os coccygis'da qanday tuzilmalar farqlanadi?", options: ["Corpus, cornua, processus transversi", "Dens, apex, collum", "Basis, ala, promontorium", "Arcus anterior va posterior"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Corpus coccygis", "Dum suyagi tanasi"], ["Cornua coccygea", "Dum suyagi shoxchalari"], ["Processus transversi", "Ko'ndalang o'simtalar"], ["Os coccygis", "Dum suyagi"]] }),
        q({ type: "build", prompt: "«Dum suyagi shoxchalari» atamasini yig'ing", answerText: "Cornua coccygea", extra: ["sacralia", "processus"] }),
        q({ type: "tf", prompt: "Cornua coccygea cornua sacralia bilan birikadi.", statement: true }),
        q({ type: "quiz", prompt: "Os coccygis odatda nechta rudimentar umurtqadan iborat?", options: ["1–2", "3–5", "6–7", "8–10"], answer: 1 }),
        q({ type: "tf", prompt: "Os coccygis — umurtqa pog'onasining eng pastki bo'limi.", statement: true }),
      ],
    },
  ],
};

export const u5: OsteologyUnit = {
  id: "u5",
  title: "Ko'krak qafasi suyaklari",
  icon: "bone",
  color: "#ef4444",
  intro: "Ko'krak qafasi (thorax) 12 juft qovurg'a, to'sh suyagi va 12 ta ko'krak umurtqasidan tashkil topadi. Qovurg'alar chin (I–VII), soxta (VIII–X) va erkin (XI–XII) guruhlarga bo'linadi.",
  lessons: [
    {
      id: "l13",
      title: "Qovurg'alar (Costae)",
      description: "Qovurg'alar tuzilishi va turlari",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "img", prompt: "Rasmda qaysi suyaklar ko\u2018rsatilgan?", image: "/img/ribs.jpg", options: ["Qovurg\u2018alar (Costae)", "O\u2018mrov suyagi (Clavicula)", "Kurak suyagi (Scapula)", "Bilak suyaklari"], answer: 0, hint: "12 juft bo\u2018lib, ko\u2018krak qafasini hosil qiladi" }),

        q({ type: "quiz", prompt: "Qovurg'alar lotinchada qanday ataladi?", options: ["Costae", "Sternum", "Clavicula", "Scapula"], answer: 0 }),
        q({ type: "quiz", prompt: "Odamda necha juft qovurg'a bor?", options: ["10", "11", "12", "14"], answer: 2 }),
        q({ type: "quiz", prompt: "Qovurg'alar orqa tomonda qaysi suyaklar bilan bo'g'im hosil qiladi?", options: ["To'sh suyagi", "Ko'krak umurtqalari", "Bel umurtqalari", "O'mrov suyagi"], answer: 1, hint: "Fovea costales orqali" }),
        q({ type: "quiz", prompt: "Qovurg'a boshi lotinchada qanday ataladi?", options: ["Collum costae", "Caput costae", "Corpus costae", "Tuberculum costae"], answer: 1 }),
        q({ type: "quiz", prompt: "Qovurg'a tanasining ichki yuzasidagi egat (tomir va nerv o'tadi)?", options: ["Sulcus costae", "Sulcus vertebralis", "Sulcus arteriae vertebralis", "Sulcus bicipitalis"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Caput costae", "Qovurg'a boshi"], ["Collum costae", "Qovurg'a bo'yni"], ["Tuberculum costae", "Qovurg'a do'mbog'i"], ["Corpus costae", "Qovurg'a tanasi"]] }),
        q({ type: "build", prompt: "«Qovurg'a boshi» atamasini yig'ing", answerText: "Caput costae", extra: ["collum", "corpus"] }),
        q({ type: "quiz", prompt: "To'sh suyagiga bevosita birikadigan qovurg'alar qaysi?", options: ["I–VII", "VIII–X", "XI–XII", "Barchasi"], answer: 0, hint: "Costae verae — chin qovurg'alar" }),
        q({ type: "quiz", prompt: "VIII–X qovurg'alar qanday nomlanadi?", options: ["Costae verae", "Costae spuriae", "Costae fluctuantes", "Costae bifidae"], answer: 1, hint: "Spuriae — soxta" }),
        q({ type: "tf", prompt: "XI–XII qovurg'alar costae fluctuantes (erkin qovurg'alar) deb ataladi.", statement: true }),
        q({ type: "quiz", prompt: "Qovurg'a do'mbog'i (tuberculum costae) umurtqaning qaysi qismi bilan bo'g'im hosil qiladi?", options: ["Corpus vertebrae", "Fovea costalis transversalis", "Processus spinosus", "Foramen vertebrale"], answer: 1 }),
        q({ type: "quiz", prompt: "Qovurg'a boshidagi ikkita bo'g'im yuzasi orasidagi qirra?", options: ["Crista capitis costae", "Crista colli costae", "Linea aspera", "Spina costae"], answer: 0 }),
      ],
    },
    {
      id: "l14",
      title: "To'sh suyagi (Sternum)",
      description: "To'sh suyagi (sternum)",
      xp: 20,
      minutes: 9,
      questions: [
        q({ type: "quiz", prompt: "To'sh suyagi lotinchada qanday ataladi?", options: ["Sternum", "Sacrum", "Scapula", "Stapes"], answer: 0 }),
        q({ type: "quiz", prompt: "To'sh suyagi qanday qismlardan iborat?", options: ["Manubrium, corpus, processus xiphoideus", "Caput, collum, corpus", "Basis, apex, ala", "Squama, corpus, ramus"], answer: 0 }),
        q({ type: "quiz", prompt: "To'sh suyagining yuqori keng qismi qanday ataladi?", options: ["Corpus sterni", "Manubrium sterni", "Processus xiphoideus", "Angulus sterni"], answer: 1, hint: "Manubrium — dasta" }),
        q({ type: "quiz", prompt: "Manubriumning yuqori chetidagi o'yma?", options: ["Incisura clavicularis", "Incisura jugularis", "Incisura costalis", "Incisura vertebralis"], answer: 1, hint: "Jugulum — bo'yinturuq" }),
        q({ type: "quiz", prompt: "O'mrov suyagi bilan bo'g'im hosil qiladigan o'yma?", options: ["Incisura jugularis", "Incisura costalis", "Incisura clavicularis", "Fovea dentis"], answer: 2 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Manubrium sterni", "Dasta"], ["Corpus sterni", "Tana"], ["Processus xiphoideus", "Xanjar o'simta"], ["Incisura jugularis", "Bo'yinturuq o'ymasi"]] }),
        q({ type: "quiz", prompt: "Dasta bilan tana chegarasidagi burchak (II qovurg'a sohasida)?", options: ["Angulus sterni", "Angulus costae", "Angulus mandibulae", "Angulus inferior"], answer: 0, hint: "Angulus Ludovici" }),
        q({ type: "build", prompt: "«Xanjar o'simta» atamasini yig'ing", answerText: "Processus xiphoideus", extra: ["manubrium", "jugularis"] }),
        q({ type: "quiz", prompt: "Ko'krak qafasi lotinchada qanday ataladi?", options: ["Thorax", "Pelvis", "Cranium", "Abdomen"], answer: 0 }),
        q({ type: "quiz", prompt: "Ko'krak qafasining yuqori teshigi?", options: ["Apertura thoracis inferior", "Apertura thoracis superior", "Hiatus aorticus", "Foramen magnum"], answer: 1 }),
        q({ type: "tf", prompt: "Processus xiphoideus yosh o'tgan sari suyaklanib qoladi.", statement: true }),
      ],
    },
  ],
};

export const u6: OsteologyUnit = {
  id: "u6",
  title: "Qo'l skeleti",
  icon: "activity",
  color: "#f59e0b",
  intro: "Qo'l skeleti yelka kamari (clavicula + scapula) va qo'lning erkin qismidan (humerus, radius, ulna, kaft suyaklari) tashkil topgan. Kaft ildizida 8, kaftda 5, barmoqlarda 14 ta suyak bor.",
  lessons: [
    {
      id: "l15",
      title: "Yelka kamari (Scapula · Clavicula)",
      description: "Yelka kamari: kurak va o'mrov suyaklari",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Yelka kamari qaysi suyaklardan tashkil topgan?", options: ["Clavicula va scapula", "Humerus va radius", "Sternum va costa", "Os coxae va femur"], answer: 0 }),
        q({ type: "quiz", prompt: "O'mrov suyagi lotinchada qanday ataladi?", options: ["Clavicula", "Scapula", "Costa", "Clavis"], answer: 0 }),
        q({ type: "quiz", prompt: "Kurak suyagi lotinchada qanday ataladi?", options: ["Clavicula", "Scapula", "Sternum", "Sacrum"], answer: 1 }),
        q({ type: "quiz", prompt: "Kurak suyagining yelka suyagi bilan bo'g'im hosil qiladigan chuqurchasi?", options: ["Fossa subscapularis", "Cavitas glenoidalis", "Acetabulum", "Fovea dentis"], answer: 1, hint: "Glenoidalis — bo'g'imga oid" }),
        q({ type: "quiz", prompt: "Kurak suyagi orqa yuzasidagi qirra?", options: ["Spina scapulae", "Linea aspera", "Crista iliaca", "Crista sacralis"], answer: 0 }),
        q({ type: "quiz", prompt: "Spina scapulae'ning uchida joylashgan, o'mrov bilan bo'g'im hosil qiladigan o'simta?", options: ["Processus coracoideus", "Acromion", "Processus styloideus", "Olecranon"], answer: 1 }),
        q({ type: "quiz", prompt: "Kurak suyagining oldinga yo'nalgan «tumshuqsimon» o'simtasi?", options: ["Acromion", "Processus coracoideus", "Processus mastoideus", "Processus xiphoideus"], answer: 1 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Clavicula", "O'mrov suyagi"], ["Scapula", "Kurak suyagi"], ["Acromion", "Yelka uchki o'simtasi"], ["Cavitas glenoidalis", "Bo'g'im chuqurchasi"]] }),
        q({ type: "build", prompt: "«Yelka uchki o'simtasi» atamasini yig'ing", answerText: "Acromion", extra: ["coracoideus", "olecranon"] }),
        q({ type: "quiz", prompt: "Kurak suyagining qovurg'alarga qaragan yuzasidagi chuqurcha?", options: ["Fossa supraspinata", "Fossa infraspinata", "Fossa subscapularis", "Cavitas glenoidalis"], answer: 2 }),
        q({ type: "quiz", prompt: "Claviculaning to'sh suyagiga qaragan uchi?", options: ["Extremitas acromialis", "Extremitas sternalis", "Caput claviculae", "Tuberculum"], answer: 1 }),
        q({ type: "tf", prompt: "Acromion o'mrov suyagining akromial uchi bilan bo'g'im hosil qiladi.", statement: true }),
      ],
    },
    {
      id: "l16",
      title: "Yelka suyagi (Humerus)",
      description: "Yelka suyagi (humerus)",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Yelka suyagi lotinchada qanday ataladi?", options: ["Humerus", "Femur", "Radius", "Ulna"], answer: 0 }),
        q({ type: "quiz", prompt: "Yelka suyagining boshi qanday ataladi?", options: ["Caput humeri", "Collum humeri", "Tuberculum", "Condylus"], answer: 0 }),
        q({ type: "quiz", prompt: "Boshning chetidagi halqasimon botiq (anatomik)?", options: ["Collum chirurgicum", "Collum anatomicum", "Tuberculum majus", "Epicondylus"], answer: 1 }),
        q({ type: "quiz", prompt: "Sinishlar ko'p uchraydigan, boshdan pastroq toraygan joy?", options: ["Collum anatomicum", "Collum chirurgicum", "Diaphysis", "Metaphysis"], answer: 1, hint: "Chirurgicum — jarrohlik bo'yni" }),
        q({ type: "quiz", prompt: "Yelka suyagining katta va kichik do'mboqchalari?", options: ["Tuberculum majus et minus", "Trochanter major et minor", "Epicondylus medialis et lateralis", "Condylus medialis et lateralis"], answer: 0 }),
        q({ type: "quiz", prompt: "Ikki do'mboqcha orasidagi egat (biceps payi o'tadi)?", options: ["Sulcus intertubercularis", "Sulcus bicipitalis", "Sulcus nervi radialis", "Sulcus costae"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Caput humeri", "Yelka suyagi boshi"], ["Tuberculum majus", "Katta do'mboqcha"], ["Tuberculum minus", "Kichik do'mboqcha"], ["Sulcus intertubercularis", "Do'mboqchalararo egat"]] }),
        q({ type: "quiz", prompt: "Yelka suyagining pastki uchidagi yumaloq bo'g'im yuzasi (radius bilan)?", options: ["Capitulum humeri", "Caput humeri", "Trochlea", "Fossa olecrani"], answer: 0, hint: "Capitulum — boshcha" }),
        q({ type: "quiz", prompt: "Tirsak suyagi bilan bo'g'im hosil qiladigan blok?", options: ["Trochlea humeri", "Capitulum humeri", "Epicondylus", "Fossa radialis"], answer: 0 }),
        q({ type: "quiz", prompt: "Orqa yuzadagi chuqurcha (bilakni yozganda olecranon kiradi)?", options: ["Fossa olecrani", "Fossa coronoidea", "Fossa radialis", "Fossa glenoidalis"], answer: 0 }),
        q({ type: "build", prompt: "«Yelka suyagi boshi» atamasini yig'ing", answerText: "Caput humeri", extra: ["femur", "radius"] }),
        q({ type: "tf", prompt: "Nervus radialis yelka suyagining sulcus nervi radialis'dan o'tadi.", statement: true }),
      ],
    },
    {
      id: "l17",
      title: "Bilak va kaft suyaklari",
      description: "Bilak va kaft suyaklari",
      xp: 30,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Bilak suyaklari qaysilar?", options: ["Radius va ulna", "Tibia va fibula", "Humerus va scapula", "Femur va patella"], answer: 0 }),
        q({ type: "quiz", prompt: "Bosh barmoq tomonidagi bilak suyagi?", options: ["Ulna", "Radius", "Humerus", "Fibula"], answer: 1, hint: "Radius — tashqi tomonda" }),
        q({ type: "quiz", prompt: "Tirsak suyagi lotinchada qanday ataladi?", options: ["Radius", "Ulna", "Ulcus", "Umbilicus"], answer: 1 }),
        q({ type: "quiz", prompt: "Tirsak suyagining yuqori uchidagi katta o'simta (tirsak suyanchig'i)?", options: ["Olecranon", "Acromion", "Malleolus", "Tuberculum"], answer: 0 }),
        q({ type: "quiz", prompt: "Radiusning pastki uchidagi bigizsimon o'simta?", options: ["Processus styloideus", "Processus coracoideus", "Processus xiphoideus", "Olecranon"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Radius", "Bilak suyagi (bosh barmoq tomoni)"], ["Ulna", "Tirsak suyagi"], ["Olecranon", "Tirsak suyanchig'i"], ["Processus styloideus", "Bigizsimon o'simta"]] }),
        q({ type: "quiz", prompt: "Kaft ildizi suyaklari (ossa carpi) nechta?", options: ["5", "7", "8", "10"], answer: 2 }),
        q({ type: "quiz", prompt: "Kaft ildizi suyaklari lotinchada?", options: ["Ossa carpi", "Ossa metacarpi", "Ossa tarsi", "Ossa digitorum"], answer: 0 }),
        q({ type: "quiz", prompt: "Kaft suyaklari (ossa metacarpi) nechta?", options: ["4", "5", "6", "8"], answer: 1 }),
        q({ type: "quiz", prompt: "Bitta qo'lda nechta barmoq falangasi bor?", options: ["12", "14", "15", "16"], answer: 1, hint: "2 + 3 + 3 + 3 + 3" }),
        q({ type: "build", prompt: "«Tirsak suyanchig'i» atamasini yig'ing", answerText: "Olecranon", extra: ["acromion", "malleolus"] }),
        q({ type: "quiz", prompt: "Bosh barmoq lotinchada qanday ataladi?", options: ["Pollex", "Hallux", "Digitus", "Carpus"], answer: 0 }),
        q({ type: "tf", prompt: "Ossa carpi ikki qatorda joylashgan 8 ta suyakdan iborat.", statement: true }),
      ],
    },
  ],
};

export const u7: OsteologyUnit = {
  id: "u7",
  title: "Oyoq skeleti",
  icon: "bone",
  color: "#10b981",
  intro: "Oyoq skeleti chanoq kamari (os coxae) va oyoqning erkin qismidan (femur, patella, tibia, fibula, panja suyaklari) tashkil topgan. Os coxae uch suyakdan — ilium, ischium, pubis — qo'shilib hosil bo'ladi.",
  lessons: [
    {
      id: "l18",
      title: "Chanoq kamari (Os coxae)",
      description: "Chanoq kamari (os coxae)",
      xp: 30,
      minutes: 12,
      questions: [
        q({ type: "img", prompt: "Rasmda qaysi tuzilma ko\u2018rsatilgan?", image: "/img/pelvis.jpg", options: ["Chanoq (Pelvis)", "Bosh suyagi (Cranium)", "Ko\u2018krak qafasi (Thorax)", "Yelka kamari"], answer: 0, hint: "Tana bilan oyoqlarni bog\u2018lovchi halqa" }),

        q({ type: "quiz", prompt: "Chanoq suyagi lotinchada qanday ataladi?", options: ["Os coxae", "Os sacrum", "Os ilium", "Femur"], answer: 0 }),
        q({ type: "quiz", prompt: "Os coxae nechta suyakning qo'shilishidan hosil bo'ladi?", options: ["2", "3", "4", "5"], answer: 1, hint: "Ilium, ischium, pubis" }),
        q({ type: "quiz", prompt: "Yonbosh suyagi lotinchada qanday ataladi?", options: ["Os ischii", "Os pubis", "Os ilium", "Os coccygis"], answer: 2 }),
        q({ type: "quiz", prompt: "Quymich suyagi lotinchada qanday ataladi?", options: ["Os ischii", "Os ilium", "Os pubis", "Os sacrum"], answer: 0 }),
        q({ type: "quiz", prompt: "Qov suyagi lotinchada qanday ataladi?", options: ["Os pubis", "Os ischii", "Os ilium", "Os coxae"], answer: 0 }),
        q({ type: "quiz", prompt: "Uch suyak birlashib hosil qilgan chuqurcha (son suyagi boshi kiradi)?", options: ["Acetabulum", "Cavitas glenoidalis", "Fossa iliaca", "Foramen obturatum"], answer: 0 }),
        q({ type: "quiz", prompt: "Yonbosh suyagining yuqori qirrasi?", options: ["Crista iliaca", "Linea aspera", "Spina scapulae", "Crista sacralis"], answer: 0 }),
        q({ type: "quiz", prompt: "Yonbosh suyagining oldingi-ustki bo'rtig'i (klinik orientir)?", options: ["Spina iliaca anterior superior", "Spina iliaca posterior superior", "Tuber ischiadicum", "Tuberculum pubicum"], answer: 0 }),
        q({ type: "quiz", prompt: "O'tirganda tayanch bo'ladigan quymich do'mbog'i?", options: ["Tuber ischiadicum", "Spina ischiadica", "Crista iliaca", "Acetabulum"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Os ilium", "Yonbosh suyagi"], ["Os ischii", "Quymich suyagi"], ["Os pubis", "Qov suyagi"], ["Acetabulum", "Bo'g'im chuqurchasi"]] }),
        q({ type: "quiz", prompt: "Qov suyaklarining oldingi birikishi?", options: ["Symphysis pubica", "Articulatio sacroiliaca", "Acetabulum", "Ligamentum"], answer: 0 }),
        q({ type: "quiz", prompt: "Qov va quymich suyaklari orasidagi katta teshik?", options: ["Foramen obturatum", "Foramen ischiadicum", "Foramen magnum", "Hiatus sacralis"], answer: 0 }),
        q({ type: "quiz", prompt: "Chanoqni katta va kichik qismlarga bo'luvchi chegara chizig'i?", options: ["Linea terminalis", "Linea aspera", "Linea alba", "Linea transversa"], answer: 0 }),
        q({ type: "build", prompt: "«Yonbosh suyagi» atamasini yig'ing", answerText: "Os ilium", extra: ["ischii", "pubis"] }),
        q({ type: "tf", prompt: "Acetabulum ichiga femurning boshi kiradi.", statement: true }),
      ],
    },
    {
      id: "l19",
      title: "Son va boldir suyaklari",
      description: "Son va boldir suyaklari",
      xp: 30,
      minutes: 12,
      questions: [
        q({ type: "img", prompt: "Rasmda qaysi suyak ko\u2018rsatilgan?", image: "/img/femur.jpg", options: ["Son suyagi (Femur)", "Yelka suyagi (Humerus)", "Katta boldir (Tibia)", "Bilak suyagi (Radius)"], answer: 0, hint: "Tanadagi eng uzun va mustahkam suyak" }),

        q({ type: "quiz", prompt: "Son suyagi lotinchada qanday ataladi?", options: ["Femur", "Humerus", "Fibula", "Patella"], answer: 0 }),
        q({ type: "quiz", prompt: "Femurning boshi qanday ataladi?", options: ["Caput femoris", "Collum femoris", "Trochanter major", "Condylus"], answer: 0 }),
        q({ type: "quiz", prompt: "Son suyagining boshini tanaga bog'lovchi qismi (sinish ko'p uchraydi)?", options: ["Collum femoris", "Corpus femoris", "Trochanter", "Epicondylus"], answer: 0 }),
        q({ type: "quiz", prompt: "Femurning katta va kichik do'mboqlari?", options: ["Trochanter major et minor", "Tuberculum majus et minus", "Epicondylus medialis et lateralis", "Malleolus medialis et lateralis"], answer: 0 }),
        q({ type: "quiz", prompt: "Son suyagining orqa yuzasidagi qo'pol qirra (mushaklar birikadi)?", options: ["Linea aspera", "Crista iliaca", "Spina scapulae", "Linea alba"], answer: 0 }),
        q({ type: "quiz", prompt: "Tizza qopqog'i suyagi qanday ataladi?", options: ["Patella", "Fibula", "Tibia", "Talus"], answer: 0 }),
        q({ type: "quiz", prompt: "Katta boldir suyagi lotinchada qanday ataladi?", options: ["Tibia", "Fibula", "Tarsus", "Femur"], answer: 0 }),
        q({ type: "quiz", prompt: "Kichik boldir suyagi lotinchada qanday ataladi?", options: ["Fibula", "Tibia", "Patella", "Ulna"], answer: 0 }),
        q({ type: "quiz", prompt: "Tibianing oldingi yuzasidagi do'mboqlik (pay birikadi)?", options: ["Tuberositas tibiae", "Tuberculum majus", "Trochanter major", "Malleolus"], answer: 0 }),
        q({ type: "quiz", prompt: "To'piqning ichki suyak bo'rtig'i qanday ataladi?", options: ["Malleolus medialis", "Malleolus lateralis", "Tuber calcanei", "Talus"], answer: 0, hint: "Medialis — ichki" }),
        q({ type: "quiz", prompt: "To'piqning tashqi bo'rtig'i (malleolus lateralis) qaysi suyakda?", options: ["Tibia", "Fibula", "Talus", "Calcaneus"], answer: 1 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Femur", "Son suyagi"], ["Patella", "Tizza qopqog'i"], ["Tibia", "Katta boldir suyagi"], ["Fibula", "Kichik boldir suyagi"]] }),
        q({ type: "build", prompt: "«Son suyagi boshi» atamasini yig'ing", answerText: "Caput femoris", extra: ["humeri", "radius"] }),
        q({ type: "quiz", prompt: "Tibianing yuqori uchidagi ikkita bo'g'im yuzasi?", options: ["Condylus medialis et lateralis", "Epicondylus medialis et lateralis", "Trochanter major et minor", "Malleolus medialis et lateralis"], answer: 0 }),
        q({ type: "tf", prompt: "Fibula tizza bo'g'imida ishtirok etmaydi.", statement: true }),
      ],
    },
    {
      id: "l20",
      title: "Oyoq panjasi (Ossa pedis)",
      description: "Oyoq panjasi suyaklari",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Oyoq panjasining orqa qismidagi suyaklar (ossa tarsi) nechta?", options: ["5", "7", "8", "14"], answer: 1 }),
        q({ type: "quiz", prompt: "Oshiq suyagi lotinchada qanday ataladi?", options: ["Talus", "Calcaneus", "Naviculare", "Cuboideum"], answer: 0 }),
        q({ type: "quiz", prompt: "Tovon suyagi lotinchada qanday ataladi?", options: ["Calcaneus", "Talus", "Cuneiforme", "Metatarsus"], answer: 0 }),
        q({ type: "quiz", prompt: "Tovon suyagining orqaga bo'rtib chiqqan do'mbog'i (Axill payi birikadi)?", options: ["Tuber calcanei", "Malleolus lateralis", "Tuberositas tibiae", "Tuberculum majus"], answer: 0 }),
        q({ type: "quiz", prompt: "Oyoq panjasining o'rta qismidagi qayiqsimon suyak?", options: ["Os naviculare", "Os cuboideum", "Os cuneiforme", "Talus"], answer: 0, hint: "Navicula — qayiq" }),
        q({ type: "quiz", prompt: "Ponasimon suyaklar (ossa cuneiformia) nechta?", options: ["1", "2", "3", "4"], answer: 2, hint: "Mediale, intermedium, laterale" }),
        q({ type: "quiz", prompt: "Oyoq kafti suyaklari (ossa metatarsi) nechta?", options: ["5", "7", "8", "14"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Talus", "Oshiq suyagi"], ["Calcaneus", "Tovon suyagi"], ["Os naviculare", "Qayiqsimon suyak"], ["Os cuboideum", "Kubsimon suyak"]] }),
        q({ type: "quiz", prompt: "Oyoq panjasining bo'rtib turgan uzunasiga yoyi qanday ataladi?", options: ["Arcus pedis", "Linea aspera", "Crista iliaca", "Foramen"], answer: 0, hint: "Oyoq gumbazi" }),
        q({ type: "quiz", prompt: "Bitta oyoq panjasida nechta falanga bor?", options: ["12", "14", "15", "16"], answer: 1 }),
        q({ type: "build", prompt: "«Tovon suyagi» atamasini yig'ing", answerText: "Calcaneus", extra: ["Talus", "Naviculare"] }),
        q({ type: "quiz", prompt: "Oyoqdagi bosh barmoq lotinchada qanday ataladi?", options: ["Hallux", "Pollex", "Digitus", "Talus"], answer: 0 }),
        q({ type: "tf", prompt: "Talus boldir suyaklari bilan to'piq bo'g'imini hosil qiladi.", statement: true }),
      ],
    },
  ],
};

export const u8: OsteologyUnit = {
  id: "u8",
  title: "Kalla — miya qismi",
  icon: "bone",
  color: "#64748b",
  intro: "Kalla skeleti miya (neurocranium) va yuz (viscerocranium) qismlariga bo'linadi. Miya qismi 8 ta suyakdan iborat: 4 toq (frontale, occipitale, sphenoidale, ethmoidale) va 2 juft (parietale, temporale).",
  lessons: [
    {
      id: "l21",
      title: "Miya qismi suyaklari (umumiy)",
      description: "Miya qismi suyaklari umumiy",
      xp: 20,
      minutes: 8,
      questions: [
        q({ type: "img", prompt: "Rasmda qaysi tuzilma ko\u2018rsatilgan?", image: "/img/skull.jpg", options: ["Bosh suyagi (Cranium)", "Chanoq (Pelvis)", "Ko\u2018krak qafasi (Thorax)", "Umurtqa pog\u2018onasi"], answer: 0, hint: "Bosh miyani himoya qiladi" }),

        q({ type: "quiz", prompt: "Kalla skeleti lotinchada qanday ataladi?", options: ["Cranium", "Thorax", "Pelvis", "Columna"], answer: 0 }),
        q({ type: "quiz", prompt: "Kallaning miya qismi qanday ataladi?", options: ["Neurocranium", "Viscerocranium", "Calvaria", "Splanchnocranium"], answer: 0 }),
        q({ type: "quiz", prompt: "Miya qismi (neurocranium) nechta suyakdan iborat?", options: ["6", "8", "10", "14"], answer: 1 }),
        q({ type: "quiz", prompt: "Quyidagilardan qaysi biri TOQ (juft emas) suyak?", options: ["Os frontale", "Os occipitale", "Os parietale", "Os ethmoidale"], answer: 2, hint: "Parietale — juft" }),
        q({ type: "quiz", prompt: "Toq miya suyaklari qaysi qatorda to'g'ri keltirilgan?", options: ["Frontale, occipitale, sphenoidale, ethmoidale", "Parietale, temporale", "Maxilla, palatinum", "Nasale, lacrimale"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Neurocranium", "Kalla miya qismi"], ["Viscerocranium", "Kalla yuz qismi"], ["Calvaria", "Kalla gumbazi"], ["Basis cranii", "Kalla asosi"]] }),
        q({ type: "quiz", prompt: "Kallaning gumbazi qanday ataladi?", options: ["Calvaria", "Basis", "Sella", "Sinus"], answer: 0 }),
        q({ type: "build", prompt: "«Kalla miya qismi» atamasini yig'ing", answerText: "Neurocranium", extra: ["Viscerocranium", "Calvaria"] }),
        q({ type: "quiz", prompt: "Juft miya qismi suyaklari qaysilar?", options: ["Parietale va temporale", "Frontale va occipitale", "Sphenoidale va ethmoidale", "Maxilla va zygomaticum"], answer: 0 }),
        q({ type: "tf", prompt: "Neurocranium 8 ta suyakdan iborat (4 toq va 2 juft).", statement: true }),
      ],
    },
    {
      id: "l22",
      title: "Ensa, tepa va peshona suyaklari",
      description: "Ensa, tepa va peshona suyaklari",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Ensa suyagi lotinchada qanday ataladi?", options: ["Os occipitale", "Os frontale", "Os parietale", "Os temporale"], answer: 0 }),
        q({ type: "quiz", prompt: "Ensa suyagidagi eng katta teshik (orqa miya o'tadi)?", options: ["Foramen magnum", "Foramen ovale", "Foramen rotundum", "Foramen lacerum"], answer: 0 }),
        q({ type: "quiz", prompt: "Foramen magnum yonida, atlas bilan bo'g'im hosil qiladigan do'mboqchalar?", options: ["Condylus occipitalis", "Processus mastoideus", "Tuberculum", "Epicondylus"], answer: 0 }),
        q({ type: "quiz", prompt: "Ensa suyagining tashqi yuzasidagi bo'rtiq?", options: ["Protuberantia occipitalis externa", "Crista galli", "Tuber frontale", "Glabella"], answer: 0, hint: "Inion" }),
        q({ type: "quiz", prompt: "Tepa suyagi lotinchada qanday ataladi?", options: ["Os parietale", "Os temporale", "Os occipitale", "Os frontale"], answer: 0 }),
        q({ type: "quiz", prompt: "Peshona suyagi lotinchada qanday ataladi?", options: ["Os frontale", "Os parietale", "Os occipitale", "Os temporale"], answer: 0 }),
        q({ type: "quiz", prompt: "Peshona suyagining bo'rtib turgan sohalari (do'ng peshona joyi)?", options: ["Tuber frontale", "Glabella", "Arcus superciliaris", "Crista galli"], answer: 0 }),
        q({ type: "quiz", prompt: "Qoshlar orasidagi tekis maydon qanday ataladi?", options: ["Glabella", "Inion", "Nasion", "Vertex"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Os occipitale", "Ensa suyagi"], ["Os parietale", "Tepa suyagi"], ["Os frontale", "Peshona suyagi"], ["Foramen magnum", "Katta teshik"]] }),
        q({ type: "quiz", prompt: "Peshona suyagi ichidagi havo bo'shlig'i?", options: ["Sinus frontalis", "Sinus maxillaris", "Sinus sphenoidalis", "Cellulae ethmoidales"], answer: 0 }),
        q({ type: "build", prompt: "«Katta teshik» atamasini yig'ing", answerText: "Foramen magnum", extra: ["ovale", "rotundum"] }),
        q({ type: "quiz", prompt: "Tepa va ensa suyaklari tutashadigan nuqta?", options: ["Lambda", "Bregma", "Pterion", "Asterion"], answer: 0, hint: "Yunoncha λ harfi" }),
        q({ type: "tf", prompt: "Condylus occipitalis atlasning fovea articularis superior'i bilan bo'g'im hosil qiladi.", statement: true }),
      ],
    },
    {
      id: "l23",
      title: "G'alvirsimon, ponasimon va chakka",
      description: "G'alvirsimon, ponasimon va chakka",
      xp: 25,
      minutes: 12,
      questions: [
        q({ type: "quiz", prompt: "G'alvirsimon suyak lotinchada qanday ataladi?", options: ["Os ethmoidale", "Os sphenoidale", "Os temporale", "Os palatinum"], answer: 0 }),
        q({ type: "quiz", prompt: "G'alvirsimon suyakning teshikli plastinkasi (hid nervlari o'tadi)?", options: ["Lamina cribrosa", "Lamina perpendicularis", "Lamina papyracea", "Lamina horizontalis"], answer: 0 }),
        q({ type: "quiz", prompt: "Lamina cribrosa ustidagi xo'roz tojisimon o'simta?", options: ["Crista galli", "Glabella", "Inion", "Sella turcica"], answer: 0 }),
        q({ type: "quiz", prompt: "Ponasimon suyak lotinchada qanday ataladi?", options: ["Os sphenoidale", "Os ethmoidale", "Os temporale", "Os zygomaticum"], answer: 0 }),
        q({ type: "quiz", prompt: "Ponasimon suyak tanasidagi egarsimon chuqurlik (gipofiz joylashadi)?", options: ["Sella turcica", "Fossa hypophysialis", "Crista galli", "Fovea dentis"], answer: 0, hint: "Sella — egar" }),
        q({ type: "quiz", prompt: "Sella turcica ichidagi, gipofiz bezi joylashadigan chuqurcha?", options: ["Fossa hypophysialis", "Fossa pterygoidea", "Fossa temporalis", "Fossa cranii"], answer: 0 }),
        q({ type: "quiz", prompt: "Ponasimon suyakda nechta qanot bor?", options: ["2 (katta va kichik)", "1", "3", "4"], answer: 0 }),
        q({ type: "quiz", prompt: "Chakka suyagi lotinchada qanday ataladi?", options: ["Os temporale", "Os occipitale", "Os parietale", "Os frontale"], answer: 0 }),
        q({ type: "quiz", prompt: "Quloq orqasidagi so'rg'ichsimon o'simta?", options: ["Processus mastoideus", "Processus styloideus", "Processus zygomaticus", "Processus coronoideus"], answer: 0 }),
        q({ type: "quiz", prompt: "Chakka suyagining bigizsimon o'simtasi?", options: ["Processus styloideus", "Processus mastoideus", "Processus zygomaticus", "Acromion"], answer: 0 }),
        q({ type: "quiz", prompt: "Chakka suyagining toshsimon qismi (ichki quloq joylashadi)?", options: ["Pars petrosa", "Squama temporalis", "Pars tympanica", "Pars mastoidea"], answer: 0, hint: "Pyramis — piramida" }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Os ethmoidale", "G'alvirsimon suyak"], ["Os sphenoidale", "Ponasimon suyak"], ["Os temporale", "Chakka suyagi"], ["Sella turcica", "Turk egari"]] }),
        q({ type: "build", prompt: "«So'rg'ichsimon o'simta» atamasini yig'ing", answerText: "Processus mastoideus", extra: ["styloideus", "zygomaticus"] }),
        q({ type: "quiz", prompt: "Eshitish va muvozanat a'zosi chakka suyagining qaysi qismida joylashgan?", options: ["Pars petrosa", "Squama", "Pars tympanica", "Processus zygomaticus"], answer: 0 }),
        q({ type: "tf", prompt: "Os ethmoidale kallaning miya qismiga kiradi.", statement: true }),
      ],
    },
  ],
};

export const u9: OsteologyUnit = {
  id: "u9",
  title: "Kalla — yuz qismi",
  icon: "bone",
  color: "#a855f7",
  intro: "Kallaning yuz qismi 14 ta suyakdan iborat bo'lib, ular orasida eng yiriklari ustki jag' (maxilla) va pastki jag' (mandibula). Mandibula kallaning yagona harakatchan suyagidir.",
  lessons: [
    {
      id: "l24",
      title: "Ustki jag' va tanglay suyagi",
      description: "Ustki jag' va tanglay suyagi",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Ustki jag' suyagi lotinchada qanday ataladi?", options: ["Maxilla", "Mandibula", "Zygomaticum", "Palatinum"], answer: 0 }),
        q({ type: "quiz", prompt: "Ustki jag' suyagidagi eng katta havo bo'shlig'i (burun yonida)?", options: ["Sinus maxillaris", "Sinus frontalis", "Sinus sphenoidalis", "Sinus ethmoidalis"], answer: 0, hint: "Highmori bo'shlig'i" }),
        q({ type: "quiz", prompt: "Sinus maxillaris yana kimning nomi bilan ataladi?", options: ["Highmori", "Ludovici", "Fallopiy", "Vartoni"], answer: 0 }),
        q({ type: "quiz", prompt: "Ustki jag'dagi tishlar joylashadigan o'simta?", options: ["Processus alveolaris", "Processus palatinus", "Processus frontalis", "Processus zygomaticus"], answer: 0, hint: "Alveola — tish uyasi" }),
        q({ type: "quiz", prompt: "Ko'z ostidagi teshik (nerv chiqadi)?", options: ["Foramen infraorbitale", "Foramen supraorbitale", "Foramen mentale", "Foramen mandibulae"], answer: 0 }),
        q({ type: "quiz", prompt: "Qattiq tanglayning orqa qismini hosil qiluvchi suyak?", options: ["Os palatinum", "Maxilla", "Vomer", "Mandibula"], answer: 0 }),
        q({ type: "quiz", prompt: "Tanglay suyagining ikkita plastinkasi?", options: ["Lamina horizontalis et perpendicularis", "Lamina cribrosa et perpendicularis", "Lamina medialis et lateralis", "Squama et pars petrosa"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Maxilla", "Ustki jag' suyagi"], ["Os palatinum", "Tanglay suyagi"], ["Sinus maxillaris", "Yuqori jag' bo'shlig'i"], ["Processus alveolaris", "Tish o'simtasi"]] }),
        q({ type: "build", prompt: "«Ustki jag' suyagi» atamasini yig'ing", answerText: "Maxilla", extra: ["Mandibula", "Zygomaticum"] }),
        q({ type: "quiz", prompt: "Tanglay suyagining gorizontal plastinkasi qattiq tanglayning qaysi qismini hosil qiladi?", options: ["Orqa", "Oldingi", "O'rta", "Yon"], answer: 0 }),
        q({ type: "quiz", prompt: "Ikki ustki jag' tanalari birlashib hosil qilgan chok?", options: ["Sutura palatina mediana", "Sutura sagittalis", "Sutura coronalis", "Sutura lambdoidea"], answer: 0 }),
        q({ type: "tf", prompt: "Sinus maxillaris yuqori jag'da joylashgan eng katta havo bo'shlig'idir.", statement: true }),
      ],
    },
    {
      id: "l25",
      title: "Pastki jag', yonoq va butun kalla",
      description: "Pastki jag', yonoq va butun kalla",
      xp: 25,
      minutes: 10,
      questions: [
        q({ type: "quiz", prompt: "Pastki jag' suyagi lotinchada qanday ataladi?", options: ["Mandibula", "Maxilla", "Zygomaticum", "Vomer"], answer: 0 }),
        q({ type: "quiz", prompt: "Mandibula kallaning qanday suyagi?", options: ["Yagona harakatchan suyagi", "Eng katta miya suyagi", "Juft suyak", "Ichki quloq suyagi"], answer: 0 }),
        q({ type: "quiz", prompt: "Pastki jag' tanasi qanday ataladi?", options: ["Corpus mandibulae", "Ramus mandibulae", "Angulus mandibulae", "Caput mandibulae"], answer: 0 }),
        q({ type: "quiz", prompt: "Pastki jag'ning yuqoriga ko'tarilgan qismi?", options: ["Ramus mandibulae", "Corpus mandibulae", "Angulus", "Processus alveolaris"], answer: 0 }),
        q({ type: "quiz", prompt: "Ramusning oldingi tojsimon o'simtasi?", options: ["Processus coronoideus", "Processus condylaris", "Processus mastoideus", "Processus styloideus"], answer: 0 }),
        q({ type: "quiz", prompt: "Ramusning orqa bo'g'im o'simtasi (chakka suyagi bilan bo'g'im)?", options: ["Processus condylaris", "Processus coronoideus", "Caput costae", "Condylus occipitalis"], answer: 0 }),
        q({ type: "quiz", prompt: "Chakka-pastki jag' bo'g'imi lotinchada qanday ataladi?", options: ["Articulatio temporomandibularis", "Articulatio atlantooccipitalis", "Symphysis", "Articulatio sternoclavicularis"], answer: 0, hint: "TMP bo'g'imi" }),
        q({ type: "quiz", prompt: "Yonoq suyagi lotinchada qanday ataladi?", options: ["Os zygomaticum", "Os nasale", "Os lacrimale", "Vomer"], answer: 0 }),
        q({ type: "match", prompt: "Lotincha atamani o‘zbekcha tarjimasi bilan moslang", pairs: [["Mandibula", "Pastki jag' suyagi"], ["Os zygomaticum", "Yonoq suyagi"], ["Processus coronoideus", "Tojsimon o'simta"], ["Articulatio temporomandibularis", "Chakka-jag' bo'g'imi"]] }),
        q({ type: "quiz", prompt: "Yangi tug'ilgan chaqaloq kallasidagi suyaklar orasidagi yumshoq soha (liqildoq)?", options: ["Fonticulus", "Sutura", "Foramen", "Sinus"], answer: 0 }),
        q({ type: "build", prompt: "«Pastki jag' suyagi» atamasini yig'ing", answerText: "Mandibula", extra: ["Maxilla", "Zygomaticum"] }),
        q({ type: "quiz", prompt: "Katta liqildoq (fonticulus anterior) qaysi suyaklar chegarasida?", options: ["Peshona va tepa", "Ensa va chakka", "Ponasimon va ensa", "Chakka va tepa"], answer: 0 }),
        q({ type: "tf", prompt: "Mandibula kalla skeletining yagona harakatchan suyagidir.", statement: true }),
      ],
    },
  ],
};

export const OSTEOLOGY_UNITS: OsteologyUnit[] = [u1, u2, u3, u4, u5, u6, u7, u8, u9];

export const SKELETAL_LESSONS: Lesson[] = OSTEOLOGY_UNITS.flatMap(u => u.lessons);

export function skeletalProgress(completedLessons: string[]) {
  const total = SKELETAL_LESSONS.length;
  const done = SKELETAL_LESSONS.filter((l) => completedLessons.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function unitProgress(unit: OsteologyUnit, completedLessons: string[]) {
  const done = unit.lessons.filter((l) => completedLessons.includes(l.id)).length;
  return { done, total: unit.lessons.length, pct: unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0 };
}

export function lessonById(id: string): Lesson | undefined {
  return SKELETAL_LESSONS.find((l) => l.id === id);
}

export function unitOfLesson(lessonId: string): OsteologyUnit | undefined {
  return OSTEOLOGY_UNITS.find((u) => u.lessons.some((l) => l.id === lessonId));
}

export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const idx = SKELETAL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  return completedLessons.includes(SKELETAL_LESSONS[idx - 1].id);
}

export function unitStatus(unit: OsteologyUnit, completedLessons: string[]): "completed" | "progress" | "new" {
  const done = unit.lessons.filter((l) => completedLessons.includes(l.id)).length;
  if (done === 0) return "new";
  if (done >= unit.lessons.length) return "completed";
  return "progress";
}
