"use client";

/**
 * StreakCelebration — seriya bosqichiga (7/30/50/100) yetganda ko'rsatiladigan
 * yumshoq nishonlash banneri (confetti overload EMAS, bitta izchil aksent).
 */

import { isStreakMilestone } from "@/utils/activity";
import { useStrings, fmt } from "@/i18n";
import { Sticker3D } from "@/components/ui/Sticker3D";

export function StreakCelebration({ streak }: { streak: number }) {
  const t = useStrings();
  if (!isStreakMilestone(streak) || streak < 1) return null;

  // Katta bosqichlar (30+) — kuchliroq nishonlash: trophy + gradient banner.
  const isMajor = streak >= 30;

  if (isMajor) {
    return (
      <div className="rx-pop-in mt-4 flex items-center gap-3 rounded-2xl border border-accent/40 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 px-4 py-3.5">
        <img
          src="/img/3d/achievement-trophy.png"
          alt=""
          className="rx-float h-12 w-12 shrink-0 object-contain drop-shadow-[0_6px_12px_rgba(108,92,231,0.4)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-primary">{fmt(t.streakMilestone, { n: streak })}</p>
          <p className="mt-0.5 text-xs text-muted">{t.streakMilestoneMajor ?? ""}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rx-pop-in mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
        <Sticker3D src="/img/3d/streak-flame.webp" size={24} />
      </span>
      <p className="flex-1 text-sm font-semibold text-accent">
        {fmt(t.streakMilestone, { n: streak })}
      </p>
    </div>
  );
}
