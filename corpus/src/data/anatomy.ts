/**
 * Anatomiya tizimlari (metadata) + interaktiv atlas ob'yektlari.
 * Darslar va savollar `osteology.ts`da (suyaklar — to'liq), qolgan tizimlar
 * keyingi bosqichlarda to'ldiriladi.
 */

export interface BodySystem {
  id: string;
  name: string;
  latin: string;
  en: string;
  icon: string; // lucide icon name
  color: string;
  image: string;
  /** Kontent hali to'ldirilmagan tizimlar */
  soon?: boolean;
}

export const SYSTEMS: BodySystem[] = [
  {
    id: "skeletal",
    name: "Suyaklar tizimi",
    latin: "Systema skeletale",
    en: "Skeletal System",
    icon: "bone",
    color: "#6C5CE7",
    image: "/img/skeleton.jpg",
  },
  {
    id: "muscular",
    name: "Mushaklar tizimi",
    latin: "Systema musculare",
    en: "Muscular System",
    icon: "activity",
    color: "#FD79A8",
    image: "/img/muscles.jpg",
    soon: true,
  },
  {
    id: "digestive",
    name: "Hazm tizimi",
    latin: "Systema digestorium",
    en: "Digestive System",
    icon: "apple",
    color: "#F59E0B",
    image: "/img/stomach.jpg",
    soon: true,
  },
  {
    id: "respiratory",
    name: "Nafas tizimi",
    latin: "Systema respiratorium",
    en: "Respiratory System",
    icon: "wind",
    color: "#00B894",
    image: "/img/lungs.jpg",
    soon: true,
  },
  {
    id: "nervous",
    name: "Asab tizimi",
    latin: "Systema nervosum",
    en: "Nervous System",
    icon: "brain",
    color: "#A29BFE",
    image: "/img/brain.jpg",
    soon: true,
  },
  {
    id: "circulatory",
    name: "Qon aylanish tizimi",
    latin: "Systema circulatorium",
    en: "Circulatory System",
    icon: "heart",
    color: "#EF4444",
    image: "/img/heart.jpg",
    soon: true,
  },
];

export interface AtlasObject {
  id: string;
  name: string;
  latin: string;
  en: string;
  image: string;
  description: string;
  function: string;
}

export const ATLAS_OBJECTS: AtlasObject[] = [
  {
    id: "heart",
    name: "Yurak",
    latin: "Cor",
    en: "Heart",
    image: "/img/heart.jpg",
    description:
      "Qonni butun tana bo'ylab haydaydigan muskul a'zo — daqiqasiga o'rtacha 70–75 marta qisqaradi.",
    function: "Qon aylanishini ta'minlash",
  },
  {
    id: "brain",
    name: "Bosh miya",
    latin: "Encephalon",
    en: "Brain",
    image: "/img/brain.jpg",
    description:
      "Asab tizimining boshqaruv markazi — fikrlash, xotira va muvozanat uchun javobgar.",
    function: "Axborotni qayta ishlash",
  },
  {
    id: "lungs",
    name: "O'pka",
    latin: "Pulmo",
    en: "Lungs",
    image: "/img/lungs.jpg",
    description:
      "Kislorod qonga o'tib, karbonat angidrid chiqariladigan juft nafas a'zosi.",
    function: "Gaz almashinuvi",
  },
  {
    id: "stomach",
    name: "Oshqozon",
    latin: "Gaster",
    en: "Stomach",
    image: "/img/stomach.jpg",
    description:
      "Ovqatni mexanik va kimyoviy qayta ishlaydigan hazm yo'lining kengaygan qismi.",
    function: "Ovqat hazm qilish",
  },
  {
    id: "kidney",
    name: "Buyrak",
    latin: "Ren",
    en: "Kidney",
    image: "/img/kidney.svg",
    description:
      "Qonni filtrlash orqali siydik hosil qiluvchi, suv-tuz muvozanatini saqlovchi loviyasimon a'zo.",
    function: "Filtrlash",
  },
  {
    id: "skeleton",
    name: "Skelet",
    latin: "Skeleton",
    en: "Skeleton",
    image: "/img/skeleton.jpg",
    description:
      "Tananing 206 ta suyakdan iborat asosi — tayanch vazifasini bajaradi va a'zolarni himoya qiladi.",
    function: "Tayanch va himoya",
  },
];
