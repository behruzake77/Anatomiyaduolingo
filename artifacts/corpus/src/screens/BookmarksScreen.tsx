"use client";

import { useMemo } from "react";
import { X, Bookmark, Trash2, ChevronRight, Volume2 } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { useAppStore } from "@/store/useAppStore";
import { useSpeech } from "@/hooks/useSpeech";
import { lessonById, sortByDifficulty } from "@/data/content";
import { parseKey } from "@/utils/srs";
import { useStrings, fmt } from "@/i18n";

interface Entry {
  key: string;
  prompt: string;
  lessonId: string;
  lessonTitle: string;
  answerText: string;
}

export function BookmarksScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const openLesson = useAppStore((s) => s.openLesson);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const speak = useSpeech();
  const t = useStrings();

  const entries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    for (const key of bookmarks) {
      const parsed = parseKey(key);
      if (!parsed) continue;
      const lesson = lessonById(parsed.lessonId);
      if (!lesson) continue;
      const q = sortByDifficulty(lesson.questions)[parsed.index];
      if (!q) continue;
      const answerText =
        q.options && q.answer != null
          ? q.options[q.answer]
          : q.statement != null
            ? q.statement
              ? "To'g'ri"
              : "Noto'g'ri"
            : q.answerText ?? (q.pairs ? q.pairs.map((p) => p[1]).join(", ") : "");
      out.push({
        key,
        prompt: q.prompt,
        lessonId: parsed.lessonId,
        lessonTitle: lesson.title,
        answerText,
      });
    }
    return out;
  }, [bookmarks]);

  return (
    <Screen className="pt-4">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate("profile")}
          aria-label={t.backToTopics}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold leading-tight">{t.bookmarks}</h1>
          <p className="text-xs text-muted">{fmt(t.bookmarkCount, { n: entries.length })}</p>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Bookmark className="h-10 w-10 text-line" aria-hidden />
          <p className="text-sm text-muted">{t.bookmarkEmpty}</p>
          <p className="max-w-xs text-xs text-muted">{t.bookmarkEmptyHint}</p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e.key} className="rounded-2xl border border-line bg-surface p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{e.lessonTitle}</p>
              <p className="mt-1 text-sm font-medium leading-snug">{e.prompt}</p>
              <p className="mt-1 text-xs text-muted">
                {t.correct}: <span className="font-semibold text-success">{e.answerText}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => speak(e.answerText, "uz")}
                  aria-label={t.speak}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
                >
                  <Volume2 className="h-4 w-4" aria-hidden />
                </button>
                <button
                  onClick={() => openLesson(e.lessonId)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-surface2 py-2 text-xs font-semibold text-primary"
                >
                  {t.bookmarkOpenLesson} <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  onClick={() => toggleBookmark(e.key)}
                  aria-label={t.bookmarkRemove}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10 text-danger"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="h-4" />
    </Screen>
  );
}
