"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { ACHIEVEMENTS, COMING_SOON } from "@/data/achievements";

export function AchievementsScreen() {
  const unlocked = useAppStore((s) => s.achievements);

  return (
    <Screen padded={false}>
      <TopBar title="Achievements" />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">Unlock badges by learning every day and mastering anatomy.</p>

        <h2 className="mt-6 text-base font-semibold">Unlocked</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <Badge
              key={a.id}
              icon={a.icon}
              title={a.title}
              description={a.description}
              accent={a.accent}
              locked={!unlocked.includes(a.id)}
            />
          ))}
        </div>

        <h2 className="mt-8 text-base font-semibold">Coming Soon</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {COMING_SOON.map((a) => (
            <Badge
              key={a.id}
              icon={a.icon}
              title={a.title}
              description={a.description}
              accent={a.accent}
              locked
            />
          ))}
        </div>
      </div>
    </Screen>
  );
}
