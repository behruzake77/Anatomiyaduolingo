"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Lock, Play, Check, Bone, Box } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { OSTEOLOGY_UNITS, unitProgress, isLessonUnlocked } from "@/data/osteology";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Suyaklar tizimi — 9 bo'lim, 25 dars (kitob tartibida).
 * Darslar ketma-ket ochiladi (Duolingo uslubidagi yo'l).
 */
export function LessonsScreen() {
  const completedLessons = useAppStore((s) => s.completedLessons);
  const openLesson = useAppStore((s) => s.openLesson);
  const navigate = useAppStore((s) => s.navigate);
  const t = useStrings();

  const [open, setOpen] = useState<string | null>(OSTEOLOGY_UNITS[0].id);

  const totalDone = completedLessons.length;
  const totalAll = OSTEOLOGY_UNITS.reduce((s, u) => s + u.lessons.length, 0);

  return (
    <Screen padded={false}>
      <TopBar
        title="Suyaklar tizimi"
        right={
          <div className="flex items-center gap-2">
            <button
              aria-label={t.models3d}
              onClick={() => navigate("models3d")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft"
            >
              <Box className="h-4 w-4" aria-hidden />
            </button>
            <span className="text-sm font-semibold text-muted">
              {totalDone}/{totalAll} {t.lessons}
            </span>
          </div>
        }
      />

      <div className="px-5 pb-28">
        {/* umumiy progress */}
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold">Osteologiya</p>
            <p className="text-xs text-muted">{Math.round((totalDone / totalAll) * 100)}% {t.complete}</p>
          </div>
          <ProgressBar value={(totalDone / totalAll) * 100} className="mt-2" />
        </Card>

        {/* bo'limlar */}
        <div className="mt-4 flex flex-col gap-3">
          {OSTEOLOGY_UNITS.map((u, ui) => {
            const { done, total, pct } = unitProgress(u, completedLessons);
            const isOpen = open === u.id;
            return (
              <Card key={u.id} className="overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : u.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bone className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">
                      {ui + 1}. {u.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {fmt("{done}/{total} {lessons}", { done, total, lessons: t.lessons })}
                    </p>
                    <ProgressBar value={pct} className="mt-2" />
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 px-4 pb-4">
                        {u.lessons.map((l) => {
                          const done = completedLessons.includes(l.id);
                          const unlocked = isLessonUnlocked(l.id, completedLessons);
                          return (
                            <button
                              key={l.id}
                              onClick={() => unlocked && openLesson(l.id)}
                              disabled={!unlocked}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition",
                                unlocked ? "active:scale-[.99]" : "opacity-50",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                                  done
                                    ? "border-success bg-success/15 text-success"
                                    : unlocked
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-line text-muted",
                                )}
                              >
                                {done ? <Check className="h-4 w-4" aria-hidden /> : unlocked ? <Play className="h-4 w-4" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium leading-tight">{l.title}</p>
                                <p className="truncate text-xs text-muted">{l.description}</p>
                              </div>
                              <span className="shrink-0 text-xs font-bold text-primary">+{l.xp}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
