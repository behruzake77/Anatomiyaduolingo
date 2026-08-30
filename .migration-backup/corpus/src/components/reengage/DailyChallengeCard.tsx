"use client";

/**
 * DailyChallengeCard — kunga qarab aniqlanadigan (date-seeded) kunlik sinov.
 * 5 toifa: miya · yurak · o'pka · skelet · DNK. Yagona izchil dizayn tili.
 */

import { Brain, Heart, Wind, Bone, Dna, ChevronRight } from "lucide-react";
import { AnatomyAnimation, type AnatomyKind } from "./AnatomyAnimation";
import { useStrings } from "@/i18n";

interface Category {
  kind: AnatomyKind;
  titleKey: string;
  color: string;
  icon: typeof Brain;
}

const CATEGORIES: Category[] = [
  { kind: "brain", titleKey: "challengeBrain", color: "#6C5CE7", icon: Brain },
  { kind: "heart", titleKey: "challengeHeart", color: "#EF4444", icon: Heart },
  { kind: "lungs", titleKey: "challengeLungs", color: "#0EA5E9", icon: Wind },
  { kind: "skeleton", titleKey: "challengeSkeleton", color: "#5A4BD1", icon: Bone },
  { kind: "dna", titleKey: "challengeDna", color: "#00B894", icon: Dna },
];

function daySeed(): number {
  const day = new Date().toISOString().slice(0, 10);
  let s = 0;
  for (let i = 0; i < day.length; i++) s += day.charCodeAt(i);
  return s % CATEGORIES.length;
}

export function DailyChallengeCard({ onStart }: { onStart: () => void }) {
  const t = useStrings();
  const cat = CATEGORIES[daySeed()];
  const Icon = cat.icon;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">{t.dailyChallenge}</h2>
      <button
        onClick={onStart}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left shadow-card transition-colors active:bg-surface2"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${cat.color}1a` }}>
          <AnatomyAnimation kind={cat.kind} size={48} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t[cat.titleKey]}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} aria-hidden />
            {t.challengeMeta}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-white"
          style={{ background: cat.color }}
        >
          {t.challengeStart} <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </button>
    </section>
  );
}
