"use client";

import { useEffect, useState } from "react";
import { Trophy, Bookmark, TrendingUp, Settings, Info, ChevronRight, Flame, Zap, BookOpen, GraduationCap, Library, RotateCcw, Box, Camera, Crown, Swords, Gamepad2, Flag, Shield, Bell, Pencil, User, Check } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { levelFromXp, levelTier } from "@/utils/levels";
import { useStrings, TIER_KEY } from "@/i18n";
import { PREMIUM_DISABLED } from "@/data/premium";
import { countOpenReports } from "@/lib/reports";
import { countUnreadBroadcasts } from "@/lib/broadcasts";

type MenuAction = { screen?: "premium" | "exam" | "battle" | "kahoot" | "quiz-studio" | "challenge" | "review" | "glossary" | "models3d" | "achievements" | "bookmarks" | "progress" | "study" | "settings" | "feedback" | "admin" | "inbox"; info?: "about" };

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
  const t = useStrings();
  const [picker, setPicker] = useState(false);
  const [openReports, setOpenReports] = useState(0);
  const [unreadInbox, setUnreadInbox] = useState(0);

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

  const allMenu: { id: string; label: string; icon: typeof Trophy; action: MenuAction }[] = [
    { id: "premium", label: t.premium, icon: Crown, action: { screen: "premium" } },
    { id: "exam", label: t.examTitle, icon: GraduationCap, action: { screen: "exam" } },
    { id: "battle", label: t.battleTitle, icon: Swords, action: { screen: "battle" } },
    { id: "kahoot", label: t.kahootTitle, icon: Gamepad2, action: { screen: "kahoot" } },
    { id: "quiz-studio", label: t.quizStudio, icon: Pencil, action: { screen: "quiz-studio" } },
    { id: "challenge", label: t.dailyChallenge, icon: Zap, action: { screen: "challenge" } },
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
          <button
            onClick={() => {
              setEditing((v) => !v);
              setProfileMsg(null);
              setProfileErr(null);
              setUname(currentUser?.username ?? "");
              setByear(String(currentUser?.birthYear ?? ""));
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> {t.editProfile}
          </button>
        </div>
      </div>

      {/* Profilni tahrirlash */}
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

      {/* menu - scrollable */}
      <div className="mt-6 max-h-[600px] overflow-y-auto rounded-2xl">
        <Card className="overflow-hidden">
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
              {m.id === "admin" && openReports > 0 && (
                <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-white">{openReports}</span>
              )}
              {m.id === "inbox" && unreadInbox > 0 && (
                <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-white">{unreadInbox}</span>
              )}
              <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
            </button>
          ))}
        </Card>
      </div>

      {picker && <AvatarPicker onClose={() => setPicker(false)} />}
    </Screen>
  );
}
