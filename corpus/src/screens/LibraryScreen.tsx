"use client";

import { useState } from "react";
import { BookOpen, BookMarked, Download, ExternalLink, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { BOOKS, type Book } from "@/data/books";
import { useStrings } from "@/i18n";

/**
 * Kutubxona — Ahmedov darsligi va atlasni to'liq o'qish.
 * Kitob tanlanganda PDF to'liq ekranda ochiladi (brauzerning ichki PDF o'quvchisi).
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
      <div className="px-5 pb-28">
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

function SectionTitle({ label, className = "" }: { label: string; className?: string }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{label}</h2>;
}

function BookRow({ book, onOpen }: { book: Book; onOpen: () => void }) {
  const t = useStrings();
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
            {book.latin} · {book.pages}
          </p>
          {book.note && <p className="mt-0.5 text-[11px] italic text-muted">{book.note}</p>}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </div>
    </Card>
  );
}

/** Bitta kitobning to'liq ekranli PDF o'quvchisi. */
function BookReader({ book, onBack }: { book: Book; onBack: () => void }) {
  const t = useStrings();
  return (
    <Screen padded={false}>
      <TopBar
        title={book.title}
        right={
          <a
            href={book.file}
            target="_blank"
            rel="noreferrer"
            aria-label={t.downloadBook}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <div className="flex flex-col gap-3 px-5 pb-28">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="italic">{book.latin}</span>
          <span>{book.pages}</span>
        </div>

        {/* PDF ko'ruvchi */}
        <div className="overflow-hidden rounded-2xl border border-line bg-surface2">
          <iframe
            title={book.title}
            src={book.file}
            className="h-[calc(100dvh-160px)] w-full"
            style={{ border: 0 }}
          />
        </div>

        <a
          href={book.file}
          download
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft active:scale-[.99]"
        >
          <Download className="h-4 w-4" aria-hidden /> {t.downloadBook}
        </a>
        <p className="text-center text-[11px] text-muted">{t.readHint}</p>
      </div>
    </Screen>
  );
}
