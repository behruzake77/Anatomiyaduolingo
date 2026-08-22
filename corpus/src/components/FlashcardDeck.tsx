"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Check, Eye, ChevronRight, Crown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { colorForLegendN } from "@/data/colorDiagrams";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";

export interface Flashcard {
  n: string;
  name: string;
  img: string;
  def?: string;
}

/**
 * Flesh-karta to'plami — savoldan oldin o'rganish fazasi.
 * Oldi: strelkali rasm → aylantir → orqasi: raqam + nom.
 */
export function FlashcardDeck({ cards, onDone }: { cards: Flashcard[]; onDone: () => void }) {
  const t = useStrings();
  const isPremium = useAppStore((s) => s.isPremium);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [again, setAgain] = useState<number[]>([]);

  if (cards.length === 0) {
    onDone();
    return null;
  }

  const card = cards[idx];
  const isLast = idx + 1 >= cards.length;
  const color = colorForLegendN(card.n);

  const next = () => {
    setFlipped(false);
    setIdx((i) => Math.min(cards.length - 1, i + 1));
  };

  const markAgain = () => {
    setAgain((a) => (a.includes(idx) ? a : [...a, idx]));
    next();
  };

  // yakun — barcha kartalar ko'rildi
  if (idx >= cards.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full text-white shadow-pop",
            isPremium ? "bg-gradient-to-br from-[#F5C04E] to-[#E0A030]" : "bg-success",
          )}
        >
          {isPremium ? <Crown className="h-12 w-12" aria-hidden /> : <Check className="h-12 w-12" aria-hidden />}
        </motion.div>
        <h2 className="text-2xl font-bold">{t.flashDoneTitle}</h2>
        <p className="text-sm text-muted">
          {again.length > 0 ? fmt(t.flashAgain, { n: again.length }) : t.flashAllKnown}
        </p>
        <button
          onClick={onDone}
          className="mt-2 flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-soft active:scale-[.98]"
        >
          {t.flashStart} <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* header */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {isPremium ? "PREMIUM · " : ""}{t.flashTitle}
        </p>
        <span className="text-xs font-semibold text-muted">
          {fmt(t.flashProgress, { n: idx + 1, total: cards.length })}
        </span>
      </div>

      {/* progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <motion.div
          className={cn("h-full rounded-full", isPremium ? "bg-[#F5C04E]" : "bg-primary")}
          animate={{ width: `${((idx + 1) / cards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* karta (3D aylanish) */}
      <div className="mt-6 flex flex-1 items-center justify-center" style={{ perspective: 1200 }}>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="relative block h-80 w-full max-w-sm"
          aria-label={t.flashFlip}
        >
          <motion.div
            className="relative h-full w-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* OLD (rasm) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-white p-4 shadow-card"
              style={{ backfaceVisibility: "hidden", borderColor: color ?? "#6C5CE7" }}
            >
              <span
                className="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-sm font-bold text-white"
                style={{ background: color ?? "#6C5CE7" }}
              >
                {card.n}
              </span>
              <img src={card.img} alt="" className="max-h-52 w-auto max-w-full object-contain" />
              <p className="text-sm font-semibold text-muted">{t.flashWhat}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {t.flashFlip}
              </p>
            </div>

            {/* ORQA (nom) */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 p-4 text-center shadow-card",
                isPremium
                  ? "border-[#F5C04E] bg-gradient-to-br from-[#1a1230] via-[#2d1f4e] to-[#0e0b1a] text-white"
                  : "border-primary bg-primary text-white",
              )}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <span
                className="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-sm font-bold text-white"
                style={{ background: color ?? "#6C5CE7" }}
              >
                {card.n}
              </span>
              <p className="break-words text-xl font-bold leading-snug">{card.name}</p>
              {card.def && (
                <div className="max-h-32 overflow-y-auto px-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.flashDef}</p>
                  <p className="mt-0.5 break-words text-sm leading-relaxed opacity-95">{card.def}</p>
                </div>
              )}
              <p className="flex items-center gap-1.5 text-xs opacity-70">
                <Eye className="h-3.5 w-3.5" aria-hidden /> {t.flashFlip}
              </p>
            </div>
          </motion.div>
        </button>
      </div>

      {/* javob tugmalari */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 flex gap-3"
          >
            <button
              onClick={markAgain}
              className="flex flex-1 items-center justify-center rounded-2xl bg-danger/10 py-3.5 text-sm font-semibold text-danger active:scale-[.98]"
            >
              {t.flashAgainShort}
            </button>
            <button
              onClick={next}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-success py-3.5 text-sm font-semibold text-white shadow-soft active:scale-[.98]"
            >
              <Check className="h-4 w-4" aria-hidden /> {isLast ? t.flashFinish : t.flashKnow}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* o'tkazib yuborish */}
      {!flipped && (
        <button onClick={onDone} className="mt-4 self-center text-sm font-semibold text-muted underline-offset-4 hover:underline">
          {t.flashSkip}
        </button>
      )}
    </div>
  );
}
