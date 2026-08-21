"use client";

import { useState } from "react";
import { Trophy, Bookmark, TrendingUp, Settings, Info, ChevronRight, Flame, Zap, BookOpen, GraduationCap, Library, RotateCcw, Box, Camera, Crown } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { levelFromXp, levelTier } from "@/utils/levels";
import { useStrings, TIER_KEY } from "@/i18n";

type MenuAction = { screen?: "premium" | "exam" | "review" | "glossary" | "models3d" | "achievements" | "bookmarks" | "progress" | "study" | "settings"; info?: "about" };

export function ProfileScreen() {
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const completedLessons = useAppStore((s) => s.completedLessons.length);
  const currentUser = useAppStore((s) => s.currentUser);
  const avatar = useAppStore((s) => s.avatar);
  const isPremium = useAppStore((s) => s.isPremium);
  const navigate = useAppStore((s) => s.navigate);
  const openInfo = useAppStore((s) => s.openInfo);
  const t = useStrings();
  const [picker, setPicker] = useState(false);

  const level = levelFromXp(xp);
  const tier = t[TIER_KEY[levelTier(level)]];
  const name = currentUser ?? t.name;

  const menu: { id: string; label: string; icon: typeof Trophy; action: MenuAction }[] = [
    { id: "premium", label: t.premium, icon: Crown, action: { screen: "premium" } },
    { id: "exam", label: t.examTitle, icon: GraduationCap, action: { screen: "exam" } },
    { id: "challenge", label: t.dailyChallenge, icon: Zap, action: { screen: "exam" } },
    { id: "review", label: t.reviewTitle, icon: RotateCcw, action: { screen: "review" } },
    { id: "glossary", label: t.glossaryTitle, icon: Library, action: { screen: "glossary" } },
    { id: "models3d", label: t.models3d, icon: Box, action: { screen: "models3d" } },
    { id: "achievements", label: t.achievements, icon: Trophy, action: { screen: "achievements" } },
    { id: "bookmarks", label: t.bookmarks, icon: Bookmark, action: { screen: "bookmarks" } },
    { id: "progress", label: t.progress, icon: TrendingUp, action: { screen: "progress" } },
    { id: "study", label: t.studyMode, icon: BookOpen, action: { screen: "study" } },
    { id: "settings", label: t.settings, icon: Settings, action: { screen: "settings" } },
    { id: "about", label: t.about, icon: Info, action: { info: "about" } },
  ];

  return (
    <Screen className="pt-6">
      {/* identity */}
      <div className="flex w-full flex-col items-center gap-3 text-center">
        <button onClick={() => setPicker(true)} className="relative" aria-label={t.avatarTitle}>
          <Avatar name={name} size={88} src={avatar?.startsWith("emoji:") || avatar?.startsWith("color:") ? null : avatar} />
          {avatar?.startsWith("emoji:") && (
            <span className="absolute inset-0 flex items-center justify-center text-5xl">{avatar.slice(6)}</span>
          )}
          {avatar?.startsWith("color:") && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full text-2xl font-bold text-white" style={{ background: avatar.slice(6) }}>
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-soft">
            <Camera className="h-4 w-4" aria-hidden />
          </span>
        </button>
        <div className="w-full min-w-0">
          <h1 className="flex items-center justify-center gap-2 break-words text-2xl font-semibold leading-tight">
            {name}
            {isPremium && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-2 py-0.5 text-[11px] font-bold text-[#1a1230]">
                <Crown className="h-3 w-3" aria-hidden /> PRO
              </span>
            )}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {t.level} {level} • {tier}
          </p>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Zap, value: `${xp} XP`, label: t.totalEarned },
          { icon: Flame, value: `${streak} ${t.days}`, label: t.dayStreak },
          { icon: BookOpen, value: String(completedLessons), label: t.lessonsDone },
        ].map((s) => (
          <Card key={s.label} className="flex min-w-0 flex-col items-center gap-1.5 p-3">
            <s.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="break-words text-base font-bold leading-none">{s.value}</p>
            <p className="break-words text-center text-xs text-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* menu */}
      <Card className="mt-6 overflow-hidden">
        {menu.map((m, i) => (
          <button
            key={m.id}
            onClick={() => (m.action.info ? openInfo(m.action.info) : m.action.screen && navigate(m.action.screen))}
            className={
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface2 " +
              (i > 0 ? "border-t border-line" : "")
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <m.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 break-words text-base font-medium">{m.label}</span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
          </button>
        ))}
      </Card>

      {picker && <AvatarPicker onClose={() => setPicker(false)} />}
    </Screen>
  );
}
