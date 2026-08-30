"use client";

/**
 * StreakCelebration — seriya bosqichiga (7/30/50/100) yetganda ko'rsatiladigan
 * yumshoq nishonlash banneri (confetti overload EMAS, bitta izchil aksent).
 */

import { Flame } from "lucide-react";
import { isStreakMilestone } from "@/utils/activity";
import { useStrings, fmt } from "@/i18n";

export function StreakCelebration({ streak }: { streak: number }) {
  const t = useStrings();
  if (!isStreakMilestone(streak) || streak < 1) return null;

  return (
    <div className="rx-pop-in mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
        <Flame className="text-accent" aria-hidden style={{ width: 18, height: 18 }} />
      </span>
      <p className="flex-1 text-sm font-semibold text-accent">
        {fmt(t.streakMilestone, { n: streak })}
      </p>
    </div>
  );
}
