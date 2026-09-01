"use client";

import { useEffect, useState } from "react";
import { Sun, Zap, Flame, BookOpen, TrendingUp, Crown, type LucideIcon } from "lucide-react";
import { InboxBell } from "@/components/InboxBell";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AdBanner } from "@/components/AdBanner";
import { DashboardBanners } from "@/components/DashboardBanners";
import { useAppStore } from "@/store/useAppStore";
import { ALL_LESSONS, systemOfLesson } from "@/data/content";
import { activityState } from "@/utils/activity";
import { StreakCelebration } from "@/components/reengage/StreakCelebration";
import { useNotifications } from "@/hooks/useNotifications";
import { levelFromXp, levelTier } from "@/utils/levels";
import { useStrings, TIER_KEY, fmt } from "@/i18n";
import { PREMIUM_DISABLED } from "@/data/premium";

import { WelcomeBackModal } from "@/components/reengage/WelcomeBackModal";

export function DashboardScreen() {
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const correct = useAppStore((s) => s.correct);
  const total = useAppStore((s) => s.total);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const currentUser = useAppStore((s) => s.currentUser);
  const avatar = useAppStore((s) => s.avatar);
  const isPremium = useAppStore((s) => s.isPremium) && !PREMIUM_DISABLED;
  const lastActiveAt = useAppStore((s) => s.lastActiveAt);
  const navigate = useAppStore((s) => s.navigate);
  const openLesson = useAppStore((s) => s.openLesson);
  const publishProfile = useAppStore((s) => s.publishProfile);
  const t = useStrings();

  const activity = activityState(streak, lastActiveAt);
  const { notify } = useNotifications();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    publishProfile();
  }, [publishProfile]);

  // Uzoq kirmagan bo'lsa — qaytib kelganda bildirishnoma + comeback modal (kuniga bir marta).
  useEffect(() => {
    if (activity.daysAway >= 1) {
      notify(t.notifWelcome, fmt(t[activity.messageKey], { n: streak }));
      try {
        const today = new Date().toISOString().slice(0, 10);
        if (sessionStorage.getItem("corpus-wb-seen-" + today) !== "1") setShowWelcomeBack(true);
      } catch {
        /* no-op */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeWelcomeBack = () => {
    setShowWelcomeBack(false);
    try {
      const today = new Date().toISOString().slice(0, 10);
      sessionStorage.setItem("corpus-wb-seen-" + today, "1");
    } catch {
      /* no-op */
    }
  };
  const level = levelFromXp(xp);
  const tier = t[TIER_KEY[levelTier(level)]];
  const doneCount = completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length;
  const nextLesson = ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? ALL_LESSONS[0];
  const nextSystem = systemOfLesson(nextLesson.id);
  const name = currentUser?.username ?? t.name;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const dailyPct = Math.min(100, Math.round((dailyXp / Math.max(1, dailyGoal)) * 100));

  return (
    <Screen className="pt-4">
      {/* personal mobile-app header */}
      <header className="flex items-center gap-3">
        <HeaderAvatar name={name} avatar={avatar} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Sun className="h-4 w-4 shrink-0 text-warning" aria-hidden /> {t.goodMorning}
          </p>
          <p className="break-words text-[17px] font-semibold leading-snug">{name}</p>
          <p className="mt-0.5 break-words text-xs font-semibold text-primary">
            {t.level} {level} · {tier}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-2.5 py-1 text-[11px] font-bold text-[#1a1230]">
              <Crown className="h-3 w-3" aria-hidden /> PRO
            </span>
          )}
          <InboxBell />
        </div>
      </header>

      <StreakCelebration streak={streak} />

      {/* Reklama banneri — faqat bepul foydalanuvchilarga (Premium o'chirilganda — umuman yo'q) */}
      {!PREMIUM_DISABLED && !isPremium && <AdBanner />}

      {/* Continue learning */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t.continueLearning}</h2>
        <Card className="mt-3 overflow-hidden">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={nextSystem?.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/80">{nextSystem?.name}</p>
                <p className="truncate text-base font-semibold text-white">{nextLesson.title}</p>
              </div>
              <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                +{nextLesson.xp} XP
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between gap-3 text-xs text-muted">
              <span>{fmt(t.lessonOf, { n: doneCount + 1, total: ALL_LESSONS.length })}</span>
              <span className="flex shrink-0 items-center gap-1">
                <Zap className="h-3.5 w-3.5" aria-hidden /> ~{nextLesson.minutes} {t.min}
              </span>
            </div>
            <Button className="mt-3 w-full" onClick={() => openLesson(nextLesson.id)}>
              {t.continue}
            </Button>
          </div>
        </Card>
      </section>

      {/* Statistikalar */}
      <section className="mt-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Zap} color="#6C5CE7" value={`${xp}`} label={t.totalEarned} />
          <StatCard icon={Flame} color="#F59E0B" value={`${streak}`} label={t.dayStreak} />
          <StatCard icon={BookOpen} color="#00B894" value={String(doneCount)} label={t.lessonsDone} />
          <StatCard icon={TrendingUp} color="#FD79A8" value={fmt(t.accuracyVal, { pct: accuracy })} label={t.accuracyLabel} />
        </div>
      </section>

      {/* Bugungi maqsad */}
      <section className="mt-3">
        <Card className="overflow-hidden p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-sm font-bold">
              <Zap className="h-4 w-4 shrink-0 text-primary" aria-hidden /> {t.todayGoal}
            </p>
            <p className="shrink-0 text-sm font-extrabold text-primary">
              {dailyXp}/{dailyGoal} XP
            </p>
          </div>
          <ProgressBar value={dailyPct} color="#6C5CE7" className="mt-2.5" />
          <p className="mt-2 text-xs text-muted">
            {dailyPct >= 100 ? t.goalCompleted : fmt(t.goalPercent, { pct: dailyPct })}
          </p>
        </Card>
      </section>

      {/* Bo'limlar reklaması + loyiha yangiliklari bannerlari */}
      <DashboardBanners />

      {/* comeback modal (lazy) */}
      {showWelcomeBack && (
        <WelcomeBackModal
          daysAway={activity.daysAway}
          onClose={closeWelcomeBack}
          onContinue={() => {
            closeWelcomeBack();
            openLesson(nextLesson.id);
          }}
          onChallenge={() => {
            closeWelcomeBack();
            navigate("exam");
          }}
        />
      )}
    </Screen>
  );
}

function HeaderAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar?.startsWith("emoji:")) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl shadow-card">
        {avatar.slice(6)}
      </span>
    );
  }
  if (avatar?.startsWith("color:")) {
    return (
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-card"
        style={{ backgroundColor: avatar.slice(6) }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return <Avatar name={name} size={44} src={avatar} className="shadow-card" />;
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <Card className="flex min-w-0 flex-col items-center justify-center gap-1.5 px-2 py-3 text-center">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="min-w-0 break-words text-base font-extrabold leading-none">{value}</p>
      <p className="min-w-0 break-words text-xs leading-tight text-muted">{label}</p>
    </Card>
  );
}
