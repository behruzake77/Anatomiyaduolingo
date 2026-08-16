"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Lock, Play, Check, Box } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useAppStore } from "@/store/useAppStore";
import { systemById, unitProgress, isLessonUnlocked } from "@/data/content";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Bitta tizimning bo'limlari va darslari (kitob tartibida, ketma-ket qulf).
 */
export function LessonsScreen() {
  const completedLessons = useAppStore((s) => s.completedLessons);
  const activeSystemId = useAppStore((s) => s.activeSystemId);
  const openLesson = useAppStore((s) => s.openLesson);
  const navigate = useAppStore((s) => s.navigate);
  const t = useStrings();

  const sys = systemById(activeSystemId ?? "skeletal");
  if (!sys) return null;

  const [open, setOpen] = useState<string | null>(sys.units[0]?.id ?? null);

  const totalLessons = sys.units.flatMap((u) => u.lessons).length;
  const totalDone = sys.units.flatMap((u) => u.lessons).filter((l) => completedLessons.includes(l.id)).length;

  return (
    <Screen padded={false}>
      <TopBar
        title={sys.name}
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
              {totalDone}/{totalLessons} {t.lessons}
            </span>
          </div>
        }
      />

      <div className="px-5 pb-28">
        {/* umumiy progress */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${sys.color}1f`, color: sys.color }}>
              <Icon name={sys.icon} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">{sys.latin}</p>
                <p className="text-xs text-muted">
                  {Math.round((totalDone / Math.max(1, totalLessons)) * 100)}% {t.complete}
                </p>
              </div>
              <ProgressBar value={(totalDone / Math.max(1, totalLessons)) * 100} color={sys.color} className="mt-2" />
            </div>
          </div>
        </Card>

        {/* bo'limlar */}
        <div className="mt-4 flex flex-col gap-3">
          {sys.units.map((u) => {
            const { done, total, pct } = unitProgress(u, completedLessons);
            const isOpen = open === u.id;
            return (
              <Card key={u.id} className="overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : u.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={u.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">{u.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {fmt("{done}/{total} {lessons}", { done, total, lessons: t.lessons })}
                    </p>
                    <ProgressBar value={pct} color={sys.color} className="mt-2" />
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
                          const isDone = completedLessons.includes(l.id);
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
                                  isDone
                                    ? "border-success bg-success/15 text-success"
                                    : unlocked
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-line text-muted",
                                )}
                              >
                                {isDone ? <Check className="h-4 w-4" aria-hidden /> : unlocked ? <Play className="h-4 w-4" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
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
