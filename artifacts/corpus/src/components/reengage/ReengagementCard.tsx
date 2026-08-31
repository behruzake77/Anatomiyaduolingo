"use client";

/**
 * ReengagementCard — dashboard'dagi asosiy "qayta jalb etish" kartasi.
 * Tutor holati + xabar + CTA (davom etish / tezkor sinov).
 */

import { ChevronRight, Zap } from "lucide-react";
import { Mascot3D } from "@/components/Mascot3D";
import type { ActivityState, TutorState } from "@/utils/activity";
import type { MascotClip } from "@/components/MascotR3F";
import { useStrings, fmt } from "@/i18n";

/** Tutor holati -> 3D animatsiya. */
function clipFor(state: TutorState): MascotClip {
  switch (state) {
    case "HAPPY":
    case "IDLE":
      return "Idle";
    case "CURIOUS":
      return "Sitting";
    case "THINKING":
      return "Sitting";
    case "CONCERNED":
      return "No";
    case "ENCOURAGING":
      return "Wave";
    case "CELEBRATING":
      return "Dance";
    case "WELCOME_BACK":
      return "Wave";
    default:
      return "Idle";
  }
}

export function ReengagementCard(props: {
  activity: ActivityState;
  streak: number;
  onContinue: () => void;
  onChallenge: () => void;
}) {
  const { activity, streak, onContinue, onChallenge } = props;
  const t = useStrings();
  const away = activity.daysAway > 0;

  return (
    <div className="rx-pop-in mt-4 rounded-2xl border border-line bg-surface p-3 shadow-card">
      <div className="flex items-center gap-3">
        <Mascot3D clip={clipFor(activity.state)} size={84} title={fmt(t[activity.messageKey], { n: streak })} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{fmt(t[activity.messageKey], { n: streak })}</p>
          <p className="mt-0.5 text-xs text-muted">
            {away
              ? `${t.rxDaysAway.replace("{n}", String(activity.daysAway))} · ${t.rxStreak}: ${streak}`
              : `${t.rxStreak}: ${streak} ${t.days}`}
          </p>
        </div>
      </div>

      {away && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onContinue}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
          >
            {t.continueLearning} <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            onClick={onChallenge}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            <Zap className="h-4 w-4" aria-hidden /> {t.quickChallenge}
          </button>
        </div>
      )}
    </div>
  );
}
