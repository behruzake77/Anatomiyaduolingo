"use client";

import { useEffect, useState } from "react";
import { Sun, Zap, Crown, Gamepad2, Swords, ClipboardList, Pencil } from "lucide-react";
import { InboxBell } from "@/components/InboxBell";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Sticker3D } from "@/components/ui/Sticker3D";
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
      {/* Hero header — gradient kartochka */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C5CE7] via-[#7B6CF0] to-[#FD79A8] p-4 text-white shadow-pop">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/15" aria-hidden />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-white/10" aria-hidden />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/25 ring-2 ring-white/40">
            <HeaderAvatar name={name} avatar={avatar} light />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/85">
              <Sun className="h-4 w-4 shrink-0" aria-hidden /> {t.goodMorning}
            </p>
            <p className="break-words text-[17px] font-bold leading-snug">{name}</p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
              <Zap className="h-3 w-3" aria-hidden /> {t.level} {level} · {tier}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-2.5 py-1 text-[11px] font-bold text-[#1a1230]">
                <Crown className="h-3 w-3" aria-hidden /> PRO
              </span>
            )}
            <InboxBell className="border-white/30 bg-white/20 text-white" />
          </div>
        </div>
      </header>

      <StreakCelebration streak={streak} />

      {/* Reklama banneri — faqat bepul foydalanuvchilarga (Premium o'chirilganda — umuman yo'q) */}
      {!PREMIUM_DISABLED && !isPremium && <AdBanner />}

      {/* Tezkor o'yinlar — rangli plitkalar */}
      <section className="mt-5">
        <h2 className="text-lg font-semibold">{t.quickPlayTitle}</h2>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          <QuickTile
            icon={<Gamepad2 className="h-5 w-5" aria-hidden />}
            color="#46178F"
            title={t.quickPlayKahoot}
            sub={t.quickPlayKahootSub}
            onClick={() => navigate("kahoot")}
          />
          <QuickTile
            icon={<Swords className="h-5 w-5" aria-hidden />}
            color="#E21B3C"
            title={t.quickPlayBattle}
            sub={t.quickPlayBattleSub}
            onClick={() => navigate("battle")}
          />
          <QuickTile
            icon={<ClipboardList className="h-5 w-5" aria-hidden />}
            color="#D89E00"
            title={t.quickPlayExam}
            sub={t.quickPlayExamSub}
            onClick={() => navigate("exam")}
          />
          <QuickTile
            icon={<Pencil className="h-5 w-5" aria-hidden />}
            color="#26890C"
            title={t.quickPlayQuiz}
            sub={t.quickPlayQuizSub}
            onClick={() => navigate("quiz-studio")}
          />
        </div>
      </section>

      {/* Continue learning */}
      <section className="mt-5">
        <h2 className="text-lg font-semibold">{t.continueLearning}</h2>
        <Card className="mt-3 overflow-hidden ring-1 ring-primary/20">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={nextSystem?.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <Sticker3D
              src="/img/3d/lessons-book.webp"
              size={64}
              className="pointer-events-none absolute right-3 top-3"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/85">{nextSystem?.name}</p>
                <p className="truncate text-base font-bold text-white">{nextLesson.title}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gradient-to-r from-[#00B894] to-[#55EFC4] px-3 py-1 text-xs font-bold text-white">
                +{nextLesson.xp} XP
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between gap-3 text-xs text-muted">
              <span>{fmt(t.lessonOf, { n: doneCount + 1, total: ALL_LESSONS.length })}</span>
              <span className="flex shrink-0 items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-warning" aria-hidden /> ~{nextLesson.minutes} {t.min}
              </span>
            </div>
            <Button
              className="mt-3 w-full bg-gradient-to-r from-[#6C5CE7] to-[#8E7CF3] shadow-soft hover:from-[#5A4BD1] hover:to-[#6C5CE7]"
              onClick={() => openLesson(nextLesson.id)}
            >
              {t.continue}
            </Button>
          </div>
        </Card>
      </section>

      {/* Statistikalar — rangli kartalar */}
      <section className="mt-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard sticker="/img/3d/xp-star.webp" color="#6C5CE7" value={`${xp}`} label={t.totalEarned} />
          <StatCard sticker="/img/3d/streak-flame.webp" color="#F59E0B" value={`${streak}`} label={t.dayStreak} />
          <StatCard sticker="/img/3d/lessons-book.webp" color="#00B894" value={String(doneCount)} label={t.lessonsDone} />
          <StatCard sticker="/img/3d/accuracy-check.webp" color="#FD79A8" value={fmt(t.accuracyVal, { pct: accuracy })} label={t.accuracyLabel} />
        </div>
      </section>

      {/* Bugungi maqsad */}
      <section className="mt-4">
        <Card className="overflow-hidden p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-sm font-bold">
              <Sticker3D src="/img/3d/daily-target.webp" size={24} className="shrink-0" />
              <span className="min-w-0">{t.todayGoal}</span>
            </p>
            <p className="shrink-0 bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] bg-clip-text text-sm font-extrabold text-transparent">
              {dailyXp}/{dailyGoal} XP
            </p>
          </div>
          <ProgressBar
            value={dailyPct}
            color="linear-gradient(90deg, #6C5CE7 0%, #8E7CF3 55%, #FD79A8 100%)"
            className="mt-2.5 h-3"
          />
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

function HeaderAvatar({ name, avatar, light }: { name: string; avatar: string | null; light?: boolean }) {
  if (avatar?.startsWith("emoji:")) {
    return <span className="text-2xl leading-none">{avatar.slice(6)}</span>;
  }
  if (avatar?.startsWith("color:")) {
    return (
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
        style={{ backgroundColor: avatar.slice(6) }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return light ? (
    <Avatar name={name} size={40} src={avatar} className="h-full w-full rounded-xl object-cover" />
  ) : (
    <Avatar name={name} size={44} src={avatar} className="shadow-card" />
  );
}

function QuickTile({
  icon,
  color,
  title,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-col items-center gap-1 rounded-2xl p-2.5 pb-3 text-center text-white shadow-md transition active:scale-[.96]"
      style={{ background: `linear-gradient(160deg, ${color} 0%, ${color}CC 100%)` }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">{icon}</span>
      <span className="w-full truncate text-[11px] font-bold leading-tight">{title}</span>
      <span className="w-full truncate text-[9px] font-medium leading-tight text-white/80">{sub}</span>
    </button>
  );
}

function StatCard({
  sticker,
  value,
  label,
  color,
}: {
  sticker: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <Card
      className="flex min-w-0 flex-col items-center justify-center gap-1.5 border-0 px-2 py-3 text-center"
    >
      <div
        className="flex min-w-0 flex-col items-center justify-center gap-1.5 px-2 py-2"
        style={{ background: `linear-gradient(160deg, ${color}14 0%, ${color}26 100%)` }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
          style={{ backgroundColor: `${color}1f` }}
        >
          <Sticker3D src={sticker} size={28} />
        </span>
        <p className="min-w-0 break-words text-base font-extrabold leading-none" style={{ color }}>
          {value}
        </p>
        <p className="min-w-0 break-words text-xs leading-tight text-muted">{label}</p>
      </div>
    </Card>
  );
}
