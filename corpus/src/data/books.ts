/**
 * Kutubxona — darslik va atlas kitoblarini to'liq o'qish.
 * Fayllar: public/books/*.pdf (Ahmedov "Anatomiya I/II jild" + "Odam anatomiyasi Atlas").
 * Sahifa oralig'i fayl nomidan (kitobning o'zidagi sahifalar).
 */

export type BookKind = "textbook" | "atlas";

export interface Book {
  id: string;
  title: string;
  latin: string;
  pages: string; // kitob sahifalari oralig'i
  file: string; // /books/...pdf
  kind: BookKind;
  note?: string;
}

export const BOOKS: Book[] = [
  {
    id: "an-i-1",
    title: "Anatomiya I jild — qism 1",
    latin: "Ahmedov",
    pages: "1–72 sahifa",
    file: "/books/anatomiya-i-1.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-2",
    title: "Anatomiya I jild — qism 2",
    latin: "Ahmedov",
    pages: "73–144 sahifa",
    file: "/books/anatomiya-i-2.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-3",
    title: "Anatomiya I jild — qism 3",
    latin: "Ahmedov",
    pages: "145–216 sahifa",
    file: "/books/anatomiya-i-3.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-4",
    title: "Anatomiya I jild — qism 4",
    latin: "Ahmedov",
    pages: "217–288 sahifa",
    file: "/books/anatomiya-i-4.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-5",
    title: "Anatomiya I jild — qism 5",
    latin: "Ahmedov",
    pages: "289–360 sahifa",
    file: "/books/anatomiya-i-5.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-6a",
    title: "Anatomiya I jild — qism 6a",
    latin: "Ahmedov",
    pages: "361–397 sahifa",
    file: "/books/anatomiya-i-6a.pdf",
    kind: "textbook",
  },
  {
    id: "an-i-6b",
    title: "Anatomiya I jild — qism 6b",
    latin: "Ahmedov",
    pages: "398–434 sahifa",
    file: "/books/anatomiya-i-6b.pdf",
    kind: "textbook",
  },
  {
    id: "an-ii",
    title: "Anatomiya II jild",
    latin: "Ahmedov",
    pages: "to'liq kitob",
    file: "/books/anatomiya-ii.pdf",
    kind: "textbook",
  },
  {
    id: "at-1-1",
    title: "Odam anatomiyasi Atlas — I jild, qism 1",
    latin: "N.K. Ahmedov",
    pages: "1–88 sahifa",
    file: "/books/atlas-1-1.pdf",
    kind: "atlas",
  },
  {
    id: "at-1-2",
    title: "Odam anatomiyasi Atlas — I jild, qism 2",
    latin: "N.K. Ahmedov",
    pages: "89–176 sahifa",
    file: "/books/atlas-1-2.pdf",
    kind: "atlas",
  },
  {
    id: "at-1-3",
    title: "Odam anatomiyasi Atlas — I jild, qism 3",
    latin: "N.K. Ahmedov",
    pages: "177–265 sahifa",
    file: "/books/atlas-1-3.pdf",
    kind: "atlas",
  },
  {
    id: "at-2-1",
    title: "Odam anatomiyasi Atlas — II jild, qism 1",
    latin: "N.K. Ahmedov",
    pages: "1–85 sahifa",
    file: "/books/atlas-2-1.pdf",
    kind: "atlas",
  },
  {
    id: "at-2-2",
    title: "Odam anatomiyasi Atlas — II jild, qism 2",
    latin: "N.K. Ahmedov",
    pages: "86–170 sahifa",
    file: "/books/atlas-2-2.pdf",
    kind: "atlas",
  },
  {
    id: "at-2-3",
    title: "Odam anatomiyasi Atlas — II jild, qism 3",
    latin: "N.K. Ahmedov",
    pages: "171–257 sahifa",
    file: "/books/atlas-2-3.pdf",
    kind: "atlas",
  },
  {
    id: "columna",
    title: "Columna vertebralis",
    latin: "Umurtqa pog'onasi",
    pages: "maxsus nashr",
    file: "/books/columna-vertebralis.pdf",
    kind: "atlas",
    note: "Umurtqa pog'onasi bo'yicha qo'shimcha atlas.",
  },
];

export function booksByKind(kind: BookKind): Book[] {
  return BOOKS.filter((b) => b.kind === kind);
}
