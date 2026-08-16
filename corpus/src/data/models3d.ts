/**
 * Haqiqiy interaktiv 3D modellar — AnatomyTOOL / Sketchfab ochiq ta'lim manbalari
 * (University of Michigan BlueLink, Elon University, Dr. P. Valchanov).
 * Model Sketchfab'da joylashgan; iframe orqali lazy yuklanadi.
 */

export interface Model3D {
  id: string;
  title: string;
  latin: string;
  uid: string; // Sketchfab model UID
  source: string;
  unitId: string; // qaysi osteologiya bo'limiga tegishli
  description: string;
}

export const MODELS_3D: Model3D[] = [
  {
    id: "m-lumbar",
    title: "Bel umurtqasi",
    latin: "Vertebra lumbalis",
    uid: "f151db6d5b374e6ab2fbdef4a56f8170",
    source: "Elon University",
    unitId: "u3",
    description: "Bel umurtqasining tuzilishini 360° aylantirib o'rganing.",
  },
  {
    id: "m-atlas-axis",
    title: "Atlas va Axis",
    latin: "Atlas (C1) · Axis (C2)",
    uid: "101d81bcb3d549a99eee6ef922088b01",
    source: "Dr. P. Valchanov",
    unitId: "u2",
    description: "Birinchi va ikkinchi bo'yin umurtqalari — birlikda.",
  },
  {
    id: "m-atlas",
    title: "Atlas (C1)",
    latin: "Atlas",
    uid: "5cdab117bb594b9cba827fccb7100195",
    source: "UMich BlueLink",
    unitId: "u2",
    description: "Birinchi bo'yin umurtqasi — yorliqlar bilan.",
  },
  {
    id: "m-axis",
    title: "Axis (C2)",
    latin: "Axis",
    uid: "34eda94dbc264baab7757eb34e1f9b04",
    source: "Elon University",
    unitId: "u2",
    description: "Ikkinchi bo'yin umurtqasi va uning tishi (dens).",
  },
  {
    id: "m-c3",
    title: "Tipik bo'yin umurtqasi (C3)",
    latin: "Vertebra cervicalis",
    uid: "effd0c826e5e4f2f991bab9898fd6cb6",
    source: "UMich BlueLink",
    unitId: "u2",
    description: "Foramen transversarium va bo'yin umurtqasi belgilari.",
  },
  {
    id: "m-c6",
    title: "C6 — uyqu do'mboqchasi",
    latin: "Vertebra cervicalis VI",
    uid: "d16456b21737469a985bc19f728cc794",
    source: "UMich BlueLink",
    unitId: "u2",
    description: "Tuberculum caroticum joylashgan umurtqa.",
  },
  {
    id: "m-t4",
    title: "Ko'krak umurtqasi T4",
    latin: "Vertebra thoracica IV",
    uid: "90c03fac7a6f463aab9cf57cf0b3c91e",
    source: "UMich BlueLink",
    unitId: "u3",
    description: "Qovurg'a chuqurchalari (fovea costales) bilan.",
  },
  {
    id: "m-t7",
    title: "Ko'krak umurtqasi T7",
    latin: "Vertebra thoracica VII",
    uid: "7613f3b326e544c6bf23bcbac5163f01",
    source: "UMich BlueLink",
    unitId: "u3",
    description: "Ko'krak umurtqasining to'liq tuzilishi.",
  },
  {
    id: "m-sacrum",
    title: "Dumg'aza suyagi",
    latin: "Os sacrum",
    uid: "64b2bbe85aff4154847c5b6e27849911",
    source: "UMich BlueLink",
    unitId: "u4",
    description: "Dumg'aza suyagi — yorliqlar bilan.",
  },
  {
    id: "m-sacrum-coccyx",
    title: "Dumg'aza va dum suyagi",
    latin: "Os sacrum · Os coccygis",
    uid: "49aafdac520046ab97afc33a26d47d0c",
    source: "Elon University",
    unitId: "u4",
    description: "Dumg'aza va dum suyagi birlikda.",
  },
];

export function modelsForUnit(unitId: string): Model3D[] {
  return MODELS_3D.filter((m) => m.unitId === unitId);
}
