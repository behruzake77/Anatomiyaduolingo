"use client";

/**
 * Haftalik reyting (liga) — foydalanuvchilar orasida raqobat.
 * Dushanbadan dushanbagacha: TOP-3 yuqoriga ko'tariladi, pastki 3 tushadi.
 * Raqiblar deterministik generatsiya qilinadi (utils/league.ts).
 */

import { useEffect, useMemo, useState } from "react";
import { Trophy, ArrowUp, ArrowDown, Minus, X } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
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
} from "@/utils/league";

export function LeaderboardScreen() {
  const t = useStrings();
  const xpHistory = useAppStore((s) => s.xpHistory);
  const currentUser = useAppStore((s) => s.currentUser);
  const leagueIndex = useAppStore((s) => s.leagueIndex);
  const leagueResult = useAppStore((s) => s.leagueResult);
  const dismiss = useAppStore((s) => s.dismissLeagueResult);

  const league = LEAGUES[Math.min(leagueIndex, LEAGUES.length - 1)];
  const weekKey = weekKeyOf(new Date());
  const myXp = useMemo(() => userWeekXp(xpHistory, weekKey), [xpHistory, weekKey]);
  const board = useMemo(
    () => boardFor(weekKey, leagueIndex, currentUser?.username ?? "", myXp),
    [weekKey, leagueIndex, currentUser, myXp],
  );
  const rank = userRank(board);

  // Hafta tugashiga qolgan vaqt (har daqiqa yangilanadi)
  const [left, setLeft] = useState(() => nextWeekEnd().getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(nextWeekEnd().getTime() - Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const days = Math.max(0, Math.floor(left / 86400000));
  const hours = Math.max(0, Math.floor((left % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((left % 3600000) / 60000));

  const showResult = leagueResult && leagueResult.weekKey === weekKey;

  return (
    <Screen padded={false}>
      <TopBar title={t.leaderboardTitle} />

      <div className="px-5 pb-28">
        {/* Liga sarlavhasi + taymer */}
        <div
          className="relative mt-1 overflow-hidden rounded-2xl border border-line p-4 shadow-card"
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

        {/* O'tgan hafta natijasi */}
        {showResult && (
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

        {/* Podium — TOP-3 */}
        <div className="mt-5 flex items-end justify-center gap-3">
          <PodiumSpot entry={board[1]} place={2} t={t} />
          <PodiumSpot entry={board[0]} place={1} t={t} />
          <PodiumSpot entry={board[2]} place={3} t={t} />
        </div>

        {/* To'liq jadval */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {board.map((e, i) => {
            const r = i + 1;
            const inPromo = r <= PROMOTE_SLOTS;
            const inDemo = r > board.length - DEMOTE_SLOTS;
            return (
              <div key={e.name + i}>
                {r === PROMOTE_SLOTS + 1 && (
                  <ZoneLabel icon={<ArrowUp className="h-3.5 w-3.5" aria-hidden />} text={t.promotionZone} color="#22c55e" />
                )}
                {r === board.length - DEMOTE_SLOTS && (
                  <ZoneLabel icon={<ArrowDown className="h-3.5 w-3.5" aria-hidden />} text={t.demotionZone} color="#ef4444" />
                )}
                <div
                  className={`flex items-center gap-3 border-b border-line/60 px-4 py-2.5 last:border-b-0 ${
                    e.isYou ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="w-6 shrink-0 text-center text-sm font-bold text-muted">
                    {r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r}
                  </span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: e.isYou ? undefined : hueColor(e.hue) }}
                  >
                    {e.isYou ? "🙂" : e.name[0]}
                  </span>
                  <span className={`min-w-0 flex-1 truncate text-sm ${e.isYou ? "font-bold" : "font-medium"}`}>
                    {e.isYou ? `${e.name} · ${t.you}` : e.name}
                  </span>
                  <span className={`shrink-0 text-sm font-bold ${e.isYou ? "text-primary" : "text-muted"}`}>
                    {e.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">{t.leagueHint}</p>
      </div>
    </Screen>
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
  entry: { name: string; xp: number; isYou: boolean; hue: number };
  place: 1 | 2 | 3;
  t: Record<string, string>;
}) {
  const h = place === 1 ? "h-20" : place === 2 ? "h-14" : "h-10";
  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  const w = place === 1 ? "w-[38%]" : "w-[31%]";

  return (
    <div className={`flex flex-col items-center ${w}`}>
      <span className="text-lg">{medal}</span>
      <span
        className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
          entry.isYou ? "bg-primary" : ""
        }`}
        style={{ backgroundColor: entry.isYou ? undefined : hueColor(entry.hue) }}
      >
        {entry.isYou ? "🙂" : entry.name[0]}
      </span>
      <span className="mt-1 w-full truncate px-1 text-center text-xs font-semibold">
        {entry.isYou ? t.you : entry.name}
      </span>
      <span className="text-[11px] font-bold text-muted">{entry.xp} XP</span>
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
