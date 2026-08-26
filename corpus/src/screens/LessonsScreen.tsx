"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Play, Check, Box, Crown, ChevronDown, Star } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useAppStore } from "@/store/useAppStore";
import { systemById, unitProgress, isLessonUnlocked, type SystemUnit, type Lesson } from "@/data/content";
import { unitIconImage } from "@/data/unitIcons";
import { systemIconImage } from "@/data/systemIcons";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Bitta tizimning darslari — Duolingo-uslubidagi yo'l (path) ko'rinishida.
 * Tugunlar ilon izi bo'ylab joylashadi; Premium'da oltin yo'l.
 */

/**
 * Ilon izi uchun gorizontal siljishlar (px) — markaziy chiziq atrofida
 * o'ng-chap silliq tebranish (Duolingo yo'li). Musbat = o'ng, manfiy = chap.
 */
const ZIGZAG = [0, 52, 84, 52, 0, -52, -84, -52];

export function LessonsScreen() {
  const completedLessons = useAppStore((s) => s.completedLessons);
  const activeSystemId = useAppStore((s) => s.activeSystemId);
  const openLesson = useAppStore((s) => s.openLesson);
  const navigate = useAppStore((s) => s.navigate);
  const isPremium = useAppStore((s) => s.isPremium);
  const t = useStrings();

  const sys = systemById(activeSystemId ?? "skeletal");
  const [legacy, setLegacy] = useState(false);
  if (!sys) return null;

  const totalLessons = sys.units.flatMap((u) => u.lessons).length;
  const totalDone = sys.units.flatMap((u) => u.lessons).filter((l) => completedLessons.includes(l.id)).length;

  // Yo'l uchun yassilangan darslar + global indeks (bo'limlar chegarasida banner).
  const flat = useMemo(() => {
    let i = 0;
    const out: { kind: "lesson"; lesson: Lesson; unit: SystemUnit; gi: number }[] = [];
    for (const u of sys.units) {
      for (const l of u.lessons) {
        out.push({ kind: "lesson", lesson: l, unit: u, gi: i });
        i += 1;
      }
    }
    return out;
  }, [sys]);

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
            <button
              aria-label={t.seeAll}
              onClick={() => setLegacy((v) => !v)}
              className={cn(
                "flex h-9 items-center justify-center rounded-xl border border-line px-2 text-xs font-semibold",
                legacy ? "bg-primary text-white" : "bg-surface text-muted",
              )}
            >
              {t.seeAll}
            </button>
          </div>
        }
      />

      <div className="px-5 pb-28">
        {/* umumiy progress */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl" style={{ background: `${sys.color}1f`, color: sys.color }}>
              {systemIconImage(sys.id) ? (
                <img src={systemIconImage(sys.id)} alt="" className="h-full w-full object-cover" />
              ) : (
                <Icon name={sys.icon} className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">{sys.latin}</p>
                <p className="text-xs text-muted">
                  {Math.round((totalDone / Math.max(1, totalLessons)) * 100)}% {t.complete}
                </p>
              </div>
              <ProgressBar value={(totalDone / Math.max(1, totalLessons)) * 100} color={isPremium ? "#F5C04E" : sys.color} className="mt-2" />
            </div>
          </div>
        </Card>

        {legacy ? (
          <LegacyList sys={sys} completedLessons={completedLessons} openLesson={openLesson} />
        ) : (
          <PathView
            sys={sys}
            flat={flat}
            completedLessons={completedLessons}
            openLesson={openLesson}
            isPremium={isPremium}
          />
        )}
      </div>
    </Screen>
  );
}

/* ---------- Duolingo yo'li ---------- */
function PathView(props: {
  sys: ReturnType<typeof systemById>;
  flat: { kind: "lesson"; lesson: Lesson; unit: SystemUnit; gi: number }[];
  completedLessons: string[];
  openLesson: (id: string) => void;
  isPremium: boolean;
}) {
  const { sys, flat, completedLessons, openLesson, isPremium } = props;
  const t = useStrings();

  let unitSeen = "";

  return (
    <div className="relative mt-2">
      {/* Yo'l ramkasi — markaziy chiziq atrofida zaif nur */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 rounded-full",
          isPremium ? "bg-gradient-to-b from-[#F5C04E]/35 via-[#F5C04E]/15 to-transparent" : "bg-primary/10",
        )}
      />

      {flat.map((f) => {
        const { lesson, unit, gi } = f;
        const offset = ZIGZAG[gi % ZIGZAG.length];
        const isDone = completedLessons.includes(lesson.id);
        const unlocked = isLessonUnlocked(lesson.id, completedLessons);
        const isCurrent = unlocked && !isDone;

        // bo'lim boshida banner
        const newUnit = unit.id !== unitSeen;
        unitSeen = unit.id;

        return (
          <div key={lesson.id}>
            {newUnit && (
              <ChapterBanner unit={unit} completedLessons={completedLessons} isPremium={isPremium} />
            )}

            {/* lesson guruh — markazda, ilon izi bo'ylab siljigan */}
            <div
              className="relative flex items-center justify-center gap-4 py-3"
              style={{ transform: `translateX(${offset}px)` }}
            >
              {/* yorliq (nom) — chap tomonda */}
              <div
                className={cn(
                  "min-w-0 flex-1 text-right",
                  unlocked && isCurrent ? "opacity-100" : "opacity-70",
                )}
              >
                <p className={cn("text-[13px] font-semibold leading-tight", !unlocked && "text-muted")}>
                  {lesson.title}
                </p>
                <p className={cn("mt-0.5 text-[11px]", isCurrent ? "font-semibold text-primary" : "text-muted")}>
                  {isDone ? t.complete : t.lesson + " " + (gi + 1)}
                </p>
              </div>

              {/* tugun */}
              <button
                onClick={() => unlocked && openLesson(lesson.id)}
                disabled={!unlocked}
                aria-label={lesson.title}
                className="relative shrink-0"
              >
                {/* joriy dars — puls + START belgisi */}
                {isCurrent && (
                  <motion.span
                    className={cn(
                      "absolute -inset-3 rounded-full",
                      isPremium ? "bg-[#F5C04E]/30" : "bg-primary/20",
                    )}
                    animate={{ scale: [1, 1.22, 1], opacity: [0.75, 0.15, 0.75] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-4 shadow-card transition",
                    isCurrent ? "h-20 w-20" : "h-16 w-16",
                    isDone
                      ? isPremium
                        ? "border-[#F5C04E] bg-gradient-to-br from-[#F5C04E] to-[#E0A030] text-white"
                        : "border-success bg-success text-white"
                      : unlocked
                        ? isPremium
                          ? "border-[#F5C04E] bg-white text-[#E0A030]"
                          : "border-primary bg-white text-primary"
                        : "border-line bg-surface2 text-muted",
                  )}
                >
                  {isDone ? (
                    isPremium ? (
                      <Crown className="h-7 w-7" aria-hidden />
                    ) : (
                      <Check className="h-7 w-7" aria-hidden />
                    )
                  ) : unlocked ? (
                    <Play className="h-7 w-7 fill-current" aria-hidden />
                  ) : (
                    <Lock className="h-6 w-6" aria-hidden />
                  )}
                </div>

                {/* START banner — joriy dars ustida */}
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0, y: -6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-pop",
                      isPremium ? "bg-[#F5C04E] text-[#1a1230]" : "bg-primary text-white",
                    )}
                  >
                    {t.start}
                  </motion.span>
                )}
              </button>

              {/* XP belgisi — o'ng tomonda */}
              <div className="min-w-0 flex-1">
                <span className={cn("inline-flex items-center gap-0.5 text-xs font-extrabold", isPremium && isDone ? "text-[#E0A030]" : "text-primary")}>
                  <Star aria-hidden />
                  +{lesson.xp}
                </span>
                {isDone && (
                  <p className="mt-0.5 text-[11px] text-muted">{t.complete}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChapterBanner(props: { unit: SystemUnit; completedLessons: string[]; isPremium: boolean }) {
  const { unit, completedLessons, isPremium } = props;
  const t = useStrings();
  const { done, total } = unitProgress(unit, completedLessons);
  return (
    <div className="relative my-3 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
        {unitIconImage(unit.id) ? (
          <img src={unitIconImage(unit.id)} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name={unit.icon} className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold leading-tight">{unit.title}</p>
        <p className="text-xs text-muted">
          {fmt("{done}/{total} {lessons}", { done, total, lessons: t.lessons })}
        </p>
      </div>
      {isPremium && done === total && total > 0 && <Crown className="h-5 w-5 shrink-0 text-[#F5C04E]" aria-hidden />}
    </div>
  );
}

/* ---------- Eski (ro'yxat) ko'rinish ---------- */
function LegacyList(props: {
  sys: ReturnType<typeof systemById>;
  completedLessons: string[];
  openLesson: (id: string) => void;
}) {
  const { sys, completedLessons, openLesson } = props;
  const t = useStrings();
  const [open, setOpen] = useState<string | null>(sys?.units[0]?.id ?? null);

  if (!sys) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {sys.units.map((u) => {
        const { done, total, pct } = unitProgress(u, completedLessons);
        const isOpen = open === u.id;
        return (
          <Card key={u.id} className="overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : u.id)} className="flex w-full items-center gap-3 p-4 text-left">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                {unitIconImage(u.id) ? (
                  <img src={unitIconImage(u.id)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Icon name={u.icon} className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{u.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {fmt("{done}/{total} {lessons}", { done, total, lessons: t.lessons })}
                </p>
                <ProgressBar value={pct} color={sys.color} className="mt-2" />
              </div>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform", isOpen && "rotate-180")} aria-hidden />
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
                              isDone ? "border-success bg-success/15 text-success" : unlocked ? "border-primary bg-primary/10 text-primary" : "border-line text-muted",
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
  );
}
