"use client";

import { useEffect, useState } from "react";
import { Sun, Zap, Crown } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
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

  return (
    <Screen className="pt-4">
      {/* brand header */}
      <header className="flex items-center gap-2">
        <Logo size={34} />
        <span className="text-lg font-bold tracking-tight">
          {t.brand}
        </span>
        {isPremium && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-2.5 py-1 text-[11px] font-bold text-[#1a1230]">
            <Crown className="h-3 w-3" aria-hidden /> PRO
          </span>
        )}
      </header>

      {/* greeting */}
      <header className="mt-4 flex items-center gap-3">
        <Avatar name={name} size={44} src={avatar?.startsWith("emoji:") || avatar?.startsWith("color:") ? null : avatar} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Sun className="h-4 w-4 shrink-0 text-warning" aria-hidden /> {t.goodMorning}
          </p>
          <p className="break-words text-base font-semibold leading-tight">{name}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {t.level} {level} · {tier}
        </span>
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
              <div className="flex-1">
                <p className="text-xs font-medium text-white/80">{nextSystem?.name}</p>
                <p className="text-base font-semibold text-white">{nextLesson.title}</p>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                +{nextLesson.xp} XP
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{fmt(t.lessonOf, { n: doneCount + 1, total: ALL_LESSONS.length })}</span>
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
