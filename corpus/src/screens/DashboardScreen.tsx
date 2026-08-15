"use client";

import { Flame, Zap, TrendingUp, Sun } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Donut } from "@/components/ui/Donut";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAppStore } from "@/store/useAppStore";
import { SYSTEMS } from "@/data/anatomy";
import { levelFromXp, levelTier } from "@/utils/levels";

const QUICK_TOPICS = [
  { id: "bones", label: "Bones", icon: "bone", color: "#6C5CE7" },
  { id: "muscles", label: "Muscles", icon: "activity", color: "#FD79A8" },
  { id: "organs", label: "Organs", icon: "apple", color: "#00B894" },
  { id: "nerves", label: "Nerves", icon: "brain", color: "#A29BFE" },
];

export function DashboardScreen() {
  const xp = useAppStore((s) => s.xp);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const streak = useAppStore((s) => s.streak);
  const navigate = useAppStore((s) => s.navigate);
  const setTab = useAppStore((s) => s.setTab);

  const level = levelFromXp(xp);
  const goalPct = Math.min(100, Math.round((dailyXp / dailyGoal) * 100));
  const nextLesson = SYSTEMS[0].lessons[3];

  return (
    <Screen className="pt-6">
      {/* greeting */}
      <header className="flex items-center gap-3">
        <Avatar name="Anatomy Learner" size={44} />
        <div className="flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Sun className="h-4 w-4 text-warning" aria-hidden /> Good morning
          </p>
          <p className="text-base font-semibold leading-tight">Anatomy Learner</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          Level {level} · {levelTier(level)}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Today&apos;s goal</p>
          <p className="mt-1 text-xl font-bold">
            {dailyXp}<span className="text-sm font-medium text-muted"> / {dailyGoal} XP</span>
          </p>
          <ProgressBar value={goalPct} className="mt-2" />
          <p className="mt-1.5 text-xs text-muted">{goalPct}% of your daily goal</p>
        </div>
      </Card>

      {/* streak + level */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Flame className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{streak} days</p>
            <p className="mt-1 text-xs text-muted">Streak</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{xp} XP</p>
            <p className="mt-1 text-xs text-muted">Total earned</p>
          </div>
        </Card>
      </div>

      {/* Continue learning */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Continue Learning</h2>
        <Card className="mt-3 overflow-hidden">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={nextLessonSystemImage()} alt="" className="h-full w-full object-cover" />
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
              <span>Lesson {SYSTEMS[0].completed + 1} of {SYSTEMS[0].total}</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" aria-hidden /> ~{nextLesson.minutes} min
              </span>
            </div>
            <Button className="mt-3 w-full" onClick={() => navigate("lesson")}>
              Continue
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick topics */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Topics</h2>
          <button onClick={() => setTab("learn")} className="text-sm font-semibold text-primary">
            See all
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
              <span className="text-sm font-semibold">{q.label}</span>
            </Card>
          ))}
        </div>
      </section>
    </Screen>
  );
}

function nextLessonSystemImage() {
  return SYSTEMS[0].image;
}
