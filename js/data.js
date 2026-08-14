// AnatomiLingo — dars ma'lumotlari (Columna vertebralis PDF asosida)
// Mashq turlari:
//  quiz  — 4 variantli savol (img ixtiyoriy)
//  img   — rasm bo'yicha savol
//  match — juftlarni moslashtirish [lotin, o'zbek]
//  build — so'z bo'laklaridan atama yig'ish
//  tf    — to'g'ri / noto'g'ri

const COURSE = {
  title: "Odam skeleti (Osteologiya)",
  subtitle: "Anatomiya I jild · Suyaklar haqidagi ilm",
  units: [
    {
      id: "u1",
      title: "Umurtqa pog'onasi",
      color: "#58cc02",
      icon: "🦴",
      lessons: [
        {
          id: "l1",
          title: "Bo'limlar bilan tanishuv",
          xp: 20,
          ex: [
            { t: "quiz", q: "«Columna vertebralis» o'zbekchada nimani anglatadi?", opts: ["Umurtqa pog'onasi", "Ko'krak qafasi", "Chanoq suyagi", "Elka kamari"], a: 0, hint: "Columna — ustun, vertebralis — umurtqaga oid" },
            { t: "quiz", q: "Bo'yin umurtqalari lotinchada qanday ataladi?", opts: ["Vertebrae thoracicae", "Vertebrae cervicales", "Vertebrae lumbales", "Os sacrum"], a: 1, hint: "Cervix — bo'yin" },
            { t: "match", pairs: [["Vertebrae cervicales", "Bo'yin umurtqalari"], ["Vertebrae thoracicae", "Ko'krak umurtqalari"], ["Vertebrae lumbales", "Bel umurtqalari"], ["Os sacrum", "Dumg'aza suyagi"]] },
            { t: "quiz", q: "Dum suyagi lotinchada qanday ataladi?", opts: ["Os sacrum", "Os coccygis", "Os ilium", "Os pubis"], a: 1 },
            { t: "build", q: "«Bel umurtqalari» atamasini yig'ing", answer: "Vertebrae lumbales", extra: ["cervicales", "sacrum"] },
            { t: "tf", q: "Os sacrum — bu dumg'aza suyagi.", a: true },
            { t: "quiz", q: "Umurtqa pog'onasi nechta bo'limdan iborat?", opts: ["3", "4", "5", "6"], a: 2, hint: "Bo'yin, ko'krak, bel, dumg'aza, dum" },
            { t: "build", q: "«Ko'krak umurtqalari» atamasini yig'ing", answer: "Vertebrae thoracicae", extra: ["lumbales", "coccygis"] },
            { t: "match", pairs: [["Os coccygis", "Dum suyagi"], ["Columna vertebralis", "Umurtqa pog'onasi"], ["Vertebra", "Umurtqa"], ["Os", "Suyak"]] }
          ]
        },
        {
          id: "l2",
          title: "Umurtqaning tuzilishi",
          xp: 20,
          ex: [
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan tuzilma nomi?", img: "assets/img/corpus.jpg", opts: ["Corpus vertebrae", "Arcus vertebrae", "Processus spinosus", "Foramen vertebrale"], a: 0, hint: "Corpus — tana" },
            { t: "quiz", q: "«Corpus vertebrae» nimani anglatadi?", opts: ["Umurtqa ravog'i", "Umurtqa tanasi", "Umurtqa teshigi", "Umurtqa o'simtasi"], a: 1 },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan tuzilma nomi?", img: "assets/img/arcus.jpg", opts: ["Corpus vertebrae", "Processus transversus", "Arcus vertebrae", "Foramen intervertebrale"], a: 2, hint: "Arcus — ravoq (yoy)" },
            { t: "quiz", q: "Arcus vertebrae qaysi ikki qismdan iborat?", opts: ["Corpus va foramen", "Pediculus va lamina", "Dens va apex", "Basis va apex"], a: 1, hint: "Oyoqcha va plastinka" },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan teshik?", img: "assets/img/foramen_vertebrale.jpg", opts: ["Foramen transversarium", "Foramen intervertebrale", "Foramen vertebrale", "Foramen sacrale"], a: 2, hint: "Orqa miya shu teshikdan o'tadi" },
            { t: "match", pairs: [["Corpus vertebrae", "Umurtqa tanasi"], ["Arcus vertebrae", "Umurtqa ravog'i"], ["Foramen vertebrale", "Umurtqa teshigi"], ["Processus", "O'simta"]] },
            { t: "build", q: "«Umurtqa ravog'i» atamasini yig'ing", answer: "Arcus vertebrae", extra: ["corpus", "foramen"] },
            { t: "quiz", q: "Pediculus arcus vertebrae — bu…", opts: ["Ravoq plastinkasi", "Ravoq oyoqchasi", "Umurtqa tanasi", "Bo'g'im o'simtasi"], a: 1 },
            { t: "tf", q: "Foramen vertebrale ichidan orqa miya o'tadi.", a: true },
            { t: "quiz", q: "Lamina arcus vertebrae — bu…", opts: ["Ravoq oyoqchasi", "Umurtqa teshigi", "Ravoq plastinkasi", "Ko'ndalang o'simta"], a: 2 }
          ]
        },
        {
          id: "l3",
          title: "O'simtalar (Processus)",
          xp: 20,
          ex: [
            { t: "quiz", q: "Umurtqada nechta turdagi o'simta (processus) bor?", opts: ["2", "3", "4", "5"], a: 2, hint: "Spinosus, transversus, articularis superior va inferior" },
            { t: "img", q: "Rasmda qaysi tuzilmalar YASHIL rangda ko'rsatilgan?", img: "assets/img/proc_transversus.jpg", opts: ["Processus spinosus", "Processus transversus", "Processus articularis", "Corpus vertebrae"], a: 1, hint: "Transversus — ko'ndalang" },
            { t: "quiz", q: "«Processus spinosus» o'zbekchada…", opts: ["Ko'ndalang o'simta", "Bo'g'im o'simtasi", "Qirrali (o'q) o'simta", "So'rg'ichsimon o'simta"], a: 2 },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan o'simtalar?", img: "assets/img/proc_articularis.jpg", opts: ["Processus articularis superior et inferior", "Processus spinosus", "Processus transversus", "Processus costarius"], a: 0 },
            { t: "match", pairs: [["Processus spinosus", "Qirrali o'simta"], ["Processus transversus", "Ko'ndalang o'simta"], ["Processus articularis superior", "Yuqorigi bo'g'im o'simtasi"], ["Processus articularis inferior", "Pastki bo'g'im o'simtasi"]] },
            { t: "build", q: "«Yuqorigi bo'g'im o'simtasi» atamasini yig'ing", answer: "Processus articularis superior", extra: ["inferior", "spinosus"] },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan teshik — ikki umurtqa orasidan nerv chiqadigan joy. U qanday ataladi?", img: "assets/img/foramen_intervertebrale.jpg", opts: ["Foramen vertebrale", "Foramen transversarium", "Foramen intervertebrale", "Hiatus sacralis"], a: 2, hint: "Inter — oraliq" },
            { t: "tf", q: "Processus transversus — qirrali o'simta.", a: false, why: "Processus transversus — ko'ndalang o'simta. Qirrali o'simta — processus spinosus." },
            { t: "quiz", q: "Ikki umurtqa orasidagi teshik (nerv chiqadigan) qanday ataladi?", opts: ["Foramen vertebrale", "Foramen intervertebrale", "Foramen transversarium", "Canalis sacralis"], a: 1 },
            { t: "build", q: "«Ko'ndalang o'simta» atamasini yig'ing", answer: "Processus transversus", extra: ["articularis", "superior"] }
          ]
        }
      ]
    },
    {
      id: "u2",
      title: "Bo'yin umurtqalari",
      color: "#1cb0f6",
      icon: "🔵",
      lessons: [
        {
          id: "l4",
          title: "Tipik bo'yin umurtqasi",
          xp: 20,
          ex: [
            { t: "quiz", q: "Bo'yin umurtqalari tuzilishiga ko'ra qanday turlarga bo'linadi?", opts: ["Katta va kichik", "Tipik va atipik", "Oldingi va orqa", "Yuqori va pastki"], a: 1 },
            { t: "quiz", q: "Bo'yin umurtqasini boshqa umurtqalardan ajratib turadigan MAXSUS teshik?", opts: ["Foramen vertebrale", "Foramen intervertebrale", "Foramen transversarium", "Foramen sacrale"], a: 2, hint: "Ko'ndalang o'simtadagi teshik" },
            { t: "img", q: "Foramen transversarium ichidan qaysi tomir o'tadi?", img: "assets/img/foramen_transversarium.jpg", opts: ["A. carotis", "A. vertebralis", "V. jugularis", "Aorta"], a: 1, hint: "Umurtqa arteriyasi" },
            { t: "quiz", q: "Bo'yin umurtqasining ko'ndalang o'simtasida qanday do'mboqchalar bor?", opts: ["Tuberculum anterius va posterius", "Tuberculum majus va minus", "Cornu superius va inferius", "Crista mediana va lateralis"], a: 0 },
            { t: "match", pairs: [["Foramen transversarium", "Ko'ndalang o'simta teshigi"], ["Tuberculum anterius", "Oldingi do'mboqcha"], ["Tuberculum posterius", "Orqa do'mboqcha"], ["Typicus", "Tipik"]] },
            { t: "img", q: "Rasmdagi umurtqalar qaysi bo'limga tegishli?", img: "assets/img/cervical_overview.jpg", opts: ["Vertebrae lumbales", "Vertebrae thoracicae", "Vertebrae cervicales", "Os sacrum"], a: 2 },
            { t: "build", q: "«Ko'ndalang o'simta teshigi» atamasini yig'ing", answer: "Foramen transversarium", extra: ["vertebrale", "intervertebrale"] },
            { t: "tf", q: "Foramen transversarium barcha umurtqalarda uchraydi.", a: false, why: "Bu teshik faqat bo'yin umurtqalarida bor." },
            { t: "quiz", q: "Bo'yin umurtqalarining processus spinosus'i (C2–C6) qanday shaklda?", opts: ["Uzun va bir uchli", "Uchi ikkiga ayrilgan (bifidus)", "Yumaloq", "Yo'q"], a: 1 }
          ]
        },
        {
          id: "l5",
          title: "Atlas (C1)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Birinchi bo'yin umurtqasi qanday nomlanadi?", opts: ["Axis", "Atlas", "Vertebra prominens", "Promontorium"], a: 1, hint: "Yunon afsonasidagi osmoni ko'targan pahlavon" },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan umurtqa?", img: "assets/img/atlas_green.jpg", opts: ["Axis (C2)", "Atlas (C1)", "C7", "Th1"], a: 1 },
            { t: "quiz", q: "Atlasda quyidagilardan qaysi biri MAVJUD EMAS?", opts: ["Arcus anterior", "Corpus vertebrae", "Massae laterales", "Foramen transversarium"], a: 1, hint: "Atlasda tana, qirrali o'simta va bo'g'im o'simtalari yo'q" },
            { t: "quiz", q: "Atlasning oldingi ravog'ida joylashgan, tish bilan bo'g'im hosil qiladigan chuqurcha?", opts: ["Fovea costalis", "Fovea dentis", "Fovea articularis superior", "Facies auricularis"], a: 1, hint: "Dens — tish" },
            { t: "match", pairs: [["Arcus anterior", "Oldingi ravoq"], ["Arcus posterior", "Orqa ravoq"], ["Massae laterales", "Yon massalar"], ["Fovea dentis", "Tish chuqurchasi"]] },
            { t: "quiz", q: "Atlasning orqa ravog'i ustidagi egat (a. vertebralis o'tadigan)?", opts: ["Sulcus costae", "Sulcus arteriae vertebralis", "Canalis sacralis", "Incisura vertebralis"], a: 1 },
            { t: "build", q: "«Tish chuqurchasi» atamasini yig'ing", answer: "Fovea dentis", extra: ["costalis", "articularis"] },
            { t: "tf", q: "Atlasda processus spinosus mavjud emas.", a: true, why: "Atlasda corpus, processus spinosus va processus articularis yo'q." },
            { t: "img", q: "Bosh suyagi bilan bo'g'im hosil qiladigan chuqurcha (atlasning yuqori yuzasida)?", img: "assets/img/atlas_labeled.jpg", opts: ["Fovea articularis superior", "Fovea articularis inferior", "Fovea dentis", "Fovea costalis"], a: 0 },
            { t: "quiz", q: "Atlasning yon massalari qanday ataladi?", opts: ["Corpus laterales", "Massae laterales", "Partes laterales", "Alae laterales"], a: 1 }
          ]
        },
        {
          id: "l6",
          title: "Axis (C2)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Ikkinchi bo'yin umurtqasi qanday nomlanadi?", opts: ["Atlas", "Axis", "Prominens", "Sacrum"], a: 1, hint: "Axis — o'q" },
            { t: "img", q: "Axisning eng xarakterli tuzilmasi — tanadan yuqoriga ko'tarilgan «tish». Lotincha nomi?", img: "assets/img/axis_green.jpg", opts: ["Dens", "Apex", "Cornu", "Crista"], a: 0 },
            { t: "quiz", q: "Dens axisning uchi qanday ataladi?", opts: ["Basis dentis", "Collum dentis", "Apex dentis", "Corpus dentis"], a: 2, hint: "Apex — uchi" },
            { t: "quiz", q: "Dens axisning bo'yni qanday ataladi?", opts: ["Apex dentis", "Collum dentis", "Cervix axis", "Radix dentis"], a: 1 },
            { t: "match", pairs: [["Dens", "Tish"], ["Apex dentis", "Tish uchi"], ["Collum dentis", "Tish bo'yni"], ["Facies articularis anterior", "Oldingi bo'g'im yuzasi"]] },
            { t: "img", q: "Rasmdagi umurtqa qaysi?", img: "assets/img/axis_labeled.jpg", opts: ["Atlas (C1)", "Axis (C2)", "C7", "L1"], a: 1 },
            { t: "build", q: "«Tish uchi» atamasini yig'ing", answer: "Apex dentis", extra: ["collum", "axis"] },
            { t: "tf", q: "Dens atlasning fovea dentis'i bilan bo'g'im hosil qiladi.", a: true },
            { t: "quiz", q: "Densning oldingi va orqa bo'g'im yuzalari qanday ataladi?", opts: ["Fovea anterior et posterior", "Facies articularis anterior et posterior", "Tuberculum anterius et posterius", "Arcus anterior et posterior"], a: 1 }
          ]
        },
        {
          id: "l7",
          title: "C3–C7 umurtqalar",
          xp: 25,
          ex: [
            { t: "quiz", q: "6-bo'yin umurtqasining oldingi do'mboqchasi alohida nomga ega. U qanday ataladi?", opts: ["Tuberculum posterius", "Tuberculum caroticum", "Tuberculum majus", "Promontorium"], a: 1, hint: "Uyqu arteriyasini bosib qon oqishini to'xtatish mumkin" },
            { t: "quiz", q: "Tuberculum caroticum o'zbekchada…", opts: ["Uyqu do'mboqchasi", "Bo'yin do'mboqchasi", "Orqa do'mboqcha", "Tish do'mboqchasi"], a: 0 },
            { t: "quiz", q: "7-bo'yin umurtqasi (processus spinosus'i uzun, teridan bo'rtib turadi) qanday nomlanadi?", opts: ["Atlas", "Axis", "Vertebra prominens", "Vertebra caroticum"], a: 2, hint: "Prominens — bo'rtib chiquvchi" },
            { t: "img", q: "Tuberculum caroticum qaysi umurtqada joylashgan?", img: "assets/img/cervical_labeled.jpg", opts: ["C1", "C4", "C6", "C7"], a: 2 },
            { t: "match", pairs: [["Tuberculum caroticum", "Uyqu do'mboqchasi (C6)"], ["Vertebra prominens", "Bo'rtib turuvchi umurtqa (C7)"], ["Facies articularis superior", "Yuqorigi bo'g'im yuzasi"], ["Facies articularis inferior", "Pastki bo'g'im yuzasi"]] },
            { t: "build", q: "«Uyqu do'mboqchasi» atamasini yig'ing", answer: "Tuberculum caroticum", extra: ["anterius", "prominens"] },
            { t: "tf", q: "Vertebra prominens — bu 7-bo'yin umurtqasi.", a: true },
            { t: "quiz", q: "Nima uchun C7 «prominens» deb ataladi?", opts: ["Eng kichik bo'lgani uchun", "Processus spinosus'i uzun va teridan bo'rtib turgani uchun", "Teshigi katta bo'lgani uchun", "Tanasi yo'q bo'lgani uchun"], a: 1 },
            { t: "tf", q: "Tuberculum caroticum C4 umurtqada joylashgan.", a: false, why: "Tuberculum caroticum — C6 umurtqaning oldingi do'mboqchasi." }
          ]
        }
      ]
    },
    {
      id: "u3",
      title: "Ko'krak va bel",
      color: "#ff9600",
      icon: "🟠",
      lessons: [
        {
          id: "l8",
          title: "Ko'krak umurtqalari",
          xp: 25,
          ex: [
            { t: "quiz", q: "Ko'krak umurtqalarini boshqalardan ajratib turuvchi asosiy belgi?", opts: ["Foramen transversarium", "Qovurg'a chuqurchalari (fovea costales)", "Dens", "Massae laterales"], a: 1, hint: "Qovurg'alar bilan bo'g'im hosil qiladi" },
            { t: "img", q: "Rasmda ko'rsatilgan qovurg'a boshi birikadigan chuqurchalar qanday ataladi?", img: "assets/img/thoracic_fovea.jpg", opts: ["Fovea dentis", "Fovea costalis superior et inferior", "Fovea articularis", "Foramen costale"], a: 1 },
            { t: "quiz", q: "Ko'ndalang o'simtadagi qovurg'a do'mbog'i birikadigan chuqurcha?", opts: ["Fovea costalis transversalis", "Fovea costalis superior", "Fovea dentis", "Incisura costalis"], a: 0 },
            { t: "quiz", q: "«Incisura vertebralis superior» nimani anglatadi?", opts: ["Yuqorigi umurtqa o'ymasi", "Yuqorigi bo'g'im o'simtasi", "Yuqorigi teshik", "Yuqorigi ravoq"], a: 0, hint: "Incisura — o'yma" },
            { t: "match", pairs: [["Fovea costalis superior", "Yuqorigi qovurg'a chuqurchasi"], ["Fovea costalis inferior", "Pastki qovurg'a chuqurchasi"], ["Fovea costalis transversalis", "Ko'ndalang qovurg'a chuqurchasi"], ["Incisura vertebralis", "Umurtqa o'ymasi"]] },
            { t: "build", q: "«Ko'ndalang qovurg'a chuqurchasi» atamasini yig'ing", answer: "Fovea costalis transversalis", extra: ["superior", "dentis"] },
            { t: "tf", q: "Ko'krak umurtqalarida foramen transversarium bor.", a: false, why: "Foramen transversarium faqat bo'yin umurtqalarida. Ko'krak umurtqalarida fovea costales bor." },
            { t: "img", q: "Rasmdagi umurtqa qaysi bo'limga tegishli?", img: "assets/img/thoracic_labeled.jpg", opts: ["Bo'yin", "Ko'krak", "Bel", "Dumg'aza"], a: 1 },
            { t: "quiz", q: "Ko'krak umurtqalarining processus spinosus'i qanday yo'nalgan?", opts: ["Gorizontal", "Yuqoriga", "Pastga qiya (cherepitsasimon)", "Yon tomonga"], a: 2 }
          ]
        },
        {
          id: "l9",
          title: "Bel umurtqalari",
          xp: 25,
          ex: [
            { t: "quiz", q: "Bel umurtqalarining eng katta ajralib turuvchi belgisi?", opts: ["Eng kichik tanasi", "Eng katta va massiv tanasi", "Foramen transversarium", "Fovea costales"], a: 1 },
            { t: "quiz", q: "Bel umurtqasidagi qovurg'a rudimenti bo'lgan o'simta?", opts: ["Processus costarius", "Processus mamillaris", "Processus accessorius", "Processus spinosus"], a: 0, hint: "Costa — qovurg'a" },
            { t: "quiz", q: "«Processus mamillaris» o'zbekchada…", opts: ["Qo'shimcha o'simta", "So'rg'ichsimon o'simta", "Qovurg'a o'simtasi", "Ko'ndalang o'simta"], a: 1 },
            { t: "quiz", q: "«Processus accessorius» o'zbekchada…", opts: ["Qo'shimcha o'simta", "So'rg'ichsimon o'simta", "Bo'g'im o'simtasi", "Qirrali o'simta"], a: 0 },
            { t: "img", q: "Rasmdagi umurtqa qaysi bo'limga tegishli?", img: "assets/img/lumbar_labeled.jpg", opts: ["Bo'yin", "Ko'krak", "Bel", "Dum"], a: 2 },
            { t: "match", pairs: [["Processus costarius", "Qovurg'a o'simtasi"], ["Processus accessorius", "Qo'shimcha o'simta"], ["Processus mamillaris", "So'rg'ichsimon o'simta"], ["Corpus vertebrae", "Umurtqa tanasi"]] },
            { t: "build", q: "«So'rg'ichsimon o'simta» atamasini yig'ing", answer: "Processus mamillaris", extra: ["costarius", "accessorius"] },
            { t: "tf", q: "Bel umurtqalari 5 ta.", a: true },
            { t: "quiz", q: "Bel umurtqalarining processus spinosus'i qanday shaklda?", opts: ["Uzun va pastga qiya", "Keng, yassi, gorizontal", "Ikkiga ayrilgan", "Mavjud emas"], a: 1 }
          ]
        }
      ]
    },
    {
      id: "u4",
      title: "Dumg'aza va dum",
      color: "#ce82ff",
      icon: "🟣",
      lessons: [
        {
          id: "l10",
          title: "Os sacrum — asosiy qismlar",
          xp: 25,
          ex: [
            { t: "quiz", q: "Os sacrum nechta umurtqaning qo'shilishidan hosil bo'ladi?", opts: ["3", "4", "5", "7"], a: 2 },
            { t: "img", q: "Dumg'azaning keng yuqori qismi qanday ataladi?", img: "assets/img/sacrum_basis.jpg", opts: ["Apex ossis sacri", "Basis ossis sacri", "Ala ossis sacri", "Cornu sacrale"], a: 1, hint: "Basis — asos" },
            { t: "quiz", q: "Dumg'azaning pastki tor uchi qanday ataladi?", opts: ["Basis ossis sacri", "Apex ossis sacri", "Promontorium", "Hiatus sacralis"], a: 1 },
            { t: "quiz", q: "Basis ossis sacri'ning oldinga bo'rtib chiqqan qismi (L5 bilan chegarada)?", opts: ["Promontorium", "Apex", "Cornu", "Crista"], a: 0, hint: "Burun kabi oldinga chiqib turadi" },
            { t: "quiz", q: "Dumg'azaning «qanotlari» qanday ataladi?", opts: ["Cornua sacralia", "Alae ossis sacri", "Cristae sacrales", "Lineae transversae"], a: 1, hint: "Ala — qanot" },
            { t: "match", pairs: [["Basis ossis sacri", "Dumg'aza asosi"], ["Apex ossis sacri", "Dumg'aza uchi"], ["Ala ossis sacri", "Dumg'aza qanoti"], ["Promontorium", "Burtiq (tumshuq)"]] },
            { t: "quiz", q: "Dumg'azaning chanoqqa qaragan yuzasi qanday ataladi?", opts: ["Facies dorsalis", "Facies pelvina", "Facies auricularis", "Facies articularis"], a: 1, hint: "Pelvis — chanoq" },
            { t: "build", q: "«Dumg'aza asosi» atamasini yig'ing", answer: "Basis ossis sacri", extra: ["apex", "ala"] },
            { t: "tf", q: "Facies pelvina — dumg'azaning orqa (dorsal) yuzasi.", a: false, why: "Facies pelvina — oldingi, chanoqqa qaragan yuzasi. Orqa yuzasi — facies dorsalis." },
            { t: "img", q: "Rasmda ko'rsatilgan chanoq yuzasidagi teshiklar qanday ataladi?", img: "assets/img/sacrum_labeled.jpg", opts: ["Foramina sacralia pelvina (anteriora)", "Foramina sacralia dorsalia", "Foramen vertebrale", "Foramen transversarium"], a: 0 }
          ]
        },
        {
          id: "l11",
          title: "Os sacrum — qirralar va kanal",
          xp: 25,
          ex: [
            { t: "quiz", q: "Dumg'azaning orqa yuzasidagi O'RTA qirra qanday ataladi?", opts: ["Crista sacralis lateralis", "Crista sacralis mediana", "Crista sacralis intermedia", "Crista iliaca"], a: 1, hint: "Mediana — o'rta" },
            { t: "quiz", q: "Crista sacralis mediana nimaning qo'shilishidan hosil bo'lgan?", opts: ["Ko'ndalang o'simtalar", "Processus spinosus'lar", "Bo'g'im o'simtalari", "Qovurg'alar"], a: 1 },
            { t: "quiz", q: "Dumg'aza kanali qanday ataladi?", opts: ["Canalis vertebralis", "Canalis sacralis", "Hiatus sacralis", "Foramen sacrale"], a: 1 },
            { t: "img", q: "Kanalning pastki ochiq qismi (rasmda ko'rsatilgan) qanday ataladi?", img: "assets/img/sacrum_cornu.jpg", opts: ["Hiatus sacralis", "Canalis sacralis", "Apex sacralis", "Foramen sacrale"], a: 0, hint: "Hiatus — tirqish" },
            { t: "quiz", q: "Hiatus sacralis yon tomonlarida joylashgan shoxchalar?", opts: ["Cornua coccygea", "Cornua sacralia", "Alae sacrales", "Cristae sacrales"], a: 1, hint: "Cornu — shox" },
            { t: "match", pairs: [["Crista sacralis mediana", "O'rta qirra"], ["Crista sacralis intermedia", "Oraliq qirra"], ["Crista sacralis lateralis", "Yon qirra"], ["Canalis sacralis", "Dumg'aza kanali"]] },
            { t: "quiz", q: "Yonbosh suyagi bilan bo'g'im hosil qiluvchi quloqsimon yuza?", opts: ["Facies pelvina", "Facies auricularis", "Facies dorsalis", "Facies lunata"], a: 1, hint: "Auricula — quloqcha" },
            { t: "img", q: "Rasmda YASHIL rangda ko'rsatilgan teshiklar?", img: "assets/img/sacrum_foramina.jpg", opts: ["Foramina sacralia pelvina", "Foramina sacralia dorsalia (posteriora)", "Foramina intervertebralia", "Foramina transversaria"], a: 1 },
            { t: "build", q: "«O'rta dumg'aza qirrasi» atamasini yig'ing", answer: "Crista sacralis mediana", extra: ["lateralis", "intermedia"] },
            { t: "tf", q: "Facies auricularis quloqsimon shaklda bo'lib, yonbosh suyagi bilan bo'g'im hosil qiladi.", a: true }
          ]
        },
        {
          id: "l12",
          title: "Os coccygis",
          xp: 20,
          ex: [
            { t: "quiz", q: "Os coccygis — bu…", opts: ["Dumg'aza suyagi", "Dum suyagi", "Yonbosh suyagi", "Qov suyagi"], a: 1 },
            { t: "img", q: "Dum suyagining yuqoriga yo'nalgan shoxchalari qanday ataladi?", img: "assets/img/coccyx_green.jpg", opts: ["Cornua sacralia", "Cornua coccygea", "Processus transversi", "Alae coccygea"], a: 1 },
            { t: "quiz", q: "Os coccygis'da qanday tuzilmalar farqlanadi?", opts: ["Corpus, cornua, processus transversi", "Dens, apex, collum", "Basis, ala, promontorium", "Arcus anterior va posterior"], a: 0 },
            { t: "match", pairs: [["Corpus coccygis", "Dum suyagi tanasi"], ["Cornua coccygea", "Dum suyagi shoxchalari"], ["Processus transversi", "Ko'ndalang o'simtalar"], ["Os coccygis", "Dum suyagi"]] },
            { t: "build", q: "«Dum suyagi shoxchalari» atamasini yig'ing", answer: "Cornua coccygea", extra: ["sacralia", "processus"] },
            { t: "tf", q: "Cornua coccygea cornua sacralia bilan birikadi.", a: true },
            { t: "quiz", q: "Os coccygis odatda nechta rudimentar umurtqadan iborat?", opts: ["1–2", "3–5", "6–7", "8–10"], a: 1 },
            { t: "tf", q: "Os coccygis — umurtqa pog'onasining eng pastki bo'limi.", a: true }
          ]
        }
      ]
    },
    {
      id: "u5",
      title: "Ko'krak qafasi suyaklari",
      color: "#ef4444",
      icon: "🩻",
      lessons: [
        {
          id: "l13",
          title: "Qovurg'alar (Costae)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Qovurg'alar lotinchada qanday ataladi?", opts: ["Costae", "Sternum", "Clavicula", "Scapula"], a: 0 },
            { t: "quiz", q: "Odamda necha juft qovurg'a bor?", opts: ["10", "11", "12", "14"], a: 2 },
            { t: "quiz", q: "Qovurg'alar orqa tomonda qaysi suyaklar bilan bo'g'im hosil qiladi?", opts: ["To'sh suyagi", "Ko'krak umurtqalari", "Bel umurtqalari", "O'mrov suyagi"], a: 1, hint: "Fovea costales orqali" },
            { t: "quiz", q: "Qovurg'a boshi lotinchada qanday ataladi?", opts: ["Collum costae", "Caput costae", "Corpus costae", "Tuberculum costae"], a: 1 },
            { t: "quiz", q: "Qovurg'a tanasining ichki yuzasidagi egat (tomir va nerv o'tadi)?", opts: ["Sulcus costae", "Sulcus vertebralis", "Sulcus arteriae vertebralis", "Sulcus bicipitalis"], a: 0 },
            { t: "match", pairs: [["Caput costae", "Qovurg'a boshi"], ["Collum costae", "Qovurg'a bo'yni"], ["Tuberculum costae", "Qovurg'a do'mbog'i"], ["Corpus costae", "Qovurg'a tanasi"]] },
            { t: "build", q: "«Qovurg'a boshi» atamasini yig'ing", answer: "Caput costae", extra: ["collum", "corpus"] },
            { t: "quiz", q: "To'sh suyagiga bevosita birikadigan qovurg'alar qaysi?", opts: ["I–VII", "VIII–X", "XI–XII", "Barchasi"], a: 0, hint: "Costae verae — chin qovurg'alar" },
            { t: "quiz", q: "VIII–X qovurg'alar qanday nomlanadi?", opts: ["Costae verae", "Costae spuriae", "Costae fluctuantes", "Costae bifidae"], a: 1, hint: "Spuriae — soxta" },
            { t: "tf", q: "XI–XII qovurg'alar costae fluctuantes (erkin qovurg'alar) deb ataladi.", a: true },
            { t: "quiz", q: "Qovurg'a do'mbog'i (tuberculum costae) umurtqaning qaysi qismi bilan bo'g'im hosil qiladi?", opts: ["Corpus vertebrae", "Fovea costalis transversalis", "Processus spinosus", "Foramen vertebrale"], a: 1 },
            { t: "quiz", q: "Qovurg'a boshidagi ikkita bo'g'im yuzasi orasidagi qirra?", opts: ["Crista capitis costae", "Crista colli costae", "Linea aspera", "Spina costae"], a: 0 }
          ]
        },
        {
          id: "l14",
          title: "To'sh suyagi (Sternum)",
          xp: 20,
          ex: [
            { t: "quiz", q: "To'sh suyagi lotinchada qanday ataladi?", opts: ["Sternum", "Sacrum", "Scapula", "Stapes"], a: 0 },
            { t: "quiz", q: "To'sh suyagi qanday qismlardan iborat?", opts: ["Manubrium, corpus, processus xiphoideus", "Caput, collum, corpus", "Basis, apex, ala", "Squama, corpus, ramus"], a: 0 },
            { t: "quiz", q: "To'sh suyagining yuqori keng qismi qanday ataladi?", opts: ["Corpus sterni", "Manubrium sterni", "Processus xiphoideus", "Angulus sterni"], a: 1, hint: "Manubrium — dasta" },
            { t: "quiz", q: "Manubriumning yuqori chetidagi o'yma?", opts: ["Incisura clavicularis", "Incisura jugularis", "Incisura costalis", "Incisura vertebralis"], a: 1, hint: "Jugulum — bo'yinturuq" },
            { t: "quiz", q: "O'mrov suyagi bilan bo'g'im hosil qiladigan o'yma?", opts: ["Incisura jugularis", "Incisura costalis", "Incisura clavicularis", "Fovea dentis"], a: 2 },
            { t: "match", pairs: [["Manubrium sterni", "Dasta"], ["Corpus sterni", "Tana"], ["Processus xiphoideus", "Xanjar o'simta"], ["Incisura jugularis", "Bo'yinturuq o'ymasi"]] },
            { t: "quiz", q: "Dasta bilan tana chegarasidagi burchak (II qovurg'a sohasida)?", opts: ["Angulus sterni", "Angulus costae", "Angulus mandibulae", "Angulus inferior"], a: 0, hint: "Angulus Ludovici" },
            { t: "build", q: "«Xanjar o'simta» atamasini yig'ing", answer: "Processus xiphoideus", extra: ["manubrium", "jugularis"] },
            { t: "quiz", q: "Ko'krak qafasi lotinchada qanday ataladi?", opts: ["Thorax", "Pelvis", "Cranium", "Abdomen"], a: 0 },
            { t: "quiz", q: "Ko'krak qafasining yuqori teshigi?", opts: ["Apertura thoracis inferior", "Apertura thoracis superior", "Hiatus aorticus", "Foramen magnum"], a: 1 },
            { t: "tf", q: "Processus xiphoideus yosh o'tgan sari suyaklanib qoladi.", a: true }
          ]
        }
      ]
    },
    {
      id: "u6",
      title: "Qo'l skeleti",
      color: "#f59e0b",
      icon: "💪",
      lessons: [
        {
          id: "l15",
          title: "Yelka kamari (Scapula · Clavicula)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Yelka kamari qaysi suyaklardan tashkil topgan?", opts: ["Clavicula va scapula", "Humerus va radius", "Sternum va costa", "Os coxae va femur"], a: 0 },
            { t: "quiz", q: "O'mrov suyagi lotinchada qanday ataladi?", opts: ["Clavicula", "Scapula", "Costa", "Clavis"], a: 0 },
            { t: "quiz", q: "Kurak suyagi lotinchada qanday ataladi?", opts: ["Clavicula", "Scapula", "Sternum", "Sacrum"], a: 1 },
            { t: "quiz", q: "Kurak suyagining yelka suyagi bilan bo'g'im hosil qiladigan chuqurchasi?", opts: ["Fossa subscapularis", "Cavitas glenoidalis", "Acetabulum", "Fovea dentis"], a: 1, hint: "Glenoidalis — bo'g'imga oid" },
            { t: "quiz", q: "Kurak suyagi orqa yuzasidagi qirra?", opts: ["Spina scapulae", "Linea aspera", "Crista iliaca", "Crista sacralis"], a: 0 },
            { t: "quiz", q: "Spina scapulae'ning uchida joylashgan, o'mrov bilan bo'g'im hosil qiladigan o'simta?", opts: ["Processus coracoideus", "Acromion", "Processus styloideus", "Olecranon"], a: 1 },
            { t: "quiz", q: "Kurak suyagining oldinga yo'nalgan «tumshuqsimon» o'simtasi?", opts: ["Acromion", "Processus coracoideus", "Processus mastoideus", "Processus xiphoideus"], a: 1 },
            { t: "match", pairs: [["Clavicula", "O'mrov suyagi"], ["Scapula", "Kurak suyagi"], ["Acromion", "Yelka uchki o'simtasi"], ["Cavitas glenoidalis", "Bo'g'im chuqurchasi"]] },
            { t: "build", q: "«Yelka uchki o'simtasi» atamasini yig'ing", answer: "Acromion", extra: ["coracoideus", "olecranon"] },
            { t: "quiz", q: "Kurak suyagining qovurg'alarga qaragan yuzasidagi chuqurcha?", opts: ["Fossa supraspinata", "Fossa infraspinata", "Fossa subscapularis", "Cavitas glenoidalis"], a: 2 },
            { t: "quiz", q: "Claviculaning to'sh suyagiga qaragan uchi?", opts: ["Extremitas acromialis", "Extremitas sternalis", "Caput claviculae", "Tuberculum"], a: 1 },
            { t: "tf", q: "Acromion o'mrov suyagining akromial uchi bilan bo'g'im hosil qiladi.", a: true }
          ]
        },
        {
          id: "l16",
          title: "Yelka suyagi (Humerus)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Yelka suyagi lotinchada qanday ataladi?", opts: ["Humerus", "Femur", "Radius", "Ulna"], a: 0 },
            { t: "quiz", q: "Yelka suyagining boshi qanday ataladi?", opts: ["Caput humeri", "Collum humeri", "Tuberculum", "Condylus"], a: 0 },
            { t: "quiz", q: "Boshning chetidagi halqasimon botiq (anatomik)?", opts: ["Collum chirurgicum", "Collum anatomicum", "Tuberculum majus", "Epicondylus"], a: 1 },
            { t: "quiz", q: "Sinishlar ko'p uchraydigan, boshdan pastroq toraygan joy?", opts: ["Collum anatomicum", "Collum chirurgicum", "Diaphysis", "Metaphysis"], a: 1, hint: "Chirurgicum — jarrohlik bo'yni" },
            { t: "quiz", q: "Yelka suyagining katta va kichik do'mboqchalari?", opts: ["Tuberculum majus et minus", "Trochanter major et minor", "Epicondylus medialis et lateralis", "Condylus medialis et lateralis"], a: 0 },
            { t: "quiz", q: "Ikki do'mboqcha orasidagi egat (biceps payi o'tadi)?", opts: ["Sulcus intertubercularis", "Sulcus bicipitalis", "Sulcus nervi radialis", "Sulcus costae"], a: 0 },
            { t: "match", pairs: [["Caput humeri", "Yelka suyagi boshi"], ["Tuberculum majus", "Katta do'mboqcha"], ["Tuberculum minus", "Kichik do'mboqcha"], ["Sulcus intertubercularis", "Do'mboqchalararo egat"]] },
            { t: "quiz", q: "Yelka suyagining pastki uchidagi yumaloq bo'g'im yuzasi (radius bilan)?", opts: ["Capitulum humeri", "Caput humeri", "Trochlea", "Fossa olecrani"], a: 0, hint: "Capitulum — boshcha" },
            { t: "quiz", q: "Tirsak suyagi bilan bo'g'im hosil qiladigan blok?", opts: ["Trochlea humeri", "Capitulum humeri", "Epicondylus", "Fossa radialis"], a: 0 },
            { t: "quiz", q: "Orqa yuzadagi chuqurcha (bilakni yozganda olecranon kiradi)?", opts: ["Fossa olecrani", "Fossa coronoidea", "Fossa radialis", "Fossa glenoidalis"], a: 0 },
            { t: "build", q: "«Yelka suyagi boshi» atamasini yig'ing", answer: "Caput humeri", extra: ["femur", "radius"] },
            { t: "tf", q: "Nervus radialis yelka suyagining sulcus nervi radialis'dan o'tadi.", a: true }
          ]
        },
        {
          id: "l17",
          title: "Bilak va kaft suyaklari",
          xp: 30,
          ex: [
            { t: "quiz", q: "Bilak suyaklari qaysilar?", opts: ["Radius va ulna", "Tibia va fibula", "Humerus va scapula", "Femur va patella"], a: 0 },
            { t: "quiz", q: "Bosh barmoq tomonidagi bilak suyagi?", opts: ["Ulna", "Radius", "Humerus", "Fibula"], a: 1, hint: "Radius — tashqi tomonda" },
            { t: "quiz", q: "Tirsak suyagi lotinchada qanday ataladi?", opts: ["Radius", "Ulna", "Ulcus", "Umbilicus"], a: 1 },
            { t: "quiz", q: "Tirsak suyagining yuqori uchidagi katta o'simta (tirsak suyanchig'i)?", opts: ["Olecranon", "Acromion", "Malleolus", "Tuberculum"], a: 0 },
            { t: "quiz", q: "Radiusning pastki uchidagi bigizsimon o'simta?", opts: ["Processus styloideus", "Processus coracoideus", "Processus xiphoideus", "Olecranon"], a: 0 },
            { t: "match", pairs: [["Radius", "Bilak suyagi (bosh barmoq tomoni)"], ["Ulna", "Tirsak suyagi"], ["Olecranon", "Tirsak suyanchig'i"], ["Processus styloideus", "Bigizsimon o'simta"]] },
            { t: "quiz", q: "Kaft ildizi suyaklari (ossa carpi) nechta?", opts: ["5", "7", "8", "10"], a: 2 },
            { t: "quiz", q: "Kaft ildizi suyaklari lotinchada?", opts: ["Ossa carpi", "Ossa metacarpi", "Ossa tarsi", "Ossa digitorum"], a: 0 },
            { t: "quiz", q: "Kaft suyaklari (ossa metacarpi) nechta?", opts: ["4", "5", "6", "8"], a: 1 },
            { t: "quiz", q: "Bitta qo'lda nechta barmoq falangasi bor?", opts: ["12", "14", "15", "16"], a: 1, hint: "2 + 3 + 3 + 3 + 3" },
            { t: "build", q: "«Tirsak suyanchig'i» atamasini yig'ing", answer: "Olecranon", extra: ["acromion", "malleolus"] },
            { t: "quiz", q: "Bosh barmoq lotinchada qanday ataladi?", opts: ["Pollex", "Hallux", "Digitus", "Carpus"], a: 0 },
            { t: "tf", q: "Ossa carpi ikki qatorda joylashgan 8 ta suyakdan iborat.", a: true }
          ]
        }
      ]
    },
    {
      id: "u7",
      title: "Oyoq skeleti",
      color: "#10b981",
      icon: "🦵",
      lessons: [
        {
          id: "l18",
          title: "Chanoq kamari (Os coxae)",
          xp: 30,
          ex: [
            { t: "quiz", q: "Chanoq suyagi lotinchada qanday ataladi?", opts: ["Os coxae", "Os sacrum", "Os ilium", "Femur"], a: 0 },
            { t: "quiz", q: "Os coxae nechta suyakning qo'shilishidan hosil bo'ladi?", opts: ["2", "3", "4", "5"], a: 1, hint: "Ilium, ischium, pubis" },
            { t: "quiz", q: "Yonbosh suyagi lotinchada qanday ataladi?", opts: ["Os ischii", "Os pubis", "Os ilium", "Os coccygis"], a: 2 },
            { t: "quiz", q: "Quymich suyagi lotinchada qanday ataladi?", opts: ["Os ischii", "Os ilium", "Os pubis", "Os sacrum"], a: 0 },
            { t: "quiz", q: "Qov suyagi lotinchada qanday ataladi?", opts: ["Os pubis", "Os ischii", "Os ilium", "Os coxae"], a: 0 },
            { t: "quiz", q: "Uch suyak birlashib hosil qilgan chuqurcha (son suyagi boshi kiradi)?", opts: ["Acetabulum", "Cavitas glenoidalis", "Fossa iliaca", "Foramen obturatum"], a: 0 },
            { t: "quiz", q: "Yonbosh suyagining yuqori qirrasi?", opts: ["Crista iliaca", "Linea aspera", "Spina scapulae", "Crista sacralis"], a: 0 },
            { t: "quiz", q: "Yonbosh suyagining oldingi-ustki bo'rtig'i (klinik orientir)?", opts: ["Spina iliaca anterior superior", "Spina iliaca posterior superior", "Tuber ischiadicum", "Tuberculum pubicum"], a: 0 },
            { t: "quiz", q: "O'tirganda tayanch bo'ladigan quymich do'mbog'i?", opts: ["Tuber ischiadicum", "Spina ischiadica", "Crista iliaca", "Acetabulum"], a: 0 },
            { t: "match", pairs: [["Os ilium", "Yonbosh suyagi"], ["Os ischii", "Quymich suyagi"], ["Os pubis", "Qov suyagi"], ["Acetabulum", "Bo'g'im chuqurchasi"]] },
            { t: "quiz", q: "Qov suyaklarining oldingi birikishi?", opts: ["Symphysis pubica", "Articulatio sacroiliaca", "Acetabulum", "Ligamentum"], a: 0 },
            { t: "quiz", q: "Qov va quymich suyaklari orasidagi katta teshik?", opts: ["Foramen obturatum", "Foramen ischiadicum", "Foramen magnum", "Hiatus sacralis"], a: 0 },
            { t: "quiz", q: "Chanoqni katta va kichik qismlarga bo'luvchi chegara chizig'i?", opts: ["Linea terminalis", "Linea aspera", "Linea alba", "Linea transversa"], a: 0 },
            { t: "build", q: "«Yonbosh suyagi» atamasini yig'ing", answer: "Os ilium", extra: ["ischii", "pubis"] },
            { t: "tf", q: "Acetabulum ichiga femurning boshi kiradi.", a: true }
          ]
        },
        {
          id: "l19",
          title: "Son va boldir suyaklari",
          xp: 30,
          ex: [
            { t: "quiz", q: "Son suyagi lotinchada qanday ataladi?", opts: ["Femur", "Humerus", "Fibula", "Patella"], a: 0 },
            { t: "quiz", q: "Femurning boshi qanday ataladi?", opts: ["Caput femoris", "Collum femoris", "Trochanter major", "Condylus"], a: 0 },
            { t: "quiz", q: "Son suyagining boshini tanaga bog'lovchi qismi (sinish ko'p uchraydi)?", opts: ["Collum femoris", "Corpus femoris", "Trochanter", "Epicondylus"], a: 0 },
            { t: "quiz", q: "Femurning katta va kichik do'mboqlari?", opts: ["Trochanter major et minor", "Tuberculum majus et minus", "Epicondylus medialis et lateralis", "Malleolus medialis et lateralis"], a: 0 },
            { t: "quiz", q: "Son suyagining orqa yuzasidagi qo'pol qirra (mushaklar birikadi)?", opts: ["Linea aspera", "Crista iliaca", "Spina scapulae", "Linea alba"], a: 0 },
            { t: "quiz", q: "Tizza qopqog'i suyagi qanday ataladi?", opts: ["Patella", "Fibula", "Tibia", "Talus"], a: 0 },
            { t: "quiz", q: "Katta boldir suyagi lotinchada qanday ataladi?", opts: ["Tibia", "Fibula", "Tarsus", "Femur"], a: 0 },
            { t: "quiz", q: "Kichik boldir suyagi lotinchada qanday ataladi?", opts: ["Fibula", "Tibia", "Patella", "Ulna"], a: 0 },
            { t: "quiz", q: "Tibianing oldingi yuzasidagi do'mboqlik (pay birikadi)?", opts: ["Tuberositas tibiae", "Tuberculum majus", "Trochanter major", "Malleolus"], a: 0 },
            { t: "quiz", q: "To'piqning ichki suyak bo'rtig'i qanday ataladi?", opts: ["Malleolus medialis", "Malleolus lateralis", "Tuber calcanei", "Talus"], a: 0, hint: "Medialis — ichki" },
            { t: "quiz", q: "To'piqning tashqi bo'rtig'i (malleolus lateralis) qaysi suyakda?", opts: ["Tibia", "Fibula", "Talus", "Calcaneus"], a: 1 },
            { t: "match", pairs: [["Femur", "Son suyagi"], ["Patella", "Tizza qopqog'i"], ["Tibia", "Katta boldir suyagi"], ["Fibula", "Kichik boldir suyagi"]] },
            { t: "build", q: "«Son suyagi boshi» atamasini yig'ing", answer: "Caput femoris", extra: ["humeri", "radius"] },
            { t: "quiz", q: "Tibianing yuqori uchidagi ikkita bo'g'im yuzasi?", opts: ["Condylus medialis et lateralis", "Epicondylus medialis et lateralis", "Trochanter major et minor", "Malleolus medialis et lateralis"], a: 0 },
            { t: "tf", q: "Fibula tizza bo'g'imida ishtirok etmaydi.", a: true }
          ]
        },
        {
          id: "l20",
          title: "Oyoq panjasi (Ossa pedis)",
          xp: 25,
          ex: [
            { t: "quiz", q: "Oyoq panjasining orqa qismidagi suyaklar (ossa tarsi) nechta?", opts: ["5", "7", "8", "14"], a: 1 },
            { t: "quiz", q: "Oshiq suyagi lotinchada qanday ataladi?", opts: ["Talus", "Calcaneus", "Naviculare", "Cuboideum"], a: 0 },
            { t: "quiz", q: "Tovon suyagi lotinchada qanday ataladi?", opts: ["Calcaneus", "Talus", "Cuneiforme", "Metatarsus"], a: 0 },
            { t: "quiz", q: "Tovon suyagining orqaga bo'rtib chiqqan do'mbog'i (Axill payi birikadi)?", opts: ["Tuber calcanei", "Malleolus lateralis", "Tuberositas tibiae", "Tuberculum majus"], a: 0 },
            { t: "quiz", q: "Oyoq panjasining o'rta qismidagi qayiqsimon suyak?", opts: ["Os naviculare", "Os cuboideum", "Os cuneiforme", "Talus"], a: 0, hint: "Navicula — qayiq" },
            { t: "quiz", q: "Ponasimon suyaklar (ossa cuneiformia) nechta?", opts: ["1", "2", "3", "4"], a: 2, hint: "Mediale, intermedium, laterale" },
            { t: "quiz", q: "Oyoq kafti suyaklari (ossa metatarsi) nechta?", opts: ["5", "7", "8", "14"], a: 0 },
            { t: "match", pairs: [["Talus", "Oshiq suyagi"], ["Calcaneus", "Tovon suyagi"], ["Os naviculare", "Qayiqsimon suyak"], ["Os cuboideum", "Kubsimon suyak"]] },
            { t: "quiz", q: "Oyoq panjasining bo'rtib turgan uzunasiga yoyi qanday ataladi?", opts: ["Arcus pedis", "Linea aspera", "Crista iliaca", "Foramen"], a: 0, hint: "Oyoq gumbazi" },
            { t: "quiz", q: "Bitta oyoq panjasida nechta falanga bor?", opts: ["12", "14", "15", "16"], a: 1 },
            { t: "build", q: "«Tovon suyagi» atamasini yig'ing", answer: "Calcaneus", extra: ["Talus", "Naviculare"] },
            { t: "quiz", q: "Oyoqdagi bosh barmoq lotinchada qanday ataladi?", opts: ["Hallux", "Pollex", "Digitus", "Talus"], a: 0 },
            { t: "tf", q: "Talus boldir suyaklari bilan to'piq bo'g'imini hosil qiladi.", a: true }
          ]
        }
      ]
    },
    {
      id: "u8",
      title: "Kalla — miya qismi",
      color: "#64748b",
      icon: "💀",
      lessons: [
        {
          id: "l21",
          title: "Miya qismi suyaklari (umumiy)",
          xp: 20,
          ex: [
            { t: "quiz", q: "Kalla skeleti lotinchada qanday ataladi?", opts: ["Cranium", "Thorax", "Pelvis", "Columna"], a: 0 },
            { t: "quiz", q: "Kallaning miya qismi qanday ataladi?", opts: ["Neurocranium", "Viscerocranium", "Calvaria", "Splanchnocranium"], a: 0 },
            { t: "quiz", q: "Miya qismi (neurocranium) nechta suyakdan iborat?", opts: ["6", "8", "10", "14"], a: 1 },
            { t: "quiz", q: "Quyidagilardan qaysi biri TOQ (juft emas) suyak?", opts: ["Os frontale", "Os occipitale", "Os parietale", "Os ethmoidale"], a: 2, hint: "Parietale — juft" },
            { t: "quiz", q: "Toq miya suyaklari qaysi qatorda to'g'ri keltirilgan?", opts: ["Frontale, occipitale, sphenoidale, ethmoidale", "Parietale, temporale", "Maxilla, palatinum", "Nasale, lacrimale"], a: 0 },
            { t: "match", pairs: [["Neurocranium", "Kalla miya qismi"], ["Viscerocranium", "Kalla yuz qismi"], ["Calvaria", "Kalla gumbazi"], ["Basis cranii", "Kalla asosi"]] },
            { t: "quiz", q: "Kallaning gumbazi qanday ataladi?", opts: ["Calvaria", "Basis", "Sella", "Sinus"], a: 0 },
            { t: "build", q: "«Kalla miya qismi» atamasini yig'ing", answer: "Neurocranium", extra: ["Viscerocranium", "Calvaria"] },
            { t: "quiz", q: "Juft miya qismi suyaklari qaysilar?", opts: ["Parietale va temporale", "Frontale va occipitale", "Sphenoidale va ethmoidale", "Maxilla va zygomaticum"], a: 0 },
            { t: "tf", q: "Neurocranium 8 ta suyakdan iborat (4 toq va 2 juft).", a: true }
          ]
        },
        {
          id: "l22",
          title: "Ensa, tepa va peshona suyaklari",
          xp: 25,
          ex: [
            { t: "quiz", q: "Ensa suyagi lotinchada qanday ataladi?", opts: ["Os occipitale", "Os frontale", "Os parietale", "Os temporale"], a: 0 },
            { t: "quiz", q: "Ensa suyagidagi eng katta teshik (orqa miya o'tadi)?", opts: ["Foramen magnum", "Foramen ovale", "Foramen rotundum", "Foramen lacerum"], a: 0 },
            { t: "quiz", q: "Foramen magnum yonida, atlas bilan bo'g'im hosil qiladigan do'mboqchalar?", opts: ["Condylus occipitalis", "Processus mastoideus", "Tuberculum", "Epicondylus"], a: 0 },
            { t: "quiz", q: "Ensa suyagining tashqi yuzasidagi bo'rtiq?", opts: ["Protuberantia occipitalis externa", "Crista galli", "Tuber frontale", "Glabella"], a: 0, hint: "Inion" },
            { t: "quiz", q: "Tepa suyagi lotinchada qanday ataladi?", opts: ["Os parietale", "Os temporale", "Os occipitale", "Os frontale"], a: 0 },
            { t: "quiz", q: "Peshona suyagi lotinchada qanday ataladi?", opts: ["Os frontale", "Os parietale", "Os occipitale", "Os temporale"], a: 0 },
            { t: "quiz", q: "Peshona suyagining bo'rtib turgan sohalari (do'ng peshona joyi)?", opts: ["Tuber frontale", "Glabella", "Arcus superciliaris", "Crista galli"], a: 0 },
            { t: "quiz", q: "Qoshlar orasidagi tekis maydon qanday ataladi?", opts: ["Glabella", "Inion", "Nasion", "Vertex"], a: 0 },
            { t: "match", pairs: [["Os occipitale", "Ensa suyagi"], ["Os parietale", "Tepa suyagi"], ["Os frontale", "Peshona suyagi"], ["Foramen magnum", "Katta teshik"]] },
            { t: "quiz", q: "Peshona suyagi ichidagi havo bo'shlig'i?", opts: ["Sinus frontalis", "Sinus maxillaris", "Sinus sphenoidalis", "Cellulae ethmoidales"], a: 0 },
            { t: "build", q: "«Katta teshik» atamasini yig'ing", answer: "Foramen magnum", extra: ["ovale", "rotundum"] },
            { t: "quiz", q: "Tepa va ensa suyaklari tutashadigan nuqta?", opts: ["Lambda", "Bregma", "Pterion", "Asterion"], a: 0, hint: "Yunoncha λ harfi" },
            { t: "tf", q: "Condylus occipitalis atlasning fovea articularis superior'i bilan bo'g'im hosil qiladi.", a: true }
          ]
        },
        {
          id: "l23",
          title: "G'alvirsimon, ponasimon va chakka",
          xp: 25,
          ex: [
            { t: "quiz", q: "G'alvirsimon suyak lotinchada qanday ataladi?", opts: ["Os ethmoidale", "Os sphenoidale", "Os temporale", "Os palatinum"], a: 0 },
            { t: "quiz", q: "G'alvirsimon suyakning teshikli plastinkasi (hid nervlari o'tadi)?", opts: ["Lamina cribrosa", "Lamina perpendicularis", "Lamina papyracea", "Lamina horizontalis"], a: 0 },
            { t: "quiz", q: "Lamina cribrosa ustidagi xo'roz tojisimon o'simta?", opts: ["Crista galli", "Glabella", "Inion", "Sella turcica"], a: 0 },
            { t: "quiz", q: "Ponasimon suyak lotinchada qanday ataladi?", opts: ["Os sphenoidale", "Os ethmoidale", "Os temporale", "Os zygomaticum"], a: 0 },
            { t: "quiz", q: "Ponasimon suyak tanasidagi egarsimon chuqurlik (gipofiz joylashadi)?", opts: ["Sella turcica", "Fossa hypophysialis", "Crista galli", "Fovea dentis"], a: 0, hint: "Sella — egar" },
            { t: "quiz", q: "Sella turcica ichidagi, gipofiz bezi joylashadigan chuqurcha?", opts: ["Fossa hypophysialis", "Fossa pterygoidea", "Fossa temporalis", "Fossa cranii"], a: 0 },
            { t: "quiz", q: "Ponasimon suyakda nechta qanot bor?", opts: ["2 (katta va kichik)", "1", "3", "4"], a: 0 },
            { t: "quiz", q: "Chakka suyagi lotinchada qanday ataladi?", opts: ["Os temporale", "Os occipitale", "Os parietale", "Os frontale"], a: 0 },
            { t: "quiz", q: "Quloq orqasidagi so'rg'ichsimon o'simta?", opts: ["Processus mastoideus", "Processus styloideus", "Processus zygomaticus", "Processus coronoideus"], a: 0 },
            { t: "quiz", q: "Chakka suyagining bigizsimon o'simtasi?", opts: ["Processus styloideus", "Processus mastoideus", "Processus zygomaticus", "Acromion"], a: 0 },
            { t: "quiz", q: "Chakka suyagining toshsimon qismi (ichki quloq joylashadi)?", opts: ["Pars petrosa", "Squama temporalis", "Pars tympanica", "Pars mastoidea"], a: 0, hint: "Pyramis — piramida" },
            { t: "match", pairs: [["Os ethmoidale", "G'alvirsimon suyak"], ["Os sphenoidale", "Ponasimon suyak"], ["Os temporale", "Chakka suyagi"], ["Sella turcica", "Turk egari"]] },
            { t: "build", q: "«So'rg'ichsimon o'simta» atamasini yig'ing", answer: "Processus mastoideus", extra: ["styloideus", "zygomaticus"] },
            { t: "quiz", q: "Eshitish va muvozanat a'zosi chakka suyagining qaysi qismida joylashgan?", opts: ["Pars petrosa", "Squama", "Pars tympanica", "Processus zygomaticus"], a: 0 },
            { t: "tf", q: "Os ethmoidale kallaning miya qismiga kiradi.", a: true }
          ]
        }
      ]
    },
    {
      id: "u9",
      title: "Kalla — yuz qismi",
      color: "#a855f7",
      icon: "🦷",
      lessons: [
        {
          id: "l24",
          title: "Ustki jag' va tanglay suyagi",
          xp: 25,
          ex: [
            { t: "quiz", q: "Ustki jag' suyagi lotinchada qanday ataladi?", opts: ["Maxilla", "Mandibula", "Zygomaticum", "Palatinum"], a: 0 },
            { t: "quiz", q: "Ustki jag' suyagidagi eng katta havo bo'shlig'i (burun yonida)?", opts: ["Sinus maxillaris", "Sinus frontalis", "Sinus sphenoidalis", "Sinus ethmoidalis"], a: 0, hint: "Highmori bo'shlig'i" },
            { t: "quiz", q: "Sinus maxillaris yana kimning nomi bilan ataladi?", opts: ["Highmori", "Ludovici", "Fallopiy", "Vartoni"], a: 0 },
            { t: "quiz", q: "Ustki jag'dagi tishlar joylashadigan o'simta?", opts: ["Processus alveolaris", "Processus palatinus", "Processus frontalis", "Processus zygomaticus"], a: 0, hint: "Alveola — tish uyasi" },
            { t: "quiz", q: "Ko'z ostidagi teshik (nerv chiqadi)?", opts: ["Foramen infraorbitale", "Foramen supraorbitale", "Foramen mentale", "Foramen mandibulae"], a: 0 },
            { t: "quiz", q: "Qattiq tanglayning orqa qismini hosil qiluvchi suyak?", opts: ["Os palatinum", "Maxilla", "Vomer", "Mandibula"], a: 0 },
            { t: "quiz", q: "Tanglay suyagining ikkita plastinkasi?", opts: ["Lamina horizontalis et perpendicularis", "Lamina cribrosa et perpendicularis", "Lamina medialis et lateralis", "Squama et pars petrosa"], a: 0 },
            { t: "match", pairs: [["Maxilla", "Ustki jag' suyagi"], ["Os palatinum", "Tanglay suyagi"], ["Sinus maxillaris", "Yuqori jag' bo'shlig'i"], ["Processus alveolaris", "Tish o'simtasi"]] },
            { t: "build", q: "«Ustki jag' suyagi» atamasini yig'ing", answer: "Maxilla", extra: ["Mandibula", "Zygomaticum"] },
            { t: "quiz", q: "Tanglay suyagining gorizontal plastinkasi qattiq tanglayning qaysi qismini hosil qiladi?", opts: ["Orqa", "Oldingi", "O'rta", "Yon"], a: 0 },
            { t: "quiz", q: "Ikki ustki jag' tanalari birlashib hosil qilgan chok?", opts: ["Sutura palatina mediana", "Sutura sagittalis", "Sutura coronalis", "Sutura lambdoidea"], a: 0 },
            { t: "tf", q: "Sinus maxillaris yuqori jag'da joylashgan eng katta havo bo'shlig'idir.", a: true }
          ]
        },
        {
          id: "l25",
          title: "Pastki jag', yonoq va butun kalla",
          xp: 25,
          ex: [
            { t: "quiz", q: "Pastki jag' suyagi lotinchada qanday ataladi?", opts: ["Mandibula", "Maxilla", "Zygomaticum", "Vomer"], a: 0 },
            { t: "quiz", q: "Mandibula kallaning qanday suyagi?", opts: ["Yagona harakatchan suyagi", "Eng katta miya suyagi", "Juft suyak", "Ichki quloq suyagi"], a: 0 },
            { t: "quiz", q: "Pastki jag' tanasi qanday ataladi?", opts: ["Corpus mandibulae", "Ramus mandibulae", "Angulus mandibulae", "Caput mandibulae"], a: 0 },
            { t: "quiz", q: "Pastki jag'ning yuqoriga ko'tarilgan qismi?", opts: ["Ramus mandibulae", "Corpus mandibulae", "Angulus", "Processus alveolaris"], a: 0 },
            { t: "quiz", q: "Ramusning oldingi tojsimon o'simtasi?", opts: ["Processus coronoideus", "Processus condylaris", "Processus mastoideus", "Processus styloideus"], a: 0 },
            { t: "quiz", q: "Ramusning orqa bo'g'im o'simtasi (chakka suyagi bilan bo'g'im)?", opts: ["Processus condylaris", "Processus coronoideus", "Caput costae", "Condylus occipitalis"], a: 0 },
            { t: "quiz", q: "Chakka-pastki jag' bo'g'imi lotinchada qanday ataladi?", opts: ["Articulatio temporomandibularis", "Articulatio atlantooccipitalis", "Symphysis", "Articulatio sternoclavicularis"], a: 0, hint: "TMP bo'g'imi" },
            { t: "quiz", q: "Yonoq suyagi lotinchada qanday ataladi?", opts: ["Os zygomaticum", "Os nasale", "Os lacrimale", "Vomer"], a: 0 },
            { t: "match", pairs: [["Mandibula", "Pastki jag' suyagi"], ["Os zygomaticum", "Yonoq suyagi"], ["Processus coronoideus", "Tojsimon o'simta"], ["Articulatio temporomandibularis", "Chakka-jag' bo'g'imi"]] },
            { t: "quiz", q: "Yangi tug'ilgan chaqaloq kallasidagi suyaklar orasidagi yumshoq soha (liqildoq)?", opts: ["Fonticulus", "Sutura", "Foramen", "Sinus"], a: 0 },
            { t: "build", q: "«Pastki jag' suyagi» atamasini yig'ing", answer: "Mandibula", extra: ["Maxilla", "Zygomaticum"] },
            { t: "quiz", q: "Katta liqildoq (fonticulus anterior) qaysi suyaklar chegarasida?", opts: ["Peshona va tepa", "Ensa va chakka", "Ponasimon va ensa", "Chakka va tepa"], a: 0 },
            { t: "tf", q: "Mandibula kalla skeletining yagona harakatchan suyagidir.", a: true }
          ]
        }
      ]
    }
  ]
};

// ================== ATLAS — nazariy bo'lim (PDF asosida) ==================
// m3d: Sketchfab ochiq ta'lim modellari (AnatomyTOOL.org orqali:
//      Leiden University MC, University of Michigan BlueLink, Elon University)
const ATLAS = [
  {
    id: "a1",
    title: "Columna vertebralis",
    subtitle: "Umurtqa pog'onasi — umumiy ko'rinish",
    icon: "🦴",
    color: "#0d9488",
    lead: "Umurtqa pog'onasi (columna vertebralis) — tananing o'q skeleti bo'lib, 33–34 umurtqadan tashkil topadi: 7 bo'yin, 12 ko'krak, 5 bel, 5 dumg'aza (qo'shilib os sacrum hosil qiladi) va 3–5 dum umurtqasi. U orqa miyani himoya qiladi, tanani tik tutadi va harakatni ta'minlaydi.",
    sections: [
      {
        h: "Bo'limlari", tag: "PDF · 2-bet",
        terms: [
          ["Vertebrae cervicales (C1–C7)", "Bo'yin umurtqalari — 7 ta"],
          ["Vertebrae thoracicae (Th1–Th12)", "Ko'krak umurtqalari — 12 ta"],
          ["Vertebrae lumbales (L1–L5)", "Bel umurtqalari — 5 ta"],
          ["Os sacrum", "Dumg'aza suyagi — 5 ta qo'shilgan umurtqa"],
          ["Os coccygis", "Dum suyagi — 3–5 rudimentar umurtqa"]
        ]
      },
      {
        h: "Umurtqaning umumiy tuzilishi", tag: "PDF · 3–11-bet",
        img: "assets/img/vertebra_labeled.jpg",
        cap: "Umurtqa tanasi va yashil rangda — processus transversus",
        terms: [
          ["Corpus vertebrae", "Umurtqa tanasi — oldingi, yuk ko'taruvchi qism"],
          ["Arcus vertebrae", "Umurtqa ravog'i (pediculus + lamina)"],
          ["Foramen vertebrale", "Umurtqa teshigi — orqa miya joylashadi"],
          ["Foramen intervertebrale", "Umurtqalararo teshik — spinal nervlar chiqadi"],
          ["Processus spinosus", "Qirrali o'simta"],
          ["Processus transversus", "Ko'ndalang o'simta"],
          ["Processus articularis sup./inf.", "Yuqorigi/pastki bo'g'im o'simtalari"]
        ]
      }
    ],
    m3d: [
      { t: "Bel umurtqasi — aylantirib ko'ring", uid: "f151db6d5b374e6ab2fbdef4a56f8170", src: "Elon University" }
    ]
  },
  {
    id: "a2",
    title: "Vertebrae cervicales",
    subtitle: "Bo'yin umurtqalari · Atlas · Axis",
    icon: "🔵",
    color: "#0284c7",
    lead: "Bo'yin umurtqalari 7 ta. Tuzilishiga ko'ra tipik (C3–C7) va atipik (C1 atlas, C2 axis) turlarga bo'linadi. Asosiy farqlovchi belgi — processus transversus'dagi foramen transversarium, undan a. vertebralis o'tadi.",
    sections: [
      {
        h: "Tipik bo'yin umurtqasi", tag: "PDF · 12–18-bet",
        img: "assets/img/cervical_overview.jpg",
        cap: "Bo'yin umurtqalari: C1 (yashil), C2 (ko'k), C7 (sariq)",
        terms: [
          ["Foramen transversarium", "Ko'ndalang o'simta teshigi — a. vertebralis o'tadi"],
          ["Tuberculum anterius", "Oldingi do'mboqcha"],
          ["Tuberculum posterius", "Orqa do'mboqcha"],
          ["Processus spinosus bifidus", "Uchi ikkiga ayrilgan qirrali o'simta (C2–C6)"]
        ]
      },
      {
        h: "Atlas (C1) — birinchi bo'yin umurtqasi", tag: "PDF · 19–22-bet",
        img: "assets/img/atlas_labeled.jpg",
        cap: "Atlas: arcus anterior/posterior, massae laterales",
        terms: [
          ["Arcus anterior / posterior", "Oldingi / orqa ravoq"],
          ["Massae laterales", "Yon massalar"],
          ["Fovea dentis", "Tish chuqurchasi (dens axis bilan bo'g'im)"],
          ["Fovea articularis superior", "Bosh suyagi kondilusi bilan bo'g'im yuzasi"],
          ["Sulcus arteriae vertebralis", "Umurtqa arteriyasi egati"],
          ["— Atlasda YO'Q:", "corpus, processus spinosus, processus articularis"]
        ]
      },
      {
        h: "Axis (C2) — ikkinchi bo'yin umurtqasi", tag: "PDF · 23–27-bet",
        img: "assets/img/axis_labeled.jpg",
        cap: "Axis va uning densi",
        terms: [
          ["Dens axis", "Tish — atlas bilan aylanish o'qi"],
          ["Apex dentis", "Tish uchi"],
          ["Collum dentis", "Tish bo'yni"],
          ["Facies articularis anterior", "Fovea dentis bilan bo'g'im yuzasi"],
          ["Facies articularis posterior", "Lig. transversum atlantis bilan bo'g'im"]
        ]
      },
      {
        h: "C6 va C7 — klinik muhim belgilar", tag: "PDF · 28–29-bet",
        img: "assets/img/cervical_labeled.jpg",
        cap: "C6 — tuberculum caroticum, C7 — vertebra prominens",
        terms: [
          ["Tuberculum caroticum (C6)", "Uyqu do'mboqchasi — a. carotis communis'ni bosish nuqtasi (qon to'xtatish)"],
          ["Vertebra prominens (C7)", "Uzun proc. spinosus teridan bo'rtib turadi — umurtqalarni sanash orientiri"]
        ]
      }
    ],
    m3d: [
      { t: "Atlas va Axis birga (izohli)", uid: "101d81bcb3d549a99eee6ef922088b01", src: "Dr. P. Valchanov" },
      { t: "Atlas (C1) — yorliqlar bilan", uid: "5cdab117bb594b9cba827fccb7100195", src: "UMich BlueLink" },
      { t: "Axis (C2) — izohli model", uid: "34eda94dbc264baab7757eb34e1f9b04", src: "Elon University" },
      { t: "Tipik bo'yin umurtqasi (C3)", uid: "effd0c826e5e4f2f991bab9898fd6cb6", src: "UMich BlueLink" },
      { t: "C6 — yorliqlar bilan", uid: "d16456b21737469a985bc19f728cc794", src: "UMich BlueLink" }
    ]
  },
  {
    id: "a3",
    title: "Vertebrae thoracicae",
    subtitle: "Ko'krak umurtqalari",
    icon: "🟠",
    color: "#d97706",
    lead: "Ko'krak umurtqalari 12 ta. Asosiy belgisi — qovurg'alar bilan bo'g'im hosil qiluvchi chuqurchalar (foveae costales). Processus spinosus'lari uzun va pastga qiya (cherepitsasimon) yo'nalgan.",
    sections: [
      {
        h: "Farqlovchi tuzilmalar", tag: "PDF · 30–37-bet",
        img: "assets/img/thoracic_fovea.jpg",
        cap: "Qovurg'a chuqurchalari — fovea costalis superior va inferior",
        terms: [
          ["Fovea costalis superior", "Yuqorigi qovurg'a chuqurchasi (caput costae)"],
          ["Fovea costalis inferior", "Pastki qovurg'a chuqurchasi"],
          ["Fovea costalis transversalis", "Ko'ndalang o'simtadagi chuqurcha (tuberculum costae)"],
          ["Incisura vertebralis sup./inf.", "Yuqorigi/pastki umurtqa o'ymalari"]
        ]
      }
    ],
    m3d: [
      { t: "Ko'krak umurtqasi T4 — yorliqli", uid: "90c03fac7a6f463aab9cf57cf0b3c91e", src: "UMich BlueLink" },
      { t: "Ko'krak umurtqasi T7 — yorliqli", uid: "7613f3b326e544c6bf23bcbac5163f01", src: "UMich BlueLink" }
    ]
  },
  {
    id: "a4",
    title: "Vertebrae lumbales",
    subtitle: "Bel umurtqalari",
    icon: "🟡",
    color: "#ca8a04",
    lead: "Bel umurtqalari 5 ta — eng katta va massiv umurtqalar. Qovurg'a rudimenti processus costarius deb ataladi. Processus spinosus keng, yassi va gorizontal yo'nalgan.",
    sections: [
      {
        h: "O'simtalari", tag: "PDF · 38–44-bet",
        img: "assets/img/lumbar_labeled.jpg",
        cap: "Bel umurtqasining tuzilmalari",
        terms: [
          ["Processus costarius", "Qovurg'a o'simtasi (qovurg'a rudimenti)"],
          ["Processus accessorius", "Qo'shimcha o'simta"],
          ["Processus mamillaris", "So'rg'ichsimon o'simta"],
          ["Pediculus / Lamina arcus", "Ravoq oyoqchasi / plastinkasi"]
        ]
      }
    ],
    m3d: [
      { t: "Bel umurtqasi — 3D", uid: "f151db6d5b374e6ab2fbdef4a56f8170", src: "Elon University" }
    ]
  },
  {
    id: "a5",
    title: "Os sacrum · Os coccygis",
    subtitle: "Dumg'aza va dum suyagi",
    icon: "🟣",
    color: "#7c3aed",
    lead: "Os sacrum 5 ta dumg'aza umurtqasining qo'shilishidan hosil bo'lgan uchburchaksimon suyak. Yuqori keng qismi — basis, pastki tor uchi — apex. Os coccygis — 3–5 rudimentar umurtqadan iborat dum suyagi.",
    sections: [
      {
        h: "Os sacrum — asosiy qismlar", tag: "PDF · 45–48-bet",
        img: "assets/img/sacrum_labeled.jpg",
        cap: "Facies pelvina: basis, promontorium, foramina sacralia pelvina",
        terms: [
          ["Basis ossis sacri", "Asosi (yuqorida, L5 bilan birikadi)"],
          ["Apex ossis sacri", "Uchi (pastda, os coccygis bilan)"],
          ["Promontorium", "Oldinga bo'rtib chiqqan burtiq"],
          ["Ala ossis sacri", "Qanotlari"],
          ["Facies pelvina / dorsalis", "Chanoq / orqa yuzasi"],
          ["Lineae transversae", "Ko'ndalang chiziqlar (qo'shilish izlari)"],
          ["Foramina sacralia pelvina/dorsalia", "Oldingi/orqa dumg'aza teshiklari"]
        ]
      },
      {
        h: "Qirralar, kanal va bo'g'im yuzalari", tag: "PDF · 49–52-bet",
        img: "assets/img/sacrum_foramina.jpg",
        cap: "Facies dorsalis: qirralar va foramina sacralia dorsalia",
        terms: [
          ["Crista sacralis mediana", "O'rta qirra (proc. spinosus'lardan)"],
          ["Crista sacralis intermedia", "Oraliq qirra (proc. articularis'lardan)"],
          ["Crista sacralis lateralis", "Yon qirra (proc. transversus'lardan)"],
          ["Canalis sacralis", "Dumg'aza kanali"],
          ["Hiatus sacralis", "Kanalning pastki ochilishi (epidural anesteziya nuqtasi)"],
          ["Cornua sacralia", "Dumg'aza shoxchalari"],
          ["Facies auricularis", "Quloqsimon yuza — os ilium bilan bo'g'im"],
          ["Tuberositas sacralis", "Dumg'aza g'adir-budirligi"]
        ]
      },
      {
        h: "Os coccygis", tag: "PDF · 53–54-bet",
        img: "assets/img/coccyx_green.jpg",
        cap: "Dum suyagi va cornua coccygea",
        terms: [
          ["Corpus ossis coccygis", "Tanasi"],
          ["Cornua coccygea", "Shoxchalari (cornua sacralia bilan birikadi)"],
          ["Processus transversi", "Ko'ndalang o'simtalar rudimenti"]
        ]
      }
    ],
    m3d: [
      { t: "Sacrum — yorliqlar bilan", uid: "64b2bbe85aff4154847c5b6e27849911", src: "UMich BlueLink" },
      { t: "Sacrum va Coccyx birga", uid: "49aafdac520046ab97afc33a26d47d0c", src: "Elon University" }
    ]
  },
  {
    id: "a6",
    title: "Costae · Sternum",
    subtitle: "Qovurg'alar va to'sh suyagi",
    icon: "🩻",
    color: "#e11d48",
    lead: "Ko'krak qafasi (thorax) 12 juft qovurg'a, to'sh suyagi va 12 ta ko'krak umurtqasidan tashkil topadi. Qovurg'alar chin (I–VII), soxta (VIII–X) va erkin (XI–XII) guruhlarga bo'linadi.",
    sections: [
      {
        h: "Qovurg'a (Costa)", tag: "PDF · 46–48-bet",
        terms: [
          ["Caput costae", "Qovurg'a boshi — umurtqa tanasi bilan bo'g'im"],
          ["Collum costae", "Qovurg'a bo'yni"],
          ["Tuberculum costae", "Qovurg'a do'mbog'i — ko'ndalang o'simta bilan bo'g'im"],
          ["Corpus costae", "Qovurg'a tanasi"],
          ["Sulcus costae", "Tananing ichki yuzasidagi egat — tomir va nerv o'tadi"],
          ["Costae verae (I–VII)", "Chin qovurg'alar — to'sh suyagiga bevosita birikadi"],
          ["Costae spuriae (VIII–X)", "Soxta qovurg'alar — tog'aylari birlashib birikadi"],
          ["Costae fluctuantes (XI–XII)", "Erkin qovurg'alar — to'sh suyagiga birikmaydi"]
        ]
      },
      {
        h: "To'sh suyagi (Sternum)", tag: "PDF · 49–50-bet",
        terms: [
          ["Manubrium sterni", "Dasta — yuqori keng qismi"],
          ["Corpus sterni", "Tana — o'rta qismi"],
          ["Processus xiphoideus", "Xanjar o'simta — pastki uchi"],
          ["Incisura jugularis", "Bo'yinturuq o'ymasi — dasta tepasida"],
          ["Incisura clavicularis", "O'mrov o'ymasi — clavicula bilan bo'g'im"],
          ["Angulus sterni (Ludovici)", "Dasta-tana chegarasidagi burchak (II qovurg'a sathi)"],
          ["Apertura thoracis superior / inferior", "Ko'krak qafasining yuqori / pastki teshigi"]
        ]
      }
    ]
  },
  {
    id: "a7",
    title: "Membrum superius",
    subtitle: "Qo'l skeleti",
    icon: "💪",
    color: "#d97706",
    lead: "Qo'l skeleti yelka kamari (clavicula + scapula) va qo'lning erkin qismidan (humerus, radius, ulna, kaft suyaklari) tashkil topgan. Kaft ildizida 8, kaftda 5, barmoqlarda 14 ta suyak bor.",
    sections: [
      {
        h: "Yelka kamari", tag: "PDF · 51–55-bet",
        terms: [
          ["Clavicula", "O'mrov suyagi — S-shakldagi juft suyak"],
          ["Extremitas sternalis / acromialis", "Claviculaning to'sh / akromion uchlari"],
          ["Scapula", "Kurak suyagi — yassi uchburchak suyak"],
          ["Cavitas glenoidalis", "Yelka suyagi bilan bo'g'im chuqurchasi"],
          ["Spina scapulae", "Kurak suyagi orqa yuzasidagi qirra"],
          ["Acromion", "Spina uchidagi o'simta — o'mrov bilan bo'g'im"],
          ["Processus coracoideus", "Tumshuqsimon o'simta (oldinga yo'nalgan)"],
          ["Fossa subscapularis", "Kurak suyagining qovurg'alarga qaragan chuqurchasi"]
        ]
      },
      {
        h: "Yelka suyagi (Humerus)", tag: "PDF · 56–60-bet",
        terms: [
          ["Caput humeri", "Boshi — cavitas glenoidalis bilan bo'g'im"],
          ["Collum anatomicum / chirurgicum", "Anatomik / jarrohlik bo'yni (sinish ko'p)"],
          ["Tuberculum majus et minus", "Katta va kichik do'mboqchalar"],
          ["Sulcus intertubercularis", "Do'mboqchalararo egat"],
          ["Tuberositas deltoidea", "Delta mushak birikadigan g'adir-budirlik"],
          ["Sulcus nervi radialis", "Nervus radialis egati"],
          ["Trochlea humeri / Capitulum humeri", "Blok (ulna bilan) / boshcha (radius bilan)"],
          ["Fossa olecrani", "Olecranon kiradigan chuqurcha"]
        ]
      },
      {
        h: "Bilak va kaft", tag: "PDF · 61–71-bet",
        terms: [
          ["Radius", "Bilak suyagi — bosh barmoq tomonida"],
          ["Ulna", "Tirsak suyagi — jimjiloq tomonida"],
          ["Olecranon", "Tirsak suyanchig'i — ulnaning yuqori o'simtasi"],
          ["Processus styloideus", "Bigizsimon o'simta (radius va ulnada)"],
          ["Ossa carpi (8)", "Kaft ildizi suyaklari — ikki qatorda"],
          ["Ossa metacarpi (5)", "Kaft suyaklari"],
          ["Phalanges (14)", "Barmoq falangalari"],
          ["Pollex", "Bosh barmoq"]
        ]
      }
    ]
  },
  {
    id: "a8",
    title: "Membrum inferius",
    subtitle: "Oyoq skeleti",
    icon: "🦵",
    color: "#059669",
    lead: "Oyoq skeleti chanoq kamari (os coxae) va oyoqning erkin qismidan (femur, patella, tibia, fibula, panja suyaklari) tashkil topgan. Os coxae uch suyakdan — ilium, ischium, pubis — qo'shilib hosil bo'ladi.",
    sections: [
      {
        h: "Chanoq kamari (Os coxae)", tag: "PDF · 72–77-bet",
        terms: [
          ["Os ilium", "Yonbosh suyagi — yuqori keng qism"],
          ["Os ischii", "Quymich suyagi — orqa-pastki qism"],
          ["Os pubis", "Qov suyagi — oldingi qism"],
          ["Acetabulum", "Bo'g'im chuqurchasi — femur boshi kiradi"],
          ["Crista iliaca", "Yonbosh suyagining yuqori qirrasi"],
          ["Spina iliaca anterior superior", "Oldingi-ustki bo'rtiq (klinik orientir)"],
          ["Tuber ischiadicum", "Quymich do'mbog'i — o'tirish tayanchi"],
          ["Symphysis pubica", "Qov suyaklarining oldingi birikishi"],
          ["Foramen obturatum", "Qov va quymich orasidagi teshik"],
          ["Linea terminalis", "Chanoqni katta/kichik qismga bo'luvchi chiziq"]
        ]
      },
      {
        h: "Son, boldir va panja", tag: "PDF · 77–93-bet",
        terms: [
          ["Femur", "Son suyagi — tanadagi eng uzun suyak"],
          ["Caput femoris / Collum femoris", "Boshlari / bo'yni (sinish joyi)"],
          ["Trochanter major et minor", "Katta va kichik do'mboqlar"],
          ["Linea aspera", "Son suyagi orqa yuzasidagi qo'pol qirra"],
          ["Patella", "Tizza qopqog'i — sesamsimon suyak"],
          ["Tibia", "Katta boldir suyagi — ichki tomonda"],
          ["Fibula", "Kichik boldir suyagi — tashqi tomonda"],
          ["Malleolus medialis / lateralis", "Ichki / tashqi to'piq bo'rtig'i"],
          ["Ossa tarsi (7)", "Panja orqasi suyaklari"],
          ["Talus / Calcaneus", "Oshiq / tovon suyagi"],
          ["Ossa metatarsi (5) · Phalanges (14)", "Kaft suyaklari · falangalar"],
          ["Arcus pedis", "Oyoq gumbazi"]
        ]
      }
    ]
  },
  {
    id: "a9",
    title: "Neurocranium",
    subtitle: "Kalla skeleti — miya qismi",
    icon: "💀",
    color: "#475569",
    lead: "Kalla skeleti miya (neurocranium) va yuz (viscerocranium) qismlariga bo'linadi. Miya qismi 8 ta suyakdan iborat: 4 toq (frontale, occipitale, sphenoidale, ethmoidale) va 2 juft (parietale, temporale).",
    sections: [
      {
        h: "Ensa, tepa va peshona suyaklari", tag: "PDF · 96–106-bet",
        terms: [
          ["Os occipitale", "Ensa suyagi"],
          ["Foramen magnum", "Katta teshik — orqa miya o'tadi"],
          ["Condylus occipitalis", "Atlas bilan bo'g'im hosil qiluvchi do'mboqchalar"],
          ["Protuberantia occipitalis externa", "Tashqi ensa bo'rtig'i (inion)"],
          ["Os parietale", "Tepa suyagi — juft"],
          ["Os frontale", "Peshona suyagi"],
          ["Tuber frontale", "Peshona bo'rtiqlari"],
          ["Glabella", "Qoshlar orasidagi maydon"],
          ["Sinus frontalis", "Peshona suyagi ichidagi havo bo'shlig'i"]
        ]
      },
      {
        h: "G'alvirsimon, ponasimon va chakka", tag: "PDF · 105–117-bet",
        terms: [
          ["Os ethmoidale", "G'alvirsimon suyak"],
          ["Lamina cribrosa", "Teshikli plastinka — hid nervlari o'tadi"],
          ["Crista galli", "Xo'roz tojisimon o'simta"],
          ["Os sphenoidale", "Ponasimon suyak"],
          ["Sella turcica", "Turk egari — gipofiz joylashadi"],
          ["Fossa hypophysialis", "Gipofiz bezi chuqurchasi"],
          ["Os temporale", "Chakka suyagi"],
          ["Processus mastoideus", "So'rg'ichsimon o'simta"],
          ["Processus styloideus", "Bigizsimon o'simta"],
          ["Pars petrosa (pyramis)", "Toshsimon qism — ichki quloq"]
        ]
      }
    ]
  },
  {
    id: "a10",
    title: "Viscerocranium",
    subtitle: "Kalla skeleti — yuz qismi",
    icon: "🦷",
    color: "#9333ea",
    lead: "Kallaning yuz qismi 14 ta suyakdan iborat bo'lib, ular orasida eng yiriklari ustki jag' (maxilla) va pastki jag' (mandibula). Mandibula kallaning yagona harakatchan suyagidir.",
    sections: [
      {
        h: "Ustki jag' va tanglay", tag: "PDF · 118–125-bet",
        terms: [
          ["Maxilla", "Ustki jag' suyagi — juft"],
          ["Sinus maxillaris", "Yuqori jag' bo'shlig'i (Highmori bo'shlig'i)"],
          ["Processus alveolaris", "Tish o'simtasi"],
          ["Processus palatinus", "Qattiq tanglay old qismini hosil qiladi"],
          ["Foramen infraorbitale", "Ko'z osti teshigi"],
          ["Os palatinum", "Tanglay suyagi"],
          ["Lamina horizontalis", "Qattiq tanglayning orqa qismi"],
          ["Sutura palatina mediana", "Ikki jag' tanasi choki"]
        ]
      },
      {
        h: "Pastki jag', yonoq va butun kalla", tag: "PDF · 126–148-bet",
        terms: [
          ["Mandibula", "Pastki jag' suyagi — yagona harakatchan suyak"],
          ["Corpus mandibulae", "Pastki jag' tanasi"],
          ["Ramus mandibulae", "Pastki jag' shoxi"],
          ["Processus coronoideus", "Tojsimon o'simta"],
          ["Processus condylaris", "Bo'g'im o'simtasi — chakka suyagi bilan bo'g'im"],
          ["Articulatio temporomandibularis", "Chakka-pastki jag' bo'g'imi"],
          ["Os zygomaticum", "Yonoq suyagi"],
          ["Fonticulus", "Liqildoq — chaqaloq kallasidagi yumshoq soha"],
          ["Suturae cranii", "Kalla choklari — suyaklarni biriktiradi"]
        ]
      }
    ]
  }
];

// ================== IMTIHON REJIMI ==================
const EXAM = {
  title: "Yakuniy imtihon",
  desc: "Barcha mavzulardan 30 ta tasodifiy savol. Vaqt — 15 daqiqa. O'tish balli — 70%. Yuraklar ishlatilmaydi, lekin natija profilga yoziladi.",
  count: 30,
  minutes: 15,
  passPct: 70
};
