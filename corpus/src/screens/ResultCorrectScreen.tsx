"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trophy, PartyPopper, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Donut } from "@/components/ui/Donut";
import { Confetti } from "@/components/ui/Confetti";
import { useAppStore } from "@/store/useAppStore";
import { levelFromXp, levelTier } from "@/utils/levels";
import { useStrings, TIER_KEY } from "@/i18n";

export function ResultCorrectScreen() {
  const resetTo = useAppStore((s) => s.resetTo);
  const lastResult = useAppStore((s) => s.lastResult);
  const xp = useAppStore((s) => s.xp);
  const isPremium = useAppStore((s) => s.isPremium);
  const t = useStrings();

  const score = lastResult?.score ?? 8;
  const total = lastResult?.total ?? 10;
  const earned = lastResult?.earned ?? 20;
  const accuracy = Math.round((score / total) * 100);

  // XP counter (Duolingo uslubida sanab chiqadi)
  const [shownXp, setShownXp] = useState(0);
  useEffect(() => {
    const target = earned;
    const step = Math.max(1, Math.round(target / 20));
    const id = setInterval(() => {
      setShownXp((v) => {
        const n = v + step;
        if (n >= target) {
          clearInterval(id);
          return target;
        }
        return n;
      });
    }, 40);
    return () => clearInterval(id);
  }, [earned]);

  const level = levelFromXp(xp);
  const tier = t[TIER_KEY[levelTier(level)]];

  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center ${isPremium ? "bg-gradient-to-b from-[#1a1230] via-[#2d1f4e] to-[#0e0b1a]" : ""}`}>
      <Confetti />

      {isPremium && (
        <>
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F5C04E]/25 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
          </div>
        </>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative flex items-center gap-2 ${isPremium ? "text-white" : ""}`}
      >
        {isPremium ? (
          <>
            <Crown className="h-8 w-8 text-[#F5C04E]" aria-hidden />
            <h1 className="text-3xl font-bold">{t.premiumLevelUp}</h1>
          </>
        ) : (
          <>
            <PartyPopper className="h-8 w-8 text-accent" aria-hidden />
            <h1 className="text-3xl font-bold">{t.greatJob}</h1>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Donut value={accuracy} size={140} stroke={12} color={isPremium ? "#F5C04E" : "#F59E0B"}>
          {isPremium ? (
            <Crown className="h-10 w-10 text-[#F5C04E]" aria-hidden />
          ) : (
            <Trophy className="h-10 w-10 text-warning" aria-hidden />
          )}
        </Donut>
      </motion.div>

      <p className={`text-lg font-bold ${isPremium ? "text-[#F5C04E]" : "text-primary"}`}>
        +{shownXp} {t.xpEarned}
      </p>

      {/* premium: daraja va seriya */}
      {isPremium && (
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
          <Crown className="h-4 w-4 text-[#F5C04E]" aria-hidden />
          {t.level} {level} · {tier}
        </div>
      )}

      {/* stats */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {[
          { label: t.answered, value: String(total) },
          { label: t.correct, value: String(score) },
          { label: t.accuracy, value: `${accuracy}%` },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-3 shadow-card ${isPremium ? "border-white/15 bg-white/5 text-white" : "border-line bg-surface"}`}
          >
            <p className="text-lg font-bold">{s.value}</p>
            <p className={`text-xs ${isPremium ? "text-white/70" : "text-muted"}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <Button
        className={`w-full max-w-xs ${isPremium ? "bg-[#F5C04E] text-[#1a1230] hover:bg-[#E0A030]" : ""}`}
        size="lg"
        onClick={() => resetTo("lessons", ["topics"])}
      >
        {t.continue}
      </Button>
    </div>
  );
}
