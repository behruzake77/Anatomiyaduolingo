"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Sparkline } from "@/components/ui/Sparkline";
import { Donut } from "@/components/ui/Donut";

type Range = "week" | "month" | "year";

const DATA: Record<Range, number[]> = {
  week: [10, 18, 6, 24, 16, 30, 16],
  month: [20, 30, 24, 46, 38, 55, 42, 60, 50, 70, 58, 40],
  year: [60, 80, 70, 120, 140, 110, 160, 190, 170, 210, 200, 120],
};

const CATEGORIES = [
  { label: "Completed", value: 15, color: "#6C5CE7" },
  { label: "In Progress", value: 6, color: "#F59E0B" },
  { label: "Not Started", value: 3, color: "#94A3B8" },
];

export function ProgressScreen() {
  const [range, setRange] = useState<Range>("week");

  return (
    <Screen padded={false}>
      <TopBar title="Progress Analytics" />
      <div className="px-5 pb-28">
        <div className="flex justify-center">
          <Segmented<Range>
            value={range}
            onChange={setRange}
            options={[
              { value: "week", label: "This Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ]}
          />
        </div>

        {/* XP chart */}
        <Card className="mt-5 p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">XP Earned</p>
              <p className="mt-1 text-2xl font-bold text-primary">+120 XP</p>
            </div>
            <span className="text-xs text-muted">vs. previous {range}</span>
          </div>
          <div className="mt-3">
            <Sparkline data={DATA[range]} color="#6C5CE7" />
          </div>
        </Card>

        {/* topics donut */}
        <Card className="mt-4 flex items-center gap-5 p-4">
          <Donut value={65} size={120} stroke={13}>
            <div className="text-center">
              <p className="text-2xl font-bold">65%</p>
              <p className="text-[10px] text-muted">Topics</p>
            </div>
          </Donut>
          <div className="flex-1 space-y-2">
            {CATEGORIES.map((c) => (
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
          {CATEGORIES.map((c) => (
            <Card key={c.label} className="flex flex-col items-center gap-1 p-4">
              <p className="text-xl font-bold" style={{ color: c.color }}>
                {c.value}
              </p>
              <p className="text-center text-xs text-muted">{c.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}
