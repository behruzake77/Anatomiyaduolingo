// AnatomiLingo — dars ma'lumotlari (Columna vertebralis PDF asosida)
// Mashq turlari:
//  quiz  — 4 variantli savol (img ixtiyoriy)
//  img   — rasm bo'yicha savol
//  match — juftlarni moslashtirish [lotin, o'zbek]
//  build — so'z bo'laklaridan atama yig'ish
//  tf    — to'g'ri / noto'g'ri

const COURSE = {
  title: "Columna vertebralis",
  subtitle: "Osteologiya · Dars 1",
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
    }
  ]
};
