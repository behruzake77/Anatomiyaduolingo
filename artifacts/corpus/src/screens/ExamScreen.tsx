"use client";

/**
 * Imtihon rejimi — aralash (tasodifiy) savollar, vaqt o'lchovi va natija.
 * Faqat tanlovli savol turlari ishlatiladi (quiz/img/func/tf → 4 yoki 2 variant).
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Check, Timer, GraduationCap, ChevronRight, RotateCcw } from "lucide-react";
import { ReportFlagButton } from "@/components/ReportQuestion";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useHaptics } from "@/hooks/useHaptics";
import { type Question } from "@/data/content";
import { collectChoiceQuestions } from "@/utils/quizPool";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import { ReactionSticker } from "@/components/ReactionSticker";

interface ExamItem {
  q: Question;
  lessonTitle: string;
  lessonId: string;
}

const COUNT_OPTIONS = [10, 20, 30, 50];

function collectExamQuestions(): ExamItem[] {
  return collectChoiceQuestions().map(({ q, lessonTitle, lessonId }) => ({ q, lessonTitle, lessonId }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExamScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const haptic = useHaptics();
  const t = useStrings();

  const [phase, setPhase] = useState<"setup" | "run" | "result">("setup");
  const [count, setCount] = useState(20);
  const [items, setItems] = useState<ExamItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "run") {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [phase]);

  const start = (n: number) => {
    const pool = shuffle(collectExamQuestions());
    setItems(pool.slice(0, Math.min(n, pool.length)));
    setCount(n);
    setIdx(0);
    setScore(0);
    setSelected(null);
    setRevealed(false);
    setElapsed(0);
    setPhase("run");
  };

  const item = phase === "run" ? items[idx] : null;
  const isLast = idx + 1 >= items.length;

  const answer = (i: number) => {
    if (revealed || !item) return;
    setSelected(i);
    setRevealed(true);
    if (i === item.q.answer) {
      setScore((s) => s + 1);
      haptic(12);
    } else {
      haptic([30, 40, 30]);
    }
  };

  const next = () => {
    if (isLast) {
      setPhase("result");
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const accuracy = items.length ? Math.round((score / items.length) * 100) : 0;

  /* ---------- SETUP ---------- */
  if (phase === "setup") {
    return (
      <Screen className="pt-4">
        <header className="flex items-center gap-3">
          <button
            onClick={() => navigate("dashboard")}
            aria-label={t.backToTopics}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-xl font-semibold">{t.examTitle}</h1>
        </header>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-10 w-10 text-primary" aria-hidden />
          </div>
          <h2 className="text-2xl font-semibold">{t.examSubtitle}</h2>
          <p className="max-w-xs text-sm text-muted">{t.examDescription}</p>
        </div>

        <p className="mt-8 text-sm font-semibold">{t.examCount}</p>
        <div className="mt-2 grid grid-cols-4 gap-3">
          {COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={cn(
                "rounded-2xl border-2 py-4 text-lg font-bold transition-colors",
                count === n ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface text-ink",
              )}
            >
              {n}
            </button>
          ))}
        </div>

        <Button className="mt-8 w-full" size="lg" onClick={() => start(count)}>
          {t.examStart} <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </Screen>
    );
  }

  /* ---------- RESULT ---------- */
  if (phase === "result") {
    return (
      <Screen className="pt-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full",
              accuracy >= 70 ? "bg-success/15" : "bg-danger/15",
            )}
          >
            <span className={cn("text-4xl font-bold", accuracy >= 70 ? "text-success" : "text-danger")}>
              {accuracy}%
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{accuracy >= 70 ? t.examPassed : t.examFailed}</h1>
            <p className="mt-1 text-sm text-muted">
              {fmt(t.examResult, { correct: score, total: items.length })} · {t.examTime}: {fmtTime(elapsed)}
            </p>
          </div>

          <div className="mt-4 grid w-full grid-cols-3 gap-3">
            {[
              { v: `${score}/${items.length}`, l: t.correct },
              { v: fmtTime(elapsed), l: t.examTime },
              { v: `${accuracy}%`, l: t.accuracy },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-surface p-3">
                <p className="text-base font-bold leading-none">{s.v}</p>
                <p className="mt-1 text-xs text-muted">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex w-full gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setPhase("setup")}>
              <RotateCcw className="h-4 w-4" aria-hidden /> {t.retry}
            </Button>
            <Button className="flex-1" onClick={() => navigate("dashboard")}>
              {t.reviewBack}
            </Button>
          </div>
        </div>
      </Screen>
    );
  }

  /* ---------- RUN ---------- */
  if (!item) return null;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <button
          onClick={() => setPhase("setup")}
          aria-label={t.backToTopics}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">{t.examTitle}</p>
          <p className="text-xs text-muted">{item.lessonTitle}</p>
        </div>
        <ReportFlagButton
          q={item.q}
          ctx={{
            lessonId: item.lessonId,
            lessonTitle: item.lessonTitle,
            prompt: item.q.prompt,
            qType: item.q.type,
            source: "exam",
          }}
        />
        <span className="flex items-center gap-1 rounded-full bg-surface2 px-3 py-1 text-xs font-semibold text-muted">
          <Timer className="h-3.5 w-3.5" aria-hidden /> {fmtTime(elapsed)}
        </span>
      </header>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${((idx + (revealed ? 1 : 0)) / items.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-muted">
        {fmt(t.reviewOf, { n: idx + 1, total: items.length })} · {t.correct}: {score}
      </p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{item.q.prompt}</h1>
      </div>

      {item.q.image && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <img src={item.q.image} alt="Anatomiya rasmi" className="mx-auto max-h-52 object-contain" />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {item.q.options?.map((opt, i) => {
          const isCorrect = revealed && i === item.q.answer;
          const isWrong = revealed && selected === i && i !== item.q.answer;
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={revealed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-medium transition-colors",
                !revealed && "border-line active:border-primary",
                isCorrect && "border-success bg-success/10",
                isWrong && "border-danger bg-danger/10",
                revealed && !isCorrect && !isWrong && "border-line opacity-60",
              )}
            >
              <span className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold",
                isCorrect ? "border-success bg-success text-white" : isWrong ? "border-danger bg-danger text-white" : "border-line text-muted",
              )}>
                {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-5">
        {revealed && (
          <div className="mb-3 flex items-center gap-3">
            <ReactionSticker
              ok={selected === item.q.answer}
              seed={idx}
              size="sm"
              label={selected === item.q.answer ? t.correct : t.wrong}
            />
            <p className={cn("text-base font-bold", selected === item.q.answer ? "text-success" : "text-danger")}>
              {selected === item.q.answer ? t.correct : t.wrong}
            </p>
          </div>
        )}
        {revealed && (item.q.explanation ?? item.q.hint) && (
          <p className="mb-3 rounded-xl bg-surface2 p-3 text-sm text-muted">{item.q.explanation ?? item.q.hint}</p>
        )}
        <Button className="w-full" size="lg" disabled={!revealed} onClick={next}>
          {isLast ? t.finish : t.next}
        </Button>
      </div>
    </div>
  );
}
