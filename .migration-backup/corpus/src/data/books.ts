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
  sizeMB: number; // taxminiy fayl hajmi (yuklanish indikatori uchun)
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
    sizeMB: 20,
    kind: "textbook",
  },
  {
    id: "an-i-2",
    title: "Anatomiya I jild — qism 2",
    latin: "Ahmedov",
    pages: "73–144 sahifa",
    file: "/books/anatomiya-i-2.pdf",
    sizeMB: 20,
    kind: "textbook",
  },
  {
    id: "an-i-3",
    title: "Anatomiya I jild — qism 3",
    latin: "Ahmedov",
    pages: "145–216 sahifa",
    file: "/books/anatomiya-i-3.pdf",
    sizeMB: 20,
    kind: "textbook",
  },
  {
    id: "an-i-4",
    title: "Anatomiya I jild — qism 4",
    latin: "Ahmedov",
    pages: "217–288 sahifa",
    file: "/books/anatomiya-i-4.pdf",
    sizeMB: 20,
    kind: "textbook",
  },
  {
    id: "an-i-5",
    title: "Anatomiya I jild — qism 5",
    latin: "Ahmedov",
    pages: "289–360 sahifa",
    file: "/books/anatomiya-i-5.pdf",
    sizeMB: 21,
    kind: "textbook",
  },
  {
    id: "an-i-6a",
    title: "Anatomiya I jild — qism 6a",
    latin: "Ahmedov",
    pages: "361–397 sahifa",
    file: "/books/anatomiya-i-6a.pdf",
    sizeMB: 12,
    kind: "textbook",
  },
  {
    id: "an-i-6b",
    title: "Anatomiya I jild — qism 6b",
    latin: "Ahmedov",
    pages: "398–434 sahifa",
    file: "/books/anatomiya-i-6b.pdf",
    sizeMB: 26,
    kind: "textbook",
  },
  {
    id: "an-ii",
    title: "Anatomiya II jild",
    latin: "Ahmedov",
    pages: "to'liq kitob",
    file: "/books/anatomiya-ii.pdf",
    sizeMB: 13,
    kind: "textbook",
  },
  {
    id: "at-1-1",
    title: "Odam anatomiyasi Atlas — I jild, qism 1",
    latin: "N.K. Ahmedov",
    pages: "1–88 sahifa",
    file: "/books/atlas-1-1.pdf",
    sizeMB: 16,
    kind: "atlas",
  },
  {
    id: "at-1-2",
    title: "Odam anatomiyasi Atlas — I jild, qism 2",
    latin: "N.K. Ahmedov",
    pages: "89–176 sahifa",
    file: "/books/atlas-1-2.pdf",
    sizeMB: 15,
    kind: "atlas",
  },
  {
    id: "at-1-3",
    title: "Odam anatomiyasi Atlas — I jild, qism 3",
    latin: "N.K. Ahmedov",
    pages: "177–265 sahifa",
    file: "/books/atlas-1-3.pdf",
    sizeMB: 16,
    kind: "atlas",
  },
  {
    id: "at-2-1",
    title: "Odam anatomiyasi Atlas — II jild, qism 1",
    latin: "N.K. Ahmedov",
    pages: "1–85 sahifa",
    file: "/books/atlas-2-1.pdf",
    sizeMB: 17,
    kind: "atlas",
  },
  {
    id: "at-2-2",
    title: "Odam anatomiyasi Atlas — II jild, qism 2",
    latin: "N.K. Ahmedov",
    pages: "86–170 sahifa",
    file: "/books/atlas-2-2.pdf",
    sizeMB: 15,
    kind: "atlas",
  },
  {
    id: "at-2-3",
    title: "Odam anatomiyasi Atlas — II jild, qism 3",
    latin: "N.K. Ahmedov",
    pages: "171–257 sahifa",
    file: "/books/atlas-2-3.pdf",
    sizeMB: 16,
    kind: "atlas",
  },
  {
    id: "columna",
    title: "Columna vertebralis",
    latin: "Umurtqa pog'onasi",
    pages: "maxsus nashr",
    file: "/books/columna-vertebralis.pdf",
    sizeMB: 5,
    kind: "atlas",
    note: "Umurtqa pog'onasi bo'yicha qo'shimcha atlas.",
  },
];

export function booksByKind(kind: BookKind): Book[] {
  return BOOKS.filter((b) => b.kind === kind);
}

/**
 * Android APK (WebView) ichida PDF kitoblar APK ga kirmaydi (hajmi 246 MB) —
 * ular ochiq GitHub repodan oqib olinadi. Oddiy brauzerlarda esa saytning
 * o'zidan (/books/...) beriladi.
 */
export const REMOTE_BOOKS_BASE =
  "https://raw.githubusercontent.com/behruzake77/Anatomiyaduolingo/main/corpus/public";

/** Ilova Android WebView (APK / Telegram ichki brauzeri) ichida yurganmi? */
export function isEmbeddedWebView(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (/;\s*wv\)/.test(navigator.userAgent) || /CorpusAndroid/.test(navigator.userAgent))
  );
}

/** Kitob faylining to'liq URL i (muhitga qarab: mahalliy yoki GitHub). */
export function bookUrl(b: Book): string {
  return isEmbeddedWebView() ? REMOTE_BOOKS_BASE + b.file : b.file;
}
