"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Sparkline } from "@/components/ui/Sparkline";
import { Donut } from "@/components/ui/Donut";
import { useAppStore } from "@/store/useAppStore";
import { CONTENT_SYSTEMS, systemProgress, unitStatus, totalStats } from "@/data/content";
import { useStrings, fmt } from "@/i18n";

type Range = "week" | "month" | "year";

export function ProgressScreen() {
  const [range, setRange] = useState<Range>("week");
  const t = useStrings();

  const completedLessons = useAppStore((s) => s.completedLessons);
  const correct = useAppStore((s) => s.correct);
  const total = useAppStore((s) => s.total);
  const xpHistory = useAppStore((s) => s.xpHistory);

  function series(count: number): number[] {
    const out: number[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(xpHistory[d.toISOString().slice(0, 10)] ?? 0);
    }
    return out;
  }
  const data = range === "week" ? series(7) : range === "month" ? series(30) : series(12);
  const earned = data.reduce((a, b) => a + b, 0);
  const rangeText = range === "week" ? t.rangeWeek : range === "month" ? t.rangeMonth : t.rangeYear;

  // real statuslar (tizimlar bo'yicha)
  const statusCount = { completed: 0, progress: 0, new: 0 };
  for (const sys of CONTENT_SYSTEMS) {
    const units = sys.units;
    const st = units.some((u) => unitStatus(u, completedLessons) === "progress")
      ? "progress"
      : units.every((u) => unitStatus(u, completedLessons) === "completed")
        ? "completed"
        : "new";
    statusCount[st]++;
  }
  const topicsPct = CONTENT_SYSTEMS.length
    ? Math.round((statusCount.completed / CONTENT_SYSTEMS.length) * 100)
    : 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const overall = totalStats(completedLessons);

  const categories = [
    { label: t.completed, value: statusCount.completed, color: "#6C5CE7" },
    { label: t.inProgress, value: statusCount.progress, color: "#F59E0B" },
    { label: t.notStarted, value: statusCount.new, color: "#94A3B8" },
  ];

  return (
    <Screen padded={false}>
      <TopBar title={t.progressTitle} />
      <div className="px-5 pb-28">
        <div className="flex justify-center">
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: "week", label: t.thisWeek },
              { value: "month", label: t.month },
              { value: "year", label: t.year },
            ]}
          />
        </div>

        {/* XP chart */}
        <Card className="mt-5 p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.xpEarnedChart}</p>
              <p className="mt-1 text-2xl font-bold text-primary">+{earned} XP</p>
            </div>
            <span className="text-xs text-muted">{fmt(t.vsPrev, { range: rangeText })}</span>
          </div>
          <div className="mt-3">
            <Sparkline data={data} color="#6C5CE7" />
          </div>
        </Card>

        {/* tizimlar donut */}
        <Card className="mt-4 flex items-center gap-5 p-4">
          <Donut value={topicsPct} size={120} stroke={13}>
            <div className="text-center">
              <p className="text-2xl font-bold">{topicsPct}%</p>
              <p className="text-[10px] text-muted">{t.topics}</p>
            </div>
          </Donut>
          <div className="flex-1 space-y-2">
            {categories.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 text-sm text-muted">{c.label}</span>
                <span className="text-sm font-semibold">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Card className="flex flex-col items-center gap-1 p-4">
            <p className="text-xl font-bold" style={{ color: "#6C5CE7" }}>
              {overall.done}/{overall.total}
            </p>
            <p className="text-center text-xs text-muted">{t.lessonsDone}</p>
          </Card>
          <Card className="flex flex-col items-center gap-1 p-4">
            <p className="text-xl font-bold" style={{ color: "#00B894" }}>
              {accuracy}%
            </p>
            <p className="text-center text-xs text-muted">{t.accuracy}</p>
          </Card>
          <Card className="flex flex-col items-center gap-1 p-4">
            <p className="text-xl font-bold" style={{ color: "#F59E0B" }}>
              {statusCount.completed}/{CONTENT_SYSTEMS.length}
            </p>
            <p className="text-center text-xs text-muted">{t.topics}</p>
          </Card>
        </div>

        {/* tizim bo'yicha progress */}
        <h2 className="mt-6 text-base font-semibold">{t.continueLearning}</h2>
        <div className="mt-3 flex flex-col gap-3">
          {CONTENT_SYSTEMS.map((sys) => {
            const { done, total: sysTotal, pct } = systemProgress(sys, completedLessons);
            return (
              <div key={sys.id}>
                <div className="flex justify-between text-xs font-medium text-muted">
                  <span>{sys.name}</span>
                  <span className="font-semibold text-ink">
                    {done}/{sysTotal}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: sys.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
