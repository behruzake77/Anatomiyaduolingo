"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Bookmark,
  TrendingUp,
  Settings,
  Info,
  ChevronRight,
  ChevronDown,
  Flame,
  Zap,
  BookOpen,
  GraduationCap,
  Library,
  RotateCcw,
  Box,
  Camera,
  Crown,
  Swords,
  Gamepad2,
  Flag,
  Shield,
  Bell,
  Pencil,
  User,
  Check,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Card } from "@/components/ui/Card";
import { Donut } from "@/components/ui/Donut";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Sticker3D } from "@/components/ui/Sticker3D";
import { useAppStore } from "@/store/useAppStore";
import { levelFromXp, levelTier, xpToNextLevel } from "@/utils/levels";
import { useStrings, TIER_KEY, fmt } from "@/i18n";
import { PREMIUM_DISABLED } from "@/data/premium";
import { LEAGUES } from "@/utils/league";
import { ACHIEVEMENTS } from "@/data/achievements";
import { countOpenReports } from "@/lib/reports";
import { countUnreadBroadcasts } from "@/lib/broadcasts";
import { cn } from "@/utils/cn";

type MenuAction = { screen?: "premium" | "exam" | "battle" | "kahoot" | "quiz-studio" | "review" | "glossary" | "models3d" | "achievements" | "bookmarks" | "progress" | "study" | "settings" | "feedback" | "admin" | "inbox"; info?: "about" };

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  action: MenuAction;
};

type MenuGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
};

export function ProfileScreen() {
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const completedLessons = useAppStore((s) => s.completedLessons.length);
  const currentUser = useAppStore((s) => s.currentUser);
  const avatar = useAppStore((s) => s.avatar);
  const isPremium = useAppStore((s) => s.isPremium) && !PREMIUM_DISABLED;
  const isAdmin = useAppStore((s) => s.isAdmin);
  const navigate = useAppStore((s) => s.navigate);
  const openInfo = useAppStore((s) => s.openInfo);
  const updateUsername = useAppStore((s) => s.updateUsername);
  const updateBirthYear = useAppStore((s) => s.updateBirthYear);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const total = useAppStore((s) => s.total);
  const correct = useAppStore((s) => s.correct);
  const achievements = useAppStore((s) => s.achievements);
  const leagueIndex = useAppStore((s) => s.leagueIndex);
  const t = useStrings();
  const [picker, setPicker] = useState(false);
  const [openReports, setOpenReports] = useState(0);
  const [unreadInbox, setUnreadInbox] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ profile: true });

  // Profilni tahrirlash (username + tug'ilgan yil)
  const [editing, setEditing] = useState(false);
  const [uname, setUname] = useState(currentUser?.username ?? "");
  const thisYear = new Date().getFullYear();
  const [byear, setByear] = useState(String(currentUser?.birthYear ?? ""));
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setProfileErr(null);
    setProfileMsg(null);
    setSaving(true);
    if (uname.trim() && uname.trim() !== currentUser?.username) {
      const r = await updateUsername(uname);
      if (!r.success) {
        setSaving(false);
        setProfileErr(r.error || t.errUsernameTaken);
        return;
      }
    }
    const y = Number(byear);
    if (y && y !== currentUser?.birthYear) {
      const r = await updateBirthYear(y);
      if (!r.success) {
        setSaving(false);
        setProfileErr(r.error || t.errBirthYear);
        return;
      }
    }
    setSaving(false);
    setProfileMsg(t.profileSaved);
    setEditing(false);
  };

  useEffect(() => {
    void countUnreadBroadcasts().then(setUnreadInbox);
    if (!isAdmin) return;
    void countOpenReports().then(setOpenReports);
  }, [isAdmin]);

  const level = levelFromXp(xp);
  const tier = t[TIER_KEY[levelTier(level)]];
  const name = currentUser?.username ?? t.name;
  const league = LEAGUES[Math.min(leagueIndex, LEAGUES.length - 1)];
  const xpProg = xpToNextLevel(xp);
  const progress = Math.round(((xp - xpProg.current) / Math.max(1, xpProg.next - xpProg.current)) * 100);
  const dailyPct = Math.min(100, Math.round((dailyXp / Math.max(1, dailyGoal)) * 100));
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const allMenu: MenuItem[] = [
    { id: "premium", label: t.premium, icon: Crown, action: { screen: "premium" } },
    { id: "exam", label: t.examTitle, icon: GraduationCap, action: { screen: "exam" } },
    { id: "battle", label: t.battleTitle, icon: Swords, action: { screen: "battle" } },
    { id: "kahoot", label: t.kahootTitle, icon: Gamepad2, action: { screen: "kahoot" } },
    { id: "quiz-studio", label: t.quizStudio, icon: Pencil, action: { screen: "quiz-studio" } },
    { id: "challenge", label: t.dailyChallenge, icon: Zap, action: { screen: "exam" } },
    { id: "review", label: t.reviewTitle, icon: RotateCcw, action: { screen: "review" } },
    { id: "glossary", label: t.glossaryTitle, icon: Library, action: { screen: "glossary" } },
    { id: "models3d", label: t.models3d, icon: Box, action: { screen: "models3d" } },
    { id: "achievements", label: t.achievements, icon: Trophy, action: { screen: "achievements" } },
    { id: "bookmarks", label: t.bookmarks, icon: Bookmark, action: { screen: "bookmarks" } },
    { id: "progress", label: t.progress, icon: TrendingUp, action: { screen: "progress" } },
    { id: "study", label: t.studyMode, icon: BookOpen, action: { screen: "study" } },
    { id: "inbox", label: t.inboxTitle, icon: Bell, action: { screen: "inbox" } },
    { id: "feedback", label: t.feedbackTitle, icon: Flag, action: { screen: "feedback" } },
    { id: "admin", label: t.adminTitle, icon: Shield, action: { screen: "admin" } },
    { id: "settings", label: t.settings, icon: Settings, action: { screen: "settings" } },
    { id: "about", label: t.about, icon: Info, action: { info: "about" } },
  ];
  const menu = allMenu.filter((m) => !(PREMIUM_DISABLED && m.id === "premium") && !(m.id === "admin" && !isAdmin));
  const byId = new Map(menu.map((m) => [m.id, m]));

  const menuGroups: MenuGroup[] = [
    {
      id: "profile",
      title: t.menuMyProfile,
      icon: User,
      items: ["premium", "achievements", "bookmarks", "progress", "inbox"]
        .map((id) => byId.get(id))
        .filter((m): m is MenuItem => Boolean(m)),
    },
    {
      id: "reading",
      title: t.menuReading,
      icon: BookOpen,
      items: ["challenge", "exam", "glossary", "models3d", "review", "study"]
        .map((id) => byId.get(id))
        .filter((m): m is MenuItem => Boolean(m)),
    },
    {
      id: "activities",
      title: t.menuActivities,
      icon: Gamepad2,
      items: ["battle", "kahoot", "quiz-studio", "feedback", "admin"]
        .map((id) => byId.get(id))
        .filter((m): m is MenuItem => Boolean(m)),
    },
    {
      id: "settings",
      title: t.menuSettings,
      icon: Settings,
      items: ["settings", "about"]
        .map((id) => byId.get(id))
        .filter((m): m is MenuItem => Boolean(m)),
    },
  ].filter((g) => g.items.length > 0);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const runAction = (item: MenuItem) => {
    if (item.action.info) openInfo(item.action.info);
    else if (item.action.screen) navigate(item.action.screen);
  };

  const unlockedBadges = useMemo(() => ACHIEVEMENTS.filter((a) => achievements.includes(a.id)), [achievements]);

  return (
    <Screen className="pt-6">
      {/* ============ HERO — level ring + avatar ============ */}
      <motion.div
        initial={{ opacity: 1, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-card"
      >
        {/* dekorativ blob */}
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #6C5CE7 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FD79A8 0%, transparent 70%)" }}
        />

        <div className="relative flex items-center gap-4">
          <button onClick={() => setPicker(true)} className="relative shrink-0 rounded-full" aria-label={t.avatarTitle}>
            <Donut value={progress} size={96} stroke={9} color={league.color}>
              <ProfileAvatar name={name} avatar={avatar} />
            </Donut>
            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-soft">
              <Camera className="h-4 w-4" aria-hidden />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t.yourProfile}</p>
            <h1 className="mt-0.5 flex items-center gap-2 break-words text-2xl font-extrabold leading-tight">
              {name}
              {isPremium && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-2 py-0.5 text-[11px] font-bold text-[#1a1230]">
                  <Crown className="h-3 w-3" aria-hidden /> PRO
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {t.level} {level} · {tier}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ backgroundColor: `${league.color}22`, color: league.color }}
              >
                <span>{league.emoji}</span> {t[league.key]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                <Flame className="h-3 w-3" aria-hidden /> {streak} {t.days}
              </span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted">
            <span>{t.xpToNext} → {t.level} {level + 1}</span>
            <span>{fmt(t.xpLeft, { n: Math.max(0, xpProg.next - xp) })}</span>
          </div>
          <ProgressBar value={progress} color={league.color} className="mt-1.5" />
        </div>

        {/* Edit tugmasi */}
        <button
          onClick={() => {
            setEditing((v) => !v);
            setProfileMsg(null);
            setProfileErr(null);
            setUname(currentUser?.username ?? "");
            setByear(String(currentUser?.birthYear ?? ""));
          }}
          className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15 active:scale-[.97]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden /> {t.editProfile}
        </button>
      </motion.div>

      {/* ============ PROFILNI TAHRIRLASH ============ */}
      {editing && (
        <Card className="mt-5 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 break-words text-base font-medium">{t.profileEdit}</span>
          </div>

          <div className="px-4 py-3.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="profile-username">
              {t.username}
            </label>
            <input
              id="profile-username"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
            />
          </div>

          <div className="border-t border-line px-4 py-3.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="profile-birthyear">
              {t.birthYear}
            </label>
            <input
              id="profile-birthyear"
              value={byear}
              onChange={(e) => setByear(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              placeholder={String(thisYear)}
              className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
            />
          </div>

          <div className="border-t border-line px-4 py-3.5">
            {profileErr && <p className="mb-2 text-sm font-medium text-danger">{profileErr}</p>}
            {profileMsg && <p className="mb-2 text-sm font-medium text-success">{profileMsg}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-3xl bg-surface2 px-6 py-4 text-center text-base font-semibold text-muted transition-all duration-150 active:scale-[.97]"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => void saveProfile()}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-soft transition-all duration-150 active:scale-[.97]"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Check className="h-5 w-5" aria-hidden />
                )}
                {t.saveProfile}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* ============ STATS — 3 cards ============ */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard icon={Zap} color="#6C5CE7" value={`${xp}`} label={t.totalEarned} />
        <StatCard icon={Flame} color="#F59E0B" value={`${streak}`} label={t.dayStreak} />
        <StatCard icon={BookOpen} color="#00B894" value={String(completedLessons)} label={t.lessonsDone} />
      </div>

      {/* ============ Daily goal + accuracy ============ */}
      <div className="mt-4 grid grid-cols-1 gap-3">
        <Card className="overflow-hidden p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden /> {t.todayGoal}
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

        <Card className="flex items-center justify-between gap-3 p-4">
          <p className="flex min-w-0 items-center gap-2 text-sm font-bold">
            <TrendingUp className="h-4 w-4 shrink-0 text-success" aria-hidden /> {t.accuracyLabel}
          </p>
          <p className="shrink-0 text-lg font-extrabold text-success">{fmt(t.accuracyVal, { pct: accuracy })}</p>
        </Card>
      </div>

      {/* ============ ACHIEVEMENTS (ochilgan + eng yaqin) ============ */}
      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Sticker3D src="/img/3d/trophy-3d.webp" size={28} className="shrink-0" />
          {t.achievements}
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {unlockedBadges.length}/{ACHIEVEMENTS.length}
          </span>
        </h2>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className="w-[104px] shrink-0">
              <Badge
                icon={a.icon}
                title={a.title}
                description={a.description}
                accent={a.accent}
                locked={!achievements.includes(a.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ============ MENU — kategoriyalarga guruhlangan ============ */}
      <div className="mt-6 space-y-4">
        {menuGroups.map((group) => {
          const open = Boolean(openGroups[group.id]);
          return (
            <section key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-transform duration-150 active:scale-[.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <group.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-base font-semibold">{group.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {fmt(t.menuItems, { n: group.items.length })}
                  </span>
                </span>
                <ChevronDown
                  className={cn("h-5 w-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")}
                  aria-hidden
                />
              </button>

              {open && (
                <Card className="mt-2 overflow-hidden">
                  {group.items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => runAction(item)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface2",
                        index > 0 && "border-t border-line",
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 break-words text-base font-medium">{item.label}</span>
                      {item.id === "admin" && openReports > 0 && (
                        <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-white">{openReports}</span>
                      )}
                      {item.id === "inbox" && unreadInbox > 0 && (
                        <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-white">{unreadInbox}</span>
                      )}
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
                    </button>
                  ))}
                </Card>
              )}
            </section>
          );
        })}
      </div>

      {picker && <AvatarPicker onClose={() => setPicker(false)} />}
    </Screen>
  );
}

function ProfileAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (avatar?.startsWith("emoji:")) {
    return (
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <span style={{ fontSize: 32 }}>{avatar.slice(6)}</span>
      </span>
    );
  }
  if (avatar?.startsWith("color:")) {
    return (
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
        style={{ backgroundColor: avatar.slice(6) }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  if (avatar && !imgFailed) {
    return (
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <img
          src={avatar}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      </span>
    );
  }
  return (
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-soft text-2xl font-bold text-white">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
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
    <Card className="flex min-w-0 flex-col items-center justify-center gap-1.5 p-3 text-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}1a`, color }}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="min-w-0 break-words text-base font-extrabold leading-none">{value}</p>
      <p className="min-w-0 break-words text-center text-xs leading-tight text-muted">{label}</p>
    </Card>
  );
}
