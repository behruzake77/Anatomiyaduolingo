"use client";

/**
 * Reyting — haqiqiy o'quvchilar (Supabase) + virtual liga zaxirasi.
 * Tablar: haftalik XP, umumiy XP, arena g'alabalari.
 */

import { useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Minus, X, Swords, Radio } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import {
  LEAGUES,
  PROMOTE_SLOTS,
  DEMOTE_SLOTS,
  boardFor,
  userRank,
  userWeekXp,
  weekKeyOf,
  nextWeekEnd,
  hueColor,
  type BoardEntry,
} from "@/utils/league";
import { fetchRankings, type RankEntry, type RankKind } from "@/lib/competition";

export function LeaderboardScreen() {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const xpHistory = useAppStore((s) => s.xpHistory);
  const currentUser = useAppStore((s) => s.currentUser);
  const leagueIndex = useAppStore((s) => s.leagueIndex);
  const leagueResult = useAppStore((s) => s.leagueResult);
  const dismiss = useAppStore((s) => s.dismissLeagueResult);
  const xp = useAppStore((s) => s.xp);
  const battlesWon = useAppStore((s) => s.battlesWon);
  const battlesLost = useAppStore((s) => s.battlesLost);
  const avatar = useAppStore((s) => s.avatar);
  const publishProfile = useAppStore((s) => s.publishProfile);
  const openUserProfile = useAppStore((s) => s.openUserProfile);

  const [tab, setTab] = useState<RankKind>("week");
  const [liveRows, setLiveRows] = useState<RankEntry[] | null>(null);
  const [live, setLive] = useState(false);

  const league = LEAGUES[Math.min(leagueIndex, LEAGUES.length - 1)];
  const weekKey = weekKeyOf(new Date());
  const myXp = useMemo(() => userWeekXp(xpHistory, weekKey), [xpHistory, weekKey]);
  const virtualBoard = useMemo(
    () => boardFor(weekKey, leagueIndex, currentUser?.username ?? "", myXp),
    [weekKey, leagueIndex, currentUser, myXp],
  );

  useEffect(() => {
    publishProfile();
    let alive = true;
    void fetchRankings(tab, {
      id: currentUser?.id,
      name: currentUser?.username ?? "",
      xp,
      weekXp: myXp,
      wins: battlesWon,
      losses: battlesLost,
      avatar,
    }).then((res) => {
      if (!alive) return;
      setLive(res.live);
      setLiveRows(res.rows);
    });
    return () => {
      alive = false;
    };
  }, [tab, currentUser, xp, myXp, battlesWon, battlesLost, avatar, publishProfile]);

  const useLive = live && (liveRows?.filter((r) => r.live && !r.isYou).length ?? 0) >= 1;
  const board: Array<BoardEntry & { live?: boolean; wins?: number; avatar?: string | null; id?: string }> = useLive
    ? (liveRows ?? []).map((r) => ({
        name: r.name,
        xp: r.xp,
        isYou: r.isYou,
        hue: r.hue,
        live: r.live,
        wins: r.wins,
        avatar: r.avatar,
        id: r.id,
      }))
    : tab === "week"
      ? virtualBoard.map((e) => (e.isYou ? { ...e, avatar } : e))
      : [
          {
            name: currentUser?.username ?? t.you,
            xp: tab === "arena" ? battlesWon : xp,
            isYou: true,
            hue: 262,
            live: Boolean(currentUser),
            wins: battlesWon,
            avatar,
          },
        ];

  const rank = userRank(board);

  const [left, setLeft] = useState(() => nextWeekEnd().getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(nextWeekEnd().getTime() - Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const days = Math.max(0, Math.floor(left / 86400000));
  const hours = Math.max(0, Math.floor((left % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((left % 3600000) / 60000));

  const showResult = leagueResult && leagueResult.weekKey === weekKey;
  const xpLabel = tab === "arena" ? t.battleWins : "XP";

  return (
    <Screen padded={false}>
      <TopBar title={t.leaderboardTitle} />

      <div className="px-5 pb-28">
        <div className="mt-1 grid grid-cols-3 gap-1 rounded-2xl border border-line bg-surface2 p-1">
          {(
            [
              ["week", t.battleTabWeek],
              ["all", t.battleTabAll],
              ["arena", t.battleTabArena],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-xl py-2 text-xs font-bold ${tab === id ? "bg-surface text-ink shadow-soft" : "text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "week" && (
          <div
            className="relative mt-3 overflow-hidden rounded-2xl border border-line p-4 shadow-card"
            style={{ backgroundImage: `linear-gradient(150deg, ${league.color}2e 0%, transparent 70%)` }}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl leading-none">{league.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold leading-tight">{t[league.key]}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {t.weekEndsIn}:{" "}
                  <span className="font-semibold text-primary">
                    {days} {t.timeDay} {hours} {t.timeHour} {mins} {t.timeMin}
                  </span>
                </p>
              </div>
              <div className="shrink-0 rounded-xl bg-primary/10 px-3 py-2 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{t.yourRank}</p>
                <p className="text-lg font-extrabold leading-none text-primary">#{rank}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          {useLive ? (
            <>
              <Radio className="h-3.5 w-3.5 text-success" aria-hidden />
              <span className="font-semibold text-success">{t.leaderboardLive}</span>
              <span>· {t.battleRealHint}</span>
            </>
          ) : (
            <span>{t.battleFewPlayers}</span>
          )}
        </div>

        {showResult && tab === "week" && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-card">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: leagueResult.change === "down" ? "#ef44441f" : "#22c55e1f",
                color: leagueResult.change === "down" ? "#ef4444" : "#22c55e",
              }}
            >
              {leagueResult.change === "up" ? (
                <ArrowUp className="h-5 w-5" aria-hidden />
              ) : leagueResult.change === "down" ? (
                <ArrowDown className="h-5 w-5" aria-hidden />
              ) : (
                <Minus className="h-5 w-5" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted">{t.lastWeekResult}</p>
              <p className="text-sm font-semibold leading-snug">
                {leagueResult.change === "up"
                  ? fmt(t.leagueUp, { league: t[LEAGUES[leagueResult.to].key] })
                  : leagueResult.change === "down"
                    ? fmt(t.leagueDown, { league: t[LEAGUES[leagueResult.to].key] })
                    : fmt(t.leagueStay, { league: t[LEAGUES[leagueResult.from].key] })}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {fmt(t.yourFinishedRank, { n: leagueResult.rank })} · {leagueResult.rank <= PROMOTE_SLOTS ? "⬆️" : leagueResult.rank > board.length - DEMOTE_SLOTS ? "⬇️" : "➖"}
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Yopish"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted active:scale-95"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        {board.length >= 3 && (
          <div className="mt-5 flex items-end justify-center gap-3">
            <PodiumSpot entry={board[1]} place={2} t={t} />
            <PodiumSpot entry={board[0]} place={1} t={t} />
            <PodiumSpot entry={board[2]} place={3} t={t} />
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {board.map((e, i) => {
            const r = i + 1;
            return (
              <div key={e.name + i}>
                {tab === "week" && !useLive && r === PROMOTE_SLOTS + 1 && (
                  <ZoneLabel icon={<ArrowUp className="h-3.5 w-3.5" aria-hidden />} text={t.promotionZone} color="#22c55e" />
                )}
                {tab === "week" && !useLive && r === board.length - DEMOTE_SLOTS && (
                  <ZoneLabel icon={<ArrowDown className="h-3.5 w-3.5" aria-hidden />} text={t.demotionZone} color="#ef4444" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    const id = "id" in e ? e.id : undefined;
                    if (id) openUserProfile({ id, username: e.name });
                  }}
                  className={`flex w-full items-center gap-3 border-b border-line/60 px-4 py-2.5 text-left last:border-b-0 ${
                    e.isYou ? "bg-primary/10" : ""
                  } ${"id" in e && e.id ? "transition hover:bg-surface2 active:scale-[.995]" : "cursor-default"}`}
                >
                  <span className="w-6 shrink-0 text-center text-sm font-bold text-muted">
                    {r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r}
                  </span>
                  <AvatarBadge
                    name={e.name}
                    hue={e.hue}
                    isYou={e.isYou}
                    avatar={e.avatar}
                    size={32}
                    t={t}
                  />
                  <span className={`min-w-0 flex-1 truncate text-sm ${e.isYou ? "font-bold" : "font-medium"}`}>
                    {e.isYou ? `${e.name} · ${t.you}` : e.name}
                    {e.live && !e.isYou && (
                      <span className="ml-1.5 inline-flex items-center rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-success">
                        {t.battleLive}
                      </span>
                    )}
                    {!e.live && !e.isYou && tab === "week" && (
                      <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
                        {t.battlePractice}
                      </span>
                    )}
                  </span>
                  <span className={`shrink-0 text-sm font-bold ${e.isYou ? "text-primary" : "text-muted"}`}>
                    {e.xp} {xpLabel}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <Button className="mt-5 w-full" size="lg" onClick={() => navigate("battle")}>
          <Swords className="h-5 w-5" aria-hidden /> {t.battleTitle}
        </Button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
          {useLive ? t.battleRealHint : t.leagueHint}
        </p>
      </div>
    </Screen>
  );
}

/** Avatar yoki (avtomatik rangli) bosh harf ko'rsatadi. */
function AvatarBadge({
  name,
  hue,
  isYou,
  avatar,
  size,
  t,
}: {
  name: string;
  hue: number;
  isYou: boolean;
  avatar?: string | null;
  size: number;
  t: Record<string, string>;
}) {
  const px = { width: size, height: size, fontSize: Math.max(10, size * 0.4) };
  if (avatar) {
    // emoji avatar
    if (avatar.startsWith("emoji:")) {
      return (
        <span className="flex shrink-0 items-center justify-center rounded-full" style={px}>
          <span style={{ fontSize: size * 0.55 }}>{avatar.slice(6)}</span>
        </span>
      );
    }
    // rangli avatar
    if (avatar.startsWith("color:")) {
      return (
        <span
          className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
          style={{ ...px, backgroundColor: avatar.slice(6) }}
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    // rasm (data URL / http)
    return (
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full" style={px}>
        <img src={avatar} alt={name} className="h-full w-full object-cover" loading="lazy" />
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ ...px, backgroundColor: isYou ? undefined : hueColor(hue) }}
    >
      {isYou ? "🙂" : name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function ZoneLabel({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 border-b border-line/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color }}
    >
      {icon}
      {text}
    </div>
  );
}

function PodiumSpot({
  entry,
  place,
  t,
}: {
  entry: { name: string; xp: number; isYou: boolean; hue: number; avatar?: string | null };
  place: 1 | 2 | 3;
  t: Record<string, string>;
}) {
  const h = place === 1 ? "h-20" : place === 2 ? "h-14" : "h-10";
  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  const w = place === 1 ? "w-[38%]" : "w-[31%]";

  return (
    <div className={`flex flex-col items-center ${w}`}>
      <span className="text-lg">{medal}</span>
      <AvatarBadge
        name={entry.name}
        hue={entry.hue}
        isYou={entry.isYou}
        avatar={entry.avatar}
        size={36}
        t={t}
      />
      <span className="mt-1 w-full truncate px-1 text-center text-xs font-semibold">
        {entry.isYou ? t.you : entry.name}
      </span>
      <span className="text-[11px] font-bold text-muted">{entry.xp}</span>
      <div
        className={`mt-1.5 w-full rounded-t-xl ${h}`}
        style={{
          background: `linear-gradient(to top, ${place === 1 ? "#F5C04E55" : place === 2 ? "#9AA5B155" : "#CD7F3255"}, transparent)`,
          borderBottom: `2px solid ${place === 1 ? "#F5C04E" : place === 2 ? "#9AA5B1" : "#CD7F32"}`,
        }}
      />
    </div>
  );
}
