/**
 * Anatomiya tizimlari (metadata) + interaktiv atlas ob'yektlari.
 * Darslar va savollar `osteology.ts`da (suyaklar — to'liq), qolgan tizimlar
 * keyingi bosqichlarda to'ldiriladi.
 */

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
    image: "/img/atlas/yurak.jpg",
    description:
      "Qonni butun tana bo'ylab haydaydigan muskul a'zo — daqiqasiga o'rtacha 70–75 marta qisqaradi.",
    function: "Qon aylanishini ta'minlash",
  },
  {
    id: "brain",
    name: "Bosh miya",
    latin: "Encephalon",
    en: "Brain",
    image: "/img/atlas/miya.jpg",
    description:
      "Asab tizimining boshqaruv markazi — fikrlash, xotira va muvozanat uchun javobgar.",
    function: "Axborotni qayta ishlash",
  },
  {
    id: "lungs",
    name: "O'pka",
    latin: "Pulmo",
    en: "Lungs",
    image: "/img/atlas/respiratorium.jpg",
    description:
      "Kislorod qonga o'tib, karbonat angidrid chiqariladigan juft nafas a'zosi.",
    function: "Gaz almashinuvi",
  },
  {
    id: "stomach",
    name: "Oshqozon",
    latin: "Gaster",
    en: "Stomach",
    image: "/img/atlas/digestorium.jpg",
    description:
      "Ovqatni mexanik va kimyoviy qayta ishlaydigan hazm yo'lining kengaygan qismi.",
    function: "Ovqat hazm qilish",
  },
  {
    id: "kidney",
    name: "Buyrak",
    latin: "Ren",
    en: "Kidney",
    image: "/img/atlas/buyrak.jpg",
    description:
      "Qonni filtrlash orqali siydik hosil qiluvchi, suv-tuz muvozanatini saqlovchi loviyasimon a'zo.",
    function: "Filtrlash",
  },
  {
    id: "skeleton",
    name: "Skelet",
    latin: "Skeleton",
    en: "Skeleton",
    image: "/img/atlas/skelet.jpg",
    description:
      "Tananing 206 ta suyakdan iborat asosi — tayanch vazifasini bajaradi va a'zolarni himoya qiladi.",
    function: "Tayanch va himoya",
  },
];
