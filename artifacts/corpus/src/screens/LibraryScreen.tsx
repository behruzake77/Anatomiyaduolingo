"use client";

import { useEffect, useState } from "react";
import { BookOpen, BookMarked, Download, ChevronRight, ExternalLink, Loader2, FileText } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { BOOKS, bookUrl, isEmbeddedWebView, type Book } from "@/data/books";
import { useStrings } from "@/i18n";

/**
 * Kutubxona — Ahmedov darsligi va atlasni to'liq o'qish.
 * Kitob tanlanganda PDF to'liq ekranda ochiladi.
 *
 * Muhim: iOS Safari va ba'zi mobil WebView'lar iframe ichida PDF ko'rsatolmaydi
 * (bo'sh oyna ko'rinadi). Shuning uchun:
 *  - qo'llab-quvvatlanmaydigan brauzerlarda buning o'rniga "to'liq ekranda ochish" kartasi,
 *  - qo'llab-quvvatlanadiganlarda: yuklanish indikatori + sekin internet uchun maslahat,
 *  - har doim: "To'liq ekranda ochish" (brauzerning o'z PDF o'quvchisi) va "Yuklab olish".
 */
export function LibraryScreen() {
  const t = useStrings();
  const [open, setOpen] = useState<Book | null>(null);

  if (open) {
    return <BookReader book={open} onBack={() => setOpen(null)} />;
  }

  return (
    <Screen padded={false}>
      <TopBar title={t.library} />
      <div className="px-5 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <p className="text-sm text-muted">{t.librarySubtitle}</p>

        {/* Darslik */}
        <SectionTitle label={t.textbook} />
        <div className="mt-3 flex flex-col gap-3">
          {BOOKS.filter((b) => b.kind === "textbook").map((b) => (
            <BookRow key={b.id} book={b} onOpen={() => setOpen(b)} />
          ))}
        </div>

        {/* Atlas */}
        <SectionTitle label={t.atlas} className="mt-6" />
        <div className="mt-3 flex flex-col gap-3">
          {BOOKS.filter((b) => b.kind === "atlas").map((b) => (
            <BookRow key={b.id} book={b} onOpen={() => setOpen(b)} />
          ))}
        </div>
      </div>
    </Screen>
  );
}

/** iOS/iPadOS va Android WebView — iframe ichida PDF ko'rsatolmaydi. */
function isPdfIframeUnsupported(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPhone/iPod yoki iPadOS (Safari 13+ iPadOS'ta MacIntel ko'rsatadi, lekin touch bor)
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1);
  // Android WebView ("; wv)" — PWA/ichki brauzerlar)
  const isAndroidWebView = /Android/.test(ua) && /;\s*wv\)/.test(ua);
  return isIOS || isAndroidWebView;
}

function SectionTitle({ label, className = "" }: { label: string; className?: string }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{label}</h2>;
}

function BookRow({ book, onOpen }: { book: Book; onOpen: () => void }) {
  return (
    <Card onClick={onOpen} className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {book.kind === "textbook" ? (
            <BookMarked className="h-5 w-5" aria-hidden />
          ) : (
            <BookOpen className="h-5 w-5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{book.title}</p>
          <p className="mt-0.5 text-xs text-muted">
            {book.latin} · {book.pages} · ≈{book.sizeMB} MB
          </p>
          {book.note && <p className="mt-0.5 text-[11px] italic text-muted">{book.note}</p>}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </div>
    </Card>
  );
}

/** Bitta kitobning to'liq ekranli o'quvchisi — barcha brauzerlar uchun ishonchli. */
function BookReader({ book, onBack }: { book: Book; onBack: () => void }) {
  const t = useStrings();
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [unsupported] = useState(isPdfIframeUnsupported);

  // Katta fayl uchun: 12 soniyadan keyin maslahat ko'rsatish
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg">
      <TopBar title={book.title} onBack={onBack} />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-6">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="italic">{book.latin}</span>
          <span>
            {book.pages} · ≈{book.sizeMB} MB
          </span>
        </div>

        {/* Har doim mavjud amallar — brauzerning o'z PDF o'quvchisi ishlatiladi */}
        <div className="flex gap-3">
          <a
            href={bookUrl(book)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft active:scale-[.99]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden /> {t.openBook}
          </a>
          <a
            href={bookUrl(book)}
            download
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold active:scale-[.99]"
          >
            <Download className="h-4 w-4" aria-hidden /> {t.downloadBook}
          </a>
        </div>

        {isEmbeddedWebView() && (
          <p className="text-center text-[11px] leading-relaxed text-muted">{t.booksRemoteNote}</p>
        )}

        {/* O'quvchi maydoni */}
        {unsupported ? (
          // iOS / WebView — ichki iframe ishlamaydi: tushunarli tushuntirish
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface2 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" aria-hidden />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">{t.bookUnsupported}</p>
            <a
              href={bookUrl(book)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft active:scale-[.99]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden /> {t.openBook}
            </a>
          </div>
        ) : (
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface2">
            <iframe
              title={book.title}
              src={bookUrl(book)}
              className="h-full w-full"
              style={{ border: 0 }}
              onLoad={() => setLoaded(true)}
            />
            {/* Yuklanish indikatori — PDF to'liq yuklanmaguncha */}
            {!loaded && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
                <p className="text-sm font-medium">{t.bookLoading}</p>
                <p className="text-xs text-muted">≈{book.sizeMB} MB</p>
                {slow && (
                  <p className="max-w-xs px-6 text-center text-xs leading-relaxed text-muted">
                    {t.bookSlow}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sekin yuklanayotganda (hali tugallanmagan bo'lsa) maslahat */}
        {slow && !unsupported && !loaded && (
          <p className="text-center text-[11px] leading-relaxed text-muted">{t.bookSlow}</p>
        )}
      </div>
    </div>
  );
}
