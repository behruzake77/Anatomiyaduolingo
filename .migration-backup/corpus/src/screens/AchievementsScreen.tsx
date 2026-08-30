"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useStrings } from "@/i18n";

export function AchievementsScreen() {
  const unlocked = useAppStore((s) => s.achievements);
  const t = useStrings();

  return (
    <Screen padded={false}>
      <TopBar title={t.achievements} />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">{t.achSubtitle}</p>

        <h2 className="mt-6 text-base font-semibold">{t.unlocked}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
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
      </div>
    </Screen>
  );
}
