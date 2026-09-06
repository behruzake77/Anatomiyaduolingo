import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Crown,
  Flame,
  Pencil,
  Swords,
  Sun,
  Trophy,
  Zap,
} from "lucide-react";
import { InboxBell } from "@/components/InboxBell";
import { SettingsGearButton } from "@/components/ui/SettingsGearButton";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Donut } from "@/components/ui/Donut";
import { Sticker3D } from "@/components/ui/Sticker3D";
import { AdBanner } from "@/components/AdBanner";
import { DashboardBanners } from "@/components/DashboardBanners";
import { ProjectStories } from "@/components/ProjectStories";
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
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const xpHistory = useAppStore((s) => s.xpHistory);
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

  useEffect(() => {
    if (activity.daysAway >= 1) {
      notify(t.notifWelcome, fmt(t[activity.messageKey], { n: streak }));
      try {
        const today = new Date().toISOString().slice(0, 10);
        if (sessionStorage.getItem("corpus-wb-seen-" + today) !== "1")
          setShowWelcomeBack(true);
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
  const todayXp = xpHistory[new Date().toISOString().slice(0, 10)] ?? 0;
  const doneCount = completedLessons.filter((id) =>
    ALL_LESSONS.some((l) => l.id === id),
  ).length;
  const allLessonsDone = doneCount >= ALL_LESSONS.length;
  const nextLesson =
    ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? ALL_LESSONS[0];
  const nextSystem = systemOfLesson(nextLesson.id);
  const name = currentUser?.username ?? t.name;
  const goal = Math.max(1, dailyGoal);
  const goalPct = Math.min(100, Math.round((todayXp / goal) * 100));

  return (
    <Screen className="pb-8 pt-3 sm:pt-5">
      <header className="relative overflow-hidden rounded-[30px] bg-[#16213D] px-5 pb-5 pt-4 text-white shadow-[0_18px_45px_rgba(22,33,61,0.20)] sm:px-6 sm:pb-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#35D0BA]/20 blur-[2px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-16 h-48 w-48 rounded-full bg-[#8F7CFF]/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full border border-white/10"
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
            <HeaderAvatar name={name} avatar={avatar} light />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/60">
              <Sun className="h-3.5 w-3.5 text-[#FFD166]" aria-hidden />{" "}
              {t.goodMorning}
            </p>
            <p className="mt-0.5 truncate text-[18px] font-extrabold tracking-[-0.02em]">
              {name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isPremium && (
              <span className="hidden items-center gap-1 rounded-full bg-[#FFD166] px-2.5 py-1 text-[10px] font-extrabold text-[#16213D] sm:inline-flex">
                <Crown className="h-3 w-3" aria-hidden /> PRO
              </span>
            )}
            <SettingsGearButton />
            <InboxBell className="border-white/15 bg-white/10 text-white" />
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
              {t.level} {level} · {tier}
            </p>
            <h1 className="mt-1 max-w-[260px] text-[28px] font-black leading-[1.02] tracking-[-0.05em] sm:text-[34px]">
              {allLessonsDone ? t.whatNext : t.continueLearning}
            </h1>
            <p className="mt-3 max-w-[270px] text-xs leading-relaxed text-white/65">
              {nextSystem?.name} · {nextLesson.title}
            </p>
          </div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 sm:h-28 sm:w-28">
            <Donut value={goalPct} size={92} stroke={7} color="#35D0BA">
              <div className="text-center">
                <p className="text-xl font-black">{goalPct}%</p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-white/55">
                  XP today
                </p>
              </div>
            </Donut>
            <Sticker3D
              src="/img/3d/heart-3d.webp"
              size={47}
              className="pointer-events-none absolute -bottom-3 -right-3 opacity-95"
            />
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-3.5 py-3 ring-1 ring-white/10">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFD166]/15 text-[#FFD166]">
              <Flame className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">
                {streak} {t.days}
              </p>
              <p className="truncate text-[10px] text-white/55">
                {t.todayGoal} · {todayXp}/{goal} XP
              </p>
            </div>
          </div>
          <Button
            className="h-9 shrink-0 rounded-xl bg-[#35D0BA] px-3.5 text-xs font-extrabold text-[#102E38] shadow-none hover:bg-[#5DE3D0]"
            onClick={() =>
              allLessonsDone ? navigate("topics") : openLesson(nextLesson.id)
            }
          >
            {allLessonsDone ? t.exploreTopics : t.continue}
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      </header>

      <ProjectStories />
      <StreakCelebration streak={streak} />
      {!PREMIUM_DISABLED && !isPremium && <AdBanner />}

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent">
              {t.todayGoal}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">
              {t.quickPlayTitle}
            </h2>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
            {doneCount}/{ALL_LESSONS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickTile
            icon={
              <img
                src="/img/icon/kahoot.svg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl"
              />
            }
            color="#7759E8"
            title={t.quickPlayKahoot}
            sub={t.quickPlayKahootSub}
            onClick={() => navigate("kahoot")}
          />
          <QuickTile
            icon={<Swords className="h-5 w-5" aria-hidden />}
            color="#EF5B73"
            title={t.quickPlayBattle}
            sub={t.quickPlayBattleSub}
            onClick={() => navigate("battle")}
          />
          <QuickTile
            icon={
              <img
                src="/img/icon/exam-checklist.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-contain"
              />
            }
            color="#E4A62D"
            title={t.quickPlayExam}
            sub={t.quickPlayExamSub}
            onClick={() => navigate("exam")}
          />
          <QuickTile
            icon={<Pencil className="h-5 w-5" aria-hidden />}
            color="#22B69B"
            title={t.quickPlayQuiz}
            sub={t.quickPlayQuizSub}
            onClick={() => navigate("quiz-studio")}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent">
              {t.continueLearning}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">
              {nextSystem?.name}
            </h2>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-muted">
            <Trophy className="h-3.5 w-3.5 text-[#E4A62D]" aria-hidden /> {xp}{" "}
            XP
          </span>
        </div>
        <Card className="group overflow-hidden rounded-[26px] border-0 bg-surface shadow-[0_12px_32px_rgba(31,42,68,0.10)] ring-1 ring-line/50">
          <div className="relative h-40 w-full overflow-hidden sm:h-48">
            <img
              src={nextSystem?.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111A31]/85 via-[#111A31]/20 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              <BookOpen className="h-3 w-3" aria-hidden /> {nextLesson.minutes}{" "}
              {t.min}
            </div>
            <Sticker3D
              src="/img/3d/lessons-book.webp"
              size={66}
              className="pointer-events-none absolute right-3 top-3"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white/65">
                  {nextSystem?.name}
                </p>
                <p className="mt-1 truncate text-lg font-extrabold tracking-[-0.02em] text-white">
                  {nextLesson.title}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#35D0BA] px-2.5 py-1 text-[10px] font-black text-[#102E38]">
                +{nextLesson.xp} XP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold text-muted">
                <span>
                  {allLessonsDone
                    ? t.allLessonsComplete
                    : fmt(t.lessonOf, {
                        n: doneCount + 1,
                        total: ALL_LESSONS.length,
                      })}
                </span>
                <span>
                  {Math.round(
                    (doneCount / Math.max(1, ALL_LESSONS.length)) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7759E8] to-[#35D0BA]"
                  style={{
                    width: `${Math.max(5, Math.round((doneCount / Math.max(1, ALL_LESSONS.length)) * 100))}%`,
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              aria-label={t.continue}
              onClick={() =>
                allLessonsDone ? navigate("topics") : openLesson(nextLesson.id)
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#16213D] text-white transition hover:bg-[#27365D] active:scale-95"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </Card>
      </section>

      <DashboardBanners />

      {showWelcomeBack && (
        <WelcomeBackModal
          daysAway={activity.daysAway}
          onClose={closeWelcomeBack}
          onContinue={() => {
            closeWelcomeBack();
            if (allLessonsDone) navigate("topics");
            else openLesson(nextLesson.id);
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

function HeaderAvatar({
  name,
  avatar,
  light,
}: {
  name: string;
  avatar: string | null;
  light?: boolean;
}) {
  if (avatar?.startsWith("emoji:"))
    return <span className="text-2xl leading-none">{avatar.slice(6)}</span>;
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
    <Avatar
      name={name}
      size={40}
      src={avatar}
      className="h-full w-full rounded-xl object-cover"
    />
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
      className="group relative flex min-h-[108px] min-w-0 flex-col justify-between overflow-hidden rounded-[22px] p-3.5 text-left text-white shadow-[0_10px_24px_rgba(31,42,68,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,42,68,0.16)] active:scale-[.97]"
      style={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}D9 100%)`,
      }}
    >
      <span
        className="pointer-events-none absolute -right-4 -top-5 h-16 w-16 rounded-full bg-white/10"
        aria-hidden
      />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/15">
        {icon}
      </span>
      <span className="relative mt-3 min-w-0">
        <span className="block truncate text-xs font-extrabold leading-tight">
          {title}
        </span>
        <span className="mt-1 block truncate text-[10px] font-medium text-white/70">
          {sub}
        </span>
      </span>
    </button>
  );
}
