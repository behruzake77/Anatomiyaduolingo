"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppStore } from "@/store/useAppStore";
import { QUIZ } from "@/data/anatomy";
import { cn } from "@/utils/cn";

export function LessonScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const haptic = useHaptics();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = QUIZ[index % QUIZ.length];
  const total = 10;
  const questionNo = index + 1;
  const isLast = questionNo >= total;
  const revealed = selected !== null;

  const pick = (i: number) => {
    if (revealed) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      haptic(12);
    } else {
      haptic([30, 40, 30]);
    }
  };

  const next = () => {
    if (isLast) {
      const accuracy = score / total;
      completeLesson("sk-4", "skeletal", score, total);
      navigate(accuracy >= 0.7 ? "result-correct" : "result-wrong");
    } else {
      setSelected(null);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
      {/* progress header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate("dashboard")}
          aria-label="Quit lesson"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(questionNo / total) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="text-sm font-semibold text-muted">
          {questionNo}/{total}
        </span>
      </header>

      {/* question */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Question {questionNo}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>

      {/* illustration with highlight */}
      {q.image && (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-line shadow-card">
          <img src={q.image} alt="Anatomy illustration" className="h-44 w-full object-cover" />
          {q.highlight && (
            <motion.span
              className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/60 blur-md"
              style={{ left: `${q.highlight.x}%`, top: `${q.highlight.y}%` }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
        </div>
      )}

      {/* options */}
      <div className="mt-5 flex flex-col gap-3">
        <AnimatePresence>
          {q.options.map((opt, i) => {
            const isCorrect = revealed && i === q.answer;
            const isWrong = revealed && i === selected && i !== q.answer;
            return (
              <motion.button
                key={`${q.id}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                onClick={() => pick(i)}
                disabled={revealed}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-medium transition-colors",
                  !revealed && "border-line active:border-primary",
                  isCorrect && "border-success bg-success/10",
                  isWrong && "border-danger bg-danger/10",
                  revealed && !isCorrect && !isWrong && "border-line opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold",
                    isCorrect
                      ? "border-success bg-success text-white"
                      : isWrong
                        ? "border-danger bg-danger text-white"
                        : "border-line text-muted",
                  )}
                >
                  {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* explanation + next */}
      <div className="mt-auto pt-5">
        {revealed && (
          <p className="mb-3 rounded-xl bg-surface2 p-3 text-sm text-muted">{q.explanation}</p>
        )}
        <Button className="w-full" size="lg" disabled={!revealed} onClick={next}>
          {isLast ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
