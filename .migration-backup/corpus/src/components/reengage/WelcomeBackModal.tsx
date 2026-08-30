"use client";

/**
 * WelcomeBackModal — uzoq kirmagan foydalanuvchi qaytib kelganda ko'rsatiladigan
 * qisqa, premium "comeback" ketma-ketligi. Dismissable (X / fon / ESC),
 * foydalanuvchini to'sib qo'ymaydi.
 * Kuniga bir marta (sessionStorage).
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, Zap } from "lucide-react";
import { AnatomyTutor } from "./AnatomyTutor";
import { AnatomyAnimation } from "./AnatomyAnimation";
import { useAppStore } from "@/store/useAppStore";
import { ALL_LESSONS, systemOfLesson } from "@/data/content";
import { useStrings } from "@/i18n";

export function WelcomeBackModal(props: {
  daysAway: number;
  onClose: () => void;
  onContinue: () => void;
  onChallenge: () => void;
}) {
  const { daysAway, onClose, onContinue, onChallenge } = props;
  const t = useStrings();
  const streak = useAppStore((s) => s.streak);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const [mounted, setMounted] = useState(false);

  const doneCount = completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length;
  const nextLesson = ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? ALL_LESSONS[0];
  const nextSystem = systemOfLesson(nextLesson.id);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted || typeof document === "undefined") return null;

  const step = (delay: string) => ({ animationDelay: delay });

  return createPortal(
    <div
      className="rx-overlay-in fixed inset-0 z-[95] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.welcomeBackTitle}
    >
      <div className="rx-pop-in w-full max-w-md rounded-3xl bg-surface p-5 pb-6 shadow-pop">
        {/* yopish */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            aria-label={t.zoomClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-muted transition-colors hover:bg-line"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* 1. tutor */}
        <div className="rx-pop-in flex justify-center" style={step("0ms")}>
          <AnatomyTutor state="WELCOME_BACK" size={92} />
        </div>

        {/* 2. anatomiya mikro-animatsiya */}
        <div className="rx-pop-in mt-3 flex justify-center" style={step("120ms")}>
          <AnatomyAnimation kind="brain" size={56} />
        </div>

        {/* 3. xabar */}
        <div className="rx-pop-in mt-4 text-center" style={step("240ms")}>
          <h2 className="text-2xl font-semibold">{t.welcomeBackTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.welcomeBackSub}</p>
        </div>

        {/* 4. streak / progress */}
        <div className="rx-pop-in mt-4 grid grid-cols-3 gap-3 text-center" style={step("340ms")}>
          <div className="rounded-2xl bg-surface2 p-2.5">
            <p className="text-base font-bold leading-none text-accent">{streak}</p>
            <p className="mt-1 text-[11px] text-muted">{t.streak}</p>
          </div>
          <div className="rounded-2xl bg-surface2 p-2.5">
            <p className="text-base font-bold leading-none text-primary">{doneCount}</p>
            <p className="mt-1 text-[11px] text-muted">{t.lessonsDone}</p>
          </div>
          <div className="rounded-2xl bg-surface2 p-2.5">
            <p className="text-base font-bold leading-none text-success">{daysAway}</p>
            <p className="mt-1 text-[11px] text-muted">{t.rxDays}</p>
          </div>
        </div>

        {/* 5. tavsiya etilgan dars */}
        <div className="rx-pop-in mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface2 p-3" style={step("440ms")}>
          <img src={nextSystem?.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t.recommended}</p>
            <p className="truncate text-sm font-semibold">{nextLesson.title}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">+{nextLesson.xp} XP</span>
        </div>

        {/* 6. harakatlar */}
        <div className="rx-pop-in mt-5 flex gap-2" style={step("540ms")}>
          <button
            onClick={onContinue}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
          >
            {t.continueLearning} <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            onClick={onChallenge}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary/10 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            <Zap className="h-4 w-4" aria-hidden /> {t.quickChallenge}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
