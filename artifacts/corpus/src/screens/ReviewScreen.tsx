"use client";

/**
 * Takrorlash ekrani (Spaced Repetition) — muddati kelgan (due) xato savollarni
 * birma-bir qaytaradi. To'g'ri javob kartani bir quti yuqoriga ko'taradi,
 * xato javob kartani qayta "darhol takrorlash" rejimiga tushiradi.
 */

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppStore } from "@/store/useAppStore";
import { lessonById, sortByDifficulty, type Question } from "@/data/content";
import { parseKey, isDue } from "@/utils/srs";
import { useStrings, fmt } from "@/i18n";

interface ReviewItem {
  key: string;
  q: Question;
  lessonTitle: string;
}

function questionFor(lessonId: string, index: number): { q: Question; lessonTitle: string } | null {
  const lesson = lessonById(lessonId);
  if (!lesson) return null;
  const q = sortByDifficulty(lesson.questions)[index];
  if (!q) return null;
  return { q, lessonTitle: lesson.title };
}

export function ReviewScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const srs = useAppStore((s) => s.srs);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const haptic = useHaptics();
  const t = useStrings();

  const items = useMemo<ReviewItem[]>(() => {
    const now = Date.now();
    const out: ReviewItem[] = [];
    for (const key in srs) {
      if (!isDue(srs[key], now)) continue;
      const parsed = parseKey(key);
      if (!parsed) continue;
      const found = questionFor(parsed.lessonId, parsed.index);
      if (!found) continue;
      out.push({ key, q: found.q, lessonTitle: found.lessonTitle });
    }
    out.sort((a, b) => (srs[a.key].due - srs[b.key].due) || (srs[a.key].wrong - srs[b.key].wrong));
    return out;
  }, [srs]);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  const total = items.length;
  const done = idx >= total;
  const item = done ? null : items[idx];
  const isLast = idx + 1 >= total;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-4">
      {/* header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate("dashboard")}
          aria-label={t.backToTopics}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">{t.reviewTitle}</p>
          {!done && total > 0 && (
            <p className="text-xs text-muted">{fmt(t.reviewOf, { n: idx + 1, total })}</p>
          )}
        </div>
        {!done && total > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t.reviewBox}
          </span>
        )}
      </header>

      {/* progress */}
      {!done && total > 0 && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(idx / Math.max(1, total)) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

      {done ? (
        /* ----- yakun ----- */
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{t.reviewDone}</h1>
            <p className="mt-1 text-sm text-muted">
              {fmt(t.reviewResult, { correct, total })}
            </p>
          </div>
          <Button className="mt-2 w-full" size="lg" onClick={() => navigate("dashboard")}>
            {t.reviewBack}
          </Button>
        </div>
      ) : total === 0 ? (
        /* ----- bo'sh ----- */
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-10 w-10 text-primary" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{t.reviewEmpty}</h1>
            <p className="mt-1 text-sm text-muted">{t.reviewEmptyHint}</p>
          </div>
          <Button className="mt-2 w-full" size="lg" onClick={() => navigate("dashboard")}>
            {t.reviewBack}
          </Button>
        </div>
      ) : (
        /* ----- savol ----- */
        <div className="flex flex-1 flex-col">
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">
            {item!.lessonTitle}
          </p>
          <QuestionCard
            key={`${item!.key}-${idx}`}
            q={item!.q}
            qKey={item!.key}
            report={{ lessonTitle: item!.lessonTitle, source: "review", qKey: item!.key }}
            onCorrect={() => {
              setCorrect((c) => c + 1);
              recordAnswer(item!.key, true);
            }}
            onWrong={() => recordAnswer(item!.key, false)}
            onNext={() => setIdx((i) => i + 1)}
            isLast={isLast}
            haptic={haptic}
          />
        </div>
      )}
    </div>
  );
}
