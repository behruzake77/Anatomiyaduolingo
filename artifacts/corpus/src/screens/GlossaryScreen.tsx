"use client";

import { useMemo, useState } from "react";
import { Search, Volume2, ChevronRight, X, BookOpen } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import { useSpeech } from "@/hooks/useSpeech";
import { searchGlossary } from "@/data/glossary";
import { useStrings } from "@/i18n";

export function GlossaryScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const openLesson = useAppStore((s) => s.openLesson);
  const speak = useSpeech();
  const t = useStrings();

  const [query, setQuery] = useState("");
  const results = useMemo(() => searchGlossary(query), [query]);

  return (
    <Screen className="pt-4">
      {/* header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate("profile")}
          aria-label={t.backToTopics}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold leading-tight">{t.glossaryTitle}</h1>
          <p className="text-xs text-muted">{t.glossarySubtitle}</p>
        </div>
      </header>

      {/* qidiruv */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5">
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.glossarySearch}
          autoFocus
          className="w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label={t.zoomClose} className="text-muted">
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {/* natijalar */}
      <p className="mt-3 text-xs text-muted">{t.glossaryCount.replace("{n}", String(results.length))}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {results.map((e, i) => (
          <li
            key={`${e.term}-${i}`}
            className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-3"
          >
            <button
              onClick={() => speak(e.term, e.latin ? "la" : "uz")}
              aria-label={`${t.speak}: ${e.term}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <Volume2 className="h-5 w-5" aria-hidden />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{e.term}</p>
              <p className="flex items-center gap-1 truncate text-xs text-muted">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: e.systemColor }}
                />
                {e.systemName}
                {e.meaning ? ` · ${e.meaning}` : ""}
              </p>
            </div>
            {e.lessonId && (
              <button
                onClick={() => openLesson(e.lessonId)}
                aria-label={t.glossaryOpenLesson}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-surface2 px-2.5 py-1.5 text-xs font-semibold text-primary"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                {t.glossaryLesson}
              </button>
            )}
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <EmptyState
          illustration="/img/3d/empty-search.png"
          title={t.glossaryEmpty}
          className="mt-8"
        />
      )}

      <div className="h-4" />
    </Screen>
  );
}
