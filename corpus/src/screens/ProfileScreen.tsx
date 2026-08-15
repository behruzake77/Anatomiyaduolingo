"use client";

import { Trophy, Bookmark, TrendingUp, Settings, Info, ChevronRight, Flame, Zap, Layers } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { levelFromXp, levelTier } from "@/utils/levels";

export function ProfileScreen() {
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const navigate = useAppStore((s) => s.navigate);

  const level = levelFromXp(xp);

  const menu = [
    { id: "achievements", label: "Achievements", icon: Trophy, screen: "achievements" as const },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark, screen: "topics" as const },
    { id: "progress", label: "Progress", icon: TrendingUp, screen: "progress" as const },
    { id: "study", label: "Study Mode", icon: Layers, screen: "study" as const },
    { id: "settings", label: "Settings", icon: Settings, screen: "settings" as const },
    { id: "about", label: "About CORPUS", icon: Info, screen: "settings" as const },
  ];

  return (
    <Screen className="pt-6">
      {/* identity */}
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar name="Anatomy Learner" size={88} />
        <div>
          <h1 className="text-2xl font-semibold">AnatomyLearner</h1>
          <p className="mt-0.5 text-sm text-muted">Level {level} • {levelTier(level)}</p>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Zap, value: `${xp} XP`, label: "Total XP" },
          { icon: Flame, value: `${streak} days`, label: "Day Streak" },
          { icon: Layers, value: "24", label: "Topics" },
        ].map((s) => (
          <Card key={s.label} className="flex flex-col items-center gap-1.5 p-4">
            <s.icon className="h-5 w-5 text-primary" aria-hidden />
            <p className="text-base font-bold leading-none">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* menu */}
      <Card className="mt-6 overflow-hidden">
        {menu.map((m, i) => (
          <button
            key={m.id}
            onClick={() => navigate(m.screen)}
            className={
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface2 " +
              (i > 0 ? "border-t border-line" : "")
            }
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <m.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1 text-base font-medium">{m.label}</span>
            <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
          </button>
        ))}
      </Card>
    </Screen>
  );
}
