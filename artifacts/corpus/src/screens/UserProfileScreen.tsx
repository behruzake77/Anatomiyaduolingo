"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame, Zap, Trophy, Swords, Shield } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Donut } from "@/components/ui/Donut";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, TIER_KEY } from "@/i18n";
import { fetchPublicProfile, type PublicProfile } from "@/lib/userProfile";
import { ACHIEVEMENTS } from "@/data/achievements";
import { LEAGUES } from "@/utils/league";
import { levelFromXp, levelTier, xpToNextLevel } from "@/utils/levels";

/** Boshqa foydalanuvchining ommaviy profili — Duolingo uslubida. */
export function UserProfileScreen() {
  const t = useStrings();
  const target = useAppStore((s) => s.viewProfileUser);
  const close = useAppStore((s) => s.closeUserProfile);
  const back = useAppStore((s) => s.back);
  const currentUser = useAppStore((s) => s.currentUser);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setProfile(null);
    if (target?.id) {
      void fetchPublicProfile(target.id).then((p) => {
        if (!alive) return;
        setProfile(p);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      alive = false;
    };
  }, [target?.id]);

  return (
    <Screen padded={false}>
      <TopBar
        title={profile?.username ?? target?.username ?? t.profile}
        onBack={() => {
          close();
          back();
        }}
      />

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="h-8 w-8 animate-pulse rounded-full bg-primary/40" />
        </div>
      ) : !profile ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface2 text-muted">
            <Shield className="h-8 w-8" aria-hidden />
          </span>
          <p className="text-sm text-muted">{t.adminUsersEmpty}</p>
        </div>
      ) : (
        <ProfileBody profile={profile} t={t} />
      )}
    </Screen>
  );
}

function ProfileBody({ profile, t }: { profile: PublicProfile; t: Record<string, string> }) {
  const level = levelFromXp(profile.xp);
  const tier = t[TIER_KEY[levelTier(level)]];
  const league = LEAGUES[Math.min(profile.league_index, LEAGUES.length - 1)];
  const xpProg = xpToNextLevel(profile.xp);
  const progress = Math.round((profile.xp - xpProg.current) / Math.max(1, xpProg.next - xpProg.current) * 100);

  const avatar = profile.avatar;
  const initials = profile.username.slice(0, 1).toUpperCase();

  return (
    <div className="px-5 pb-28">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-card"
      >
        <div className="flex items-center gap-4">
          <Donut value={progress} size={92} stroke={9} color="#6C5CE7">
            <div
              className="flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-full text-2xl font-extrabold text-white"
              style={avatarColorStyle(avatar, initials)}
            >
              {avatarContent(avatar, profile.username, 26)}
            </div>
          </Donut>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-extrabold leading-tight">{profile.username}</h1>
              {profile.is_admin && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  <Shield className="mr-0.5 inline h-3 w-3" aria-hidden /> ADMIN
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {t.level} {level} · {tier}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ backgroundColor: `${league.color}22`, color: league.color }}
              >
                <span>{league.emoji}</span> {t[league.key]}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>{t.level} {level}</span>
            <span>
              {profile.xp} / {xpProg.next} XP
            </span>
          </div>
          <ProgressBar value={progress} color="#6C5CE7" className="mt-1.5" />
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard icon={Zap} color="#6C5CE7" value={`${profile.xp}`} label={t.totalEarned} />
        <StatCard icon={Flame} color="#F59E0B" value={`${profile.streak}`} label={t.streak} />
        <StatCard icon={Swords} color="#FD79A8" value={`${profile.battles_won}`} label={t.battleWins} />
      </div>

      {/* League meter */}
      <Card className="mt-4 overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{league.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold leading-tight">{t[league.key]}</p>
            <p className="mt-0.5 text-xs text-muted">
              {t.weekEndsIn}: {profile.week_xp} XP
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-primary/10 px-3 py-2 text-center">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">{t.totalEarned}</span>
            <span className="block text-base font-extrabold leading-none text-primary">{profile.xp}</span>
          </span>
        </div>
      </Card>

      {/* Achievement badges */}
      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Trophy className="h-5 w-5 text-primary" aria-hidden /> {t.achievements}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <Badge
              key={a.id}
              icon={a.icon}
              title={t[a.title] || a.title}
              description={t[a.description] || a.description}
              accent={a.accent}
              locked={!profile.badges.includes(a.id)}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted">
        {formatDate(profile.created_at)}
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof Zap;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <Card className="flex min-w-0 flex-col items-center gap-1.5 p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}1a`, color }}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="break-words text-base font-extrabold leading-none">{value}</p>
      <p className="break-words text-center text-xs text-muted">{label}</p>
    </Card>
  );
}

function avatarColorStyle(avatar: string | null, initials: string): React.CSSProperties {
  if (avatar?.startsWith("color:")) return { backgroundColor: avatar.slice(6) };
  if (avatar?.startsWith("emoji:")) return { backgroundColor: "#6C5CE7" };
  if (avatar) return { backgroundColor: "#6C5CE7" };
  return { backgroundColor: "#6C5CE7" };
}

function avatarContent(avatar: string | null, name: string, emojiSize: number): React.ReactNode {
  if (avatar?.startsWith("emoji:")) return <span style={{ fontSize: emojiSize }}>{avatar.slice(6)}</span>;
  if (avatar?.startsWith("color:")) return name.slice(0, 1).toUpperCase();
  return name.slice(0, 1).toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
