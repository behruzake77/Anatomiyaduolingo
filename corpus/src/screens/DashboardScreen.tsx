"use client";

import { Flame, Zap, TrendingUp, Sun } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Donut } from "@/components/ui/Donut";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";
import { SYSTEMS } from "@/data/anatomy";
import { SKELETAL_LESSONS } from "@/data/osteology";
import { levelFromXp, levelTier } from "@/utils/levels";
import { useStrings, TIER_KEY, fmt } from "@/i18n";

const QUICK_TOPICS = [
  { id: "bones", labelKey: "bones" as const, icon: "bone", color: "#6C5CE7" },
  { id: "muscles", labelKey: "muscles" as const, icon: "activity", color: "#FD79A8" },
  { id: "organs", labelKey: "organs" as const, icon: "apple", color: "#00B894" },
  { id: "nerves", labelKey: "nerves" as const, icon: "brain", color: "#A29BFE" },
];

export function DashboardScreen() {
  const xp = useAppStore((s) => s.xp);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const streak = useAppStore((s) => s.streak);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const currentUser = useAppStore((s) => s.currentUser);
  const navigate = useAppStore((s) => s.navigate);
  const setTab = useAppStore((s) => s.setTab);
  const openLesson = useAppStore((s) => s.openLesson);
  const t = useStrings();

  const level = levelFromXp(xp);
  const tier = t[TIER_KEY[levelTier(level)]];
  const goalPct = Math.min(100, Math.round((dailyXp / dailyGoal) * 100));
  const firstSystem = SYSTEMS[0];
  const doneInFirst = SKELETAL_LESSONS.filter((l) => completedLessons.includes(l.id)).length;
  const nextLesson = SKELETAL_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? SKELETAL_LESSONS[0];
  const name = currentUser ?? t.name;

  return (
    <Screen className="pt-4">
      {/* brand header */}
      <header className="flex items-center gap-2">
        <Logo size={34} />
        <span className="text-lg font-bold tracking-tight">
          {t.brand}
        </span>
      </header>

      {/* greeting */}
      <header className="mt-4 flex items-center gap-3">
        <Avatar name={name} size={44} />
        <div className="flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Sun className="h-4 w-4 text-warning" aria-hidden /> {t.goodMorning}
          </p>
          <p className="text-base font-semibold leading-tight">{name}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {t.level} {level} · {tier}
        </span>
      </header>

      {/* Daily goal */}
      <Card className="mt-5 flex items-center gap-4 p-4">
        <Donut value={goalPct} size={92} stroke={11}>
          <div className="text-center">
            <p className="text-lg font-bold leading-none">{dailyXp}</p>
            <p className="text-[10px] text-muted">XP</p>
          </div>
        </Donut>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.todayGoal}</p>
          <p className="mt-1 text-xl font-bold">
            {dailyXp}
            <span className="text-sm font-medium text-muted"> / {dailyGoal} XP</span>
          </p>
          <ProgressBar value={goalPct} className="mt-2" />
          <p className="mt-1.5 text-xs text-muted">{fmt(t.goalPercent, { pct: goalPct })}</p>
        </div>
      </Card>

      {/* streak + level */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Flame className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">
              {streak} {t.days}
            </p>
            <p className="mt-1 text-xs text-muted">{t.streak}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{xp} XP</p>
            <p className="mt-1 text-xs text-muted">{t.totalEarned}</p>
          </div>
        </Card>
      </div>

      {/* Continue learning */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t.continueLearning}</h2>
        <Card className="mt-3 overflow-hidden">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={SYSTEMS[0].image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-white/80">{SYSTEMS[0].name}</p>
                <p className="text-base font-semibold text-white">{nextLesson.title}</p>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                +{nextLesson.xp} XP
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{fmt(t.lessonOf, { n: doneInFirst + 1, total: SKELETAL_LESSONS.length })}</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" aria-hidden /> ~{nextLesson.minutes} {t.min}
              </span>
            </div>
            <Button className="mt-3 w-full" onClick={() => openLesson(nextLesson.id)}>
              {t.continue}
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick topics */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.quickTopics}</h2>
          <button onClick={() => setTab("learn")} className="text-sm font-semibold text-primary">
            {t.seeAll}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {QUICK_TOPICS.map((q) => (
            <Card
              key={q.id}
              onClick={() => (q.id === "organs" ? navigate("study") : setTab("learn"))}
              className="flex items-center gap-3 p-4"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${q.color}1f`, color: q.color }}
              >
                <Icon name={q.icon} className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold">{t[q.labelKey]}</span>
            </Card>
          ))}
        </div>
      </section>
    </Screen>
  );
}
