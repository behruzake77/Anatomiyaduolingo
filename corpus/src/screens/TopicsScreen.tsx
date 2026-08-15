"use client";

import { Search, Box } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useAppStore } from "@/store/useAppStore";
import { CONTENT_SYSTEMS, systemProgress } from "@/data/content";
import { useStrings, fmt } from "@/i18n";

export function TopicsScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const openSystem = useAppStore((s) => s.openSystem);
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
            aria-label={t.models3d}
            onClick={() => navigate("models3d")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-soft"
          >
            <Box className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* barcha tizimlar — real progress */}
      <div className="mt-5 flex flex-col gap-4">
        {CONTENT_SYSTEMS.map((sys) => {
          const { done, total, pct } = systemProgress(sys, completedLessons);
          return (
            <Card key={sys.id} onClick={() => openSystem(sys.id)}>
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
                  <p className="mt-1.5 text-xs font-semibold" style={{ color: sys.color }}>
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
