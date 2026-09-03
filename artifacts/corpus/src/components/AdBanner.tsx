"use client";

/**
 * Reklama banneri — harakatli (auto-aylanuvchi) reklama o'rni.
 * Kelajakda haqiqiy reklama tarmog'i (mas. AdMob) shu slotga ulanadi.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, ChevronRight, Rocket, GraduationCap, Flame, type LucideIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { useStrings } from "@/i18n";

export function AdBanner() {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);

  const slides: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: Rocket, title: t.adTitle, text: t.adText },
    { icon: GraduationCap, title: t.adSlide2Title, text: t.adSlide2Text },
    { icon: Flame, title: t.adSlide3Title, text: t.adSlide3Text },
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[idx];
  const SlideIcon = slide.icon;

  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <span className="absolute right-2 top-1.5 z-10 rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
        {t.adLabel}
      </span>

      {/* rangli gradient fon */}
      <motion.div
        className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/15 via-accent/10 to-success/15"
        animate={{ x: ["0%", "100%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ width: "200%" }}
      />

      <div className="relative flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Megaphone className="h-5 w-5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="flex items-center gap-1.5 break-words text-sm font-semibold leading-tight">
                <SlideIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden /> {slide.title}
              </p>
              <p className="mt-0.5 break-words text-xs text-muted">{slide.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <Button size="sm" className="shrink-0 px-3 py-2 text-xs" onClick={() => navigate("premium")}>
          {t.adCta} <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>

      {/* nuqta indikatorlar */}
      <div className="absolute bottom-1.5 left-4 flex gap-1">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}
