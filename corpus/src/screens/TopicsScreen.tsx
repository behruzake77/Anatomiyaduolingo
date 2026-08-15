"use client";

import { Search, Box, Lock } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useAppStore } from "@/store/useAppStore";
import { SYSTEMS } from "@/data/anatomy";
import { skeletalProgress } from "@/data/osteology";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";

export function TopicsScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const t = useStrings();

  return (
    <Screen className="pt-6">
      {/* header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t.topicsTitle}</h1>
          <p className="text-sm text-muted">{t.topicsSubtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            aria-label={t.search}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
          <button
            aria-label={t.study3d}
            onClick={() => navigate("study")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-soft"
          >
            <Box className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* tizimlar — suyaklar to'liq, qolganlari keyingi bosqich */}
      <div className="mt-5 flex flex-col gap-4">
        {SYSTEMS.map((sys) => {
          if (sys.soon) {
            return (
              <Card key={sys.id} className="opacity-60">
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: `${sys.color}1f`, color: sys.color }}
                  >
                    <Icon name={sys.icon} className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-base font-semibold">{sys.name}</p>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
                        <Lock className="h-3.5 w-3.5" aria-hidden /> {t.soonBadge}
                      </span>
                    </div>
                    <p className="text-xs italic text-muted">{sys.latin}</p>
                    <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-line">
                      <div className="h-full w-0 rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          }

          // Suyaklar — real progress
          const { done, total, pct } = skeletalProgress(completedLessons);
          return (
            <Card key={sys.id} onClick={() => navigate("lessons")}>
              <div className="flex items-center gap-4 p-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${sys.color}1f`, color: sys.color }}
                >
                  <Icon name={sys.icon} className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-base font-semibold">{sys.name}</p>
                    <span className="shrink-0 text-xs font-medium text-muted">
                      {fmt("{n}/{total} {lessons}", { n: done, total, lessons: t.lessons })}
                    </span>
                  </div>
                  <p className="text-xs italic text-muted">{sys.latin}</p>
                  <ProgressBar value={pct} color={sys.color} className="mt-2.5" />
                  <p className={cn("mt-1.5 text-xs font-semibold")} style={{ color: sys.color }}>
                    {pct}% {t.complete}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}
