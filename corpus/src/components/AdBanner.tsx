"use client";

/**
 * Reklama banneri — bosh sahifadagi reklama o'rni.
 * Kelajakda haqiqiy reklama tarmog'i (mas. AdMob) shu komponentga ulanadi.
 */

import { Megaphone } from "lucide-react";
import { useStrings } from "@/i18n";

export function AdBanner() {
  const t = useStrings();
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-[#6C5CE7]/10 via-surface to-[#FD79A8]/10">
      <span className="absolute right-2 top-1.5 rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
        {t.adLabel}
      </span>
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Megaphone className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t.adTitle}</p>
          <p className="mt-0.5 text-xs text-muted">{t.adText}</p>
        </div>
      </div>
    </div>
  );
}
