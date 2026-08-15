"use client";

import { motion } from "motion/react";
import { Trophy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Donut } from "@/components/ui/Donut";
import { Confetti } from "@/components/ui/Confetti";
import { useAppStore } from "@/store/useAppStore";

export function ResultCorrectScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const lastResult = useAppStore((s) => s.lastResult);

  const score = lastResult?.score ?? 8;
  const total = lastResult?.total ?? 10;
  const earned = lastResult?.earned ?? 20;
  const accuracy = Math.round((score / total) * 100);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2"
      >
        <PartyPopper className="h-8 w-8 text-accent" aria-hidden />
        <h1 className="text-3xl font-bold">Great Job!</h1>
      </motion.div>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Donut value={accuracy} size={140} stroke={12} color="#F59E0B">
          <Trophy className="h-10 w-10 text-warning" aria-hidden />
        </Donut>
      </motion.div>

      <p className="text-lg font-bold text-primary">+{earned} XP earned</p>

      {/* stats */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {[
          { label: "Answered", value: String(total) },
          { label: "Correct", value: String(score) },
          { label: "Accuracy", value: `${accuracy}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-3 shadow-card">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <Button className="w-full max-w-xs" size="lg" onClick={() => navigate("dashboard")}>
        Continue
      </Button>
    </div>
  );
}
