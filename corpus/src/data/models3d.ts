/**
 * Haqiqiy interaktiv 3D modellar — Sketchfab ochiq ta'lim manbalari.
 * Suyaklar: University of Michigan BlueLink, Elon University, Dr. P. Valchanov.
 * A'zolar: Z-Anatomy (ochiq manbali 3D atlas, CC BY-SA) + boshqa CC-BY modellar.
 * Model Sketchfab'da joylashgan; iframe orqali lazy yuklanadi (internet kerak).
 */

export type ModelCategory = "bones" | "organs";

export interface Model3D {
  id: string;
  title: string;
  latin: string;
  uid: string; // Sketchfab model UID
  source: string;
  unitId: string; // qaysi osteologiya bo'limiga tegishli (suyaklar uchun)
  category: ModelCategory;
  description: string;
}

export const MODELS_3D: Model3D[] = [
  // ==================== SUYAKLAR ====================
  {
    id: "m-lumbar",
    title: "Bel umurtqasi",
    latin: "Vertebra lumbalis",
    uid: "f151db6d5b374e6ab2fbdef4a56f8170",
    source: "Elon University",
    unitId: "u3",
    category: "bones",
    description: "Bel umurtqasining tuzilishini 360° aylantirib o'rganing.",
  },
  {
    id: "m-atlas-axis",
    title: "Atlas va Axis",
    latin: "Atlas (C1) · Axis (C2)",
    uid: "101d81bcb3d549a99eee6ef922088b01",
    source: "Dr. P. Valchanov",
    unitId: "u2",
    category: "bones",
    description: "Birinchi va ikkinchi bo'yin umurtqalari — birlikda.",
  },
  {
    id: "m-atlas",
    title: "Atlas (C1)",
    latin: "Atlas",
    uid: "5cdab117bb594b9cba827fccb7100195",
    source: "UMich BlueLink",
    unitId: "u2",
    category: "bones",
    description: "Birinchi bo'yin umurtqasi — yorliqlar bilan.",
  },
  {
    id: "m-axis",
    title: "Axis (C2)",
    latin: "Axis",
    uid: "34eda94dbc264baab7757eb34e1f9b04",
    source: "Elon University",
    unitId: "u2",
    category: "bones",
    description: "Ikkinchi bo'yin umurtqasi va uning tishi (dens).",
  },
  {
    id: "m-c3",
    title: "Tipik bo'yin umurtqasi (C3)",
    latin: "Vertebra cervicalis",
    uid: "effd0c826e5e4f2f991bab9898fd6cb6",
    source: "UMich BlueLink",
    unitId: "u2",
    category: "bones",
    description: "Foramen transversarium va bo'yin umurtqasi belgilari.",
  },
  {
    id: "m-c6",
    title: "C6 — uyqu do'mboqchasi",
    latin: "Vertebra cervicalis VI",
    uid: "d16456b21737469a985bc19f728cc794",
    source: "UMich BlueLink",
    unitId: "u2",
    category: "bones",
    description: "Tuberculum caroticum joylashgan umurtqa.",
  },
  {
    id: "m-t4",
    title: "Ko'krak umurtqasi T4",
    latin: "Vertebra thoracica IV",
    uid: "90c03fac7a6f463aab9cf57cf0b3c91e",
    source: "UMich BlueLink",
    unitId: "u3",
    category: "bones",
    description: "Qovurg'a chuqurchalari (fovea costales) bilan.",
  },
  {
    id: "m-t7",
    title: "Ko'krak umurtqasi T7",
    latin: "Vertebra thoracica VII",
    uid: "7613f3b326e544c6bf23bcbac5163f01",
    source: "UMich BlueLink",
    unitId: "u3",
    category: "bones",
    description: "Ko'krak umurtqasining to'liq tuzilishi.",
  },
  {
    id: "m-sacrum",
    title: "Dumg'aza suyagi",
    latin: "Os sacrum",
    uid: "64b2bbe85aff4154847c5b6e27849911",
    source: "UMich BlueLink",
    unitId: "u4",
    category: "bones",
    description: "Dumg'aza suyagi — yorliqlar bilan.",
  },
  {
    id: "m-sacrum-coccyx",
    title: "Dumg'aza va dum suyagi",
    latin: "Os sacrum · Os coccygis",
    uid: "49aafdac520046ab97afc33a26d47d0c",
    source: "Elon University",
    unitId: "u4",
    category: "bones",
    description: "Dumg'aza va dum suyagi birlikda.",
  },
  {
    id: "m-arthro",
    title: "Bo'g'imlar tizimi",
    latin: "Arthrologia",
    uid: "a890d801336047d683d56d8bc676e894",
    source: "Z-Anatomy (CC BY-SA)",
    unitId: "ar-1",
    category: "bones",
    description: "Tana bo'g'imlari — ochiq manbali 3D atlas.",
  },

  // ==================== A'ZOLAR ====================
  {
    id: "m-splanch",
    title: "Ichki a'zolar (to'liq)",
    latin: "Splanchnologia",
    uid: "5cfafb312f504815aa3fec55735607a6",
    source: "Z-Anatomy (CC BY-SA)",
    unitId: "u12",
    category: "organs",
    description: "Jigar, o'pka, oshqozon, buyrak, ichak, traxeya — barchasi bir modelda.",
  },
  {
    id: "m-organs-light",
    title: "Oshqozon · ichak · o'pka",
    latin: "Gaster · Intestinum · Pulmones",
    uid: "bced6b6ebded4845bcfb2496a6e6d35c",
    source: "Suyanto (CC BY)",
    unitId: "u12",
    category: "organs",
    description: "Yengil model — kuchsiz qurilmalar uchun.",
  },
  {
    id: "m-neuro",
    title: "Bosh miya va nervlar",
    latin: "Systema nervosum",
    uid: "3bfe9ac6efd84555a311f8ea50dd174d",
    source: "Z-Anatomy (CC BY-SA)",
    unitId: "ne-1",
    category: "organs",
    description: "Bosh miya va nerv tizimi — ochiq manbali atlas.",
  },
  {
    id: "m-angio",
    title: "Yurak va tomirlar",
    latin: "Systema cardiovasculare",
    uid: "0caae8f894cc40b69f3f78adf14b9665",
    source: "Z-Anatomy (CC BY-SA)",
    unitId: "u17",
    category: "organs",
    description: "Yurak va qon tomirlari tizimi.",
  },
  {
    id: "m-myology",
    title: "Mushaklar tizimi",
    latin: "Systema musculare",
    uid: "31b40fd809b14665b93773936d67c52c",
    source: "Z-Anatomy (CC BY-SA)",
    unitId: "u11",
    category: "organs",
    description: "Tana mushaklari — ochiq manbali 3D atlas.",
  },
];

export function modelsForUnit(unitId: string): Model3D[] {
  return MODELS_3D.filter((m) => m.unitId === unitId);
}

export function modelsByCategory(category: ModelCategory): Model3D[] {
  return MODELS_3D.filter((m) => m.category === category);
}
