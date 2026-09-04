"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ONBOARDING } from "@/data/onboarding";
import { Sticker3D } from "@/components/ui/Sticker3D";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const finishOnboarding = useAppStore((s) => s.finishOnboarding);
  const navigate = useAppStore((s) => s.navigate);
  const t = useStrings();

  const slide = ONBOARDING[index];
  const last = index === ONBOARDING.length - 1;

  const next = () => {
    if (last) {
      finishOnboarding();
      navigate("dashboard");
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      {/* top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">{t.brand}</span>
        <button
          onClick={() => {
            finishOnboarding();
            navigate("dashboard");
          }}
          className="text-sm font-semibold text-muted"
        >
          {t.skip}
        </button>
      </div>

      {/* slide */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-soft">
              <Sticker3D src={slide.sticker} size={96} className="rx-float" />
            </div>
            <div className="max-w-xs">
              <h2 className="text-2xl font-semibold">{slide.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{slide.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dots + CTA */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {ONBOARDING.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-primary" : "w-2 bg-line",
              )}
            />
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={next}>
          {last ? t.getStarted : t.next}
        </Button>
      </div>
    </div>
  );
}
