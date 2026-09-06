"use client";

/**
 * Dashboard pastidagi bannerlar:
 *  1) «Bo'limlar» — ilova bo'limlarini reklama qiluvchi, surib yuriladigan kartalar
 *     (Kutubxona, 3D modellar, Lug'at, Imtihon, Takrorlash, Yutuqlar).
 *  2) «Loyiha yangiliklari» — avto-aylanuvchi karussel (src/data/news.ts).
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useAppStore, type ScreenId } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import { NEWS } from "@/data/news";
import {
  LEAGUES,
  boardFor,
  userRank,
  userWeekXp,
  weekKeyOf,
} from "@/utils/league";

interface Promo {
  screen: ScreenId;
  icon: string;
  color: string;
  titleKey:
    | "library"
    | "models3d"
    | "glossaryTitle"
    | "examTitle"
    | "reviewTitle"
    | "achievements"
    | "leaderboardTitle"
    | "battleTitle"
    | "kahootTitle"
    | "feedbackTitle";
  textKey:
    | "librarySubtitle"
    | "promo3d"
    | "promoGlossary"
    | "promoExam"
    | "promoReview"
    | "promoAch"
    | "promoLeaderboard"
    | "promoBattle"
    | "promoKahoot"
    | "feedbackSubtitle";
}

/** Qaysi bo'lim bannerlarda reklama qilinadi (ranglar SYSTEMS palitrasidan). */
const PROMOS: Promo[] = [
  {
    screen: "feedback",
    icon: "/img/icon/feedback-illustration.png",
    color: "#F59E0B",
    titleKey: "feedbackTitle",
    textKey: "feedbackSubtitle",
  },
  {
    screen: "kahoot",
    icon: "/img/icon/kahoot.svg",
    color: "#46178F",
    titleKey: "kahootTitle",
    textKey: "promoKahoot",
  },
  {
    screen: "battle",
    icon: "/img/icon/battle-handshake.png",
    color: "#EF4444",
    titleKey: "battleTitle",
    textKey: "promoBattle",
  },
  {
    screen: "leaderboard",
    icon: "/img/icon/leaderboard-illustration.png",
    color: "#EC4899",
    titleKey: "leaderboardTitle",
    textKey: "promoLeaderboard",
  },
  {
    screen: "library",
    icon: "/img/icon/library-illustration.png",
    color: "#6C5CE7",
    titleKey: "library",
    textKey: "librarySubtitle",
  },
  {
    screen: "models3d",
    icon: "/img/icon/models3d-illustration.png",
    color: "#06b6d4",
    titleKey: "models3d",
    textKey: "promo3d",
  },
  {
    screen: "glossary",
    icon: "/img/icon/glossary-illustration.png",
    color: "#F59E0B",
    titleKey: "glossaryTitle",
    textKey: "promoGlossary",
  },
  {
    screen: "exam",
    icon: "/img/icon/exam-checklist.png",
    color: "#EF4444",
    titleKey: "examTitle",
    textKey: "promoExam",
  },
  {
    screen: "review",
    icon: "/img/icon/review-illustration.png",
    color: "#22C55E",
    titleKey: "reviewTitle",
    textKey: "promoReview",
  },
  {
    screen: "achievements",
    icon: "/img/icon/achievements-illustration.png",
    color: "#F5C04E",
    titleKey: "achievements",
    textKey: "promoAch",
  },
];

const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];
const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatNewsDate(iso: string, lang: "uz" | "en"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = lang === "en" ? MONTHS_EN : MONTHS_UZ;
  return lang === "en"
    ? `${months[m - 1]} ${d}, ${y}`
    : `${d}-${months[m - 1]}, ${y}`;
}

export function DashboardBanners() {
  const t = useStrings();

  return (
    <>
      {/* 0) Haftalik poyga — foydalanuvchining joriy o'rni */}
      <WeekRaceCard />
      <BattleCard />
      <KahootCard />

      {/* 1) Bo'limlar — surib yuriladigan banner kartalar */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t.bannersSectionsTitle}</h2>
        <div className="-mr-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PROMOS.map((p) => (
            <PromoCard key={p.screen} promo={p} />
          ))}
        </div>
      </section>

      {/* 2) Loyiha yangiliklari — avto-aylanuvchi karussel */}
      <section className="mt-6">
        <h2 className="flex items-center gap-1.5 text-lg font-semibold">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />{" "}
          {t.bannersNewsTitle}
        </h2>
        <NewsCarousel />
      </section>
    </>
  );
}

/** Bitta bo'lim banner kartasi (bosilganda o'sha bo'limga o'tadi). */
function PromoCard({ promo }: { promo: Promo }) {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);

  return (
    <button
      onClick={() => navigate(promo.screen)}
      className="group relative w-[190px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-transform duration-150 active:scale-[.97]"
      style={{
        backgroundImage: `linear-gradient(160deg, ${promo.color}26 0%, transparent 65%)`,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${promo.color}2e`, color: promo.color }}
      >
        <img
          src={promo.icon}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
      </div>
      <p className="mt-2.5 text-sm font-semibold leading-tight">
        {t[promo.titleKey]}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {t[promo.textKey]}
      </p>
      <span
        className="mt-2.5 inline-flex items-center gap-0.5 text-xs font-semibold"
        style={{ color: promo.color }}
      >
        {t.promoOpen}
        <ChevronRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </button>
  );
}

/** Yangiliklar karusseli — 5 soniyada avtomatik almashadi, chapga/o'ngga surib yuriladi. */
function NewsCarousel() {
  const t = useStrings();
  const lang = useAppStore((s) => s.settings.language);
  const navigate = useAppStore((s) => s.navigate);
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);

  const next = () => setIdx((i) => (i + 1) % NEWS.length);
  const prev = () => setIdx((i) => (i - 1 + NEWS.length) % NEWS.length);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % NEWS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const item = NEWS[idx];
  const loc = lang === "en" ? item.en : item.uz;

  return (
    <div
      className="relative mt-3 overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 48) prev();
        else if (dx < -48) next();
        touchX.current = null;
      }}
    >
      {/* rangli gradient fon */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/15 via-primary/10 to-success/15"
        animate={{ x: ["0%", "100%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ width: "200%" }}
      />

      <button
        onClick={() => navigate("info")}
        className="relative flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-xl">
          {item.icon}
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-semibold leading-tight">{loc.title}</p>
              <p className="mt-0.5 break-words text-xs leading-relaxed text-muted">
                {loc.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </button>

      {/* badge + sana */}
      <span className="absolute right-2 top-1.5 rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
        {t.newsBadge} · {formatNewsDate(item.date, lang)}
      </span>

      {/* nuqta indikatorlar */}
      <div className="absolute bottom-1.5 left-4 flex gap-1">
        {NEWS.map((_, i) => (
          <button
            key={i}
            aria-label={`${i + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Dashboard'dagi ixcham «Haftalik poyga» kartasi — joriy liga va o'rin. */
function WeekRaceCard() {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const xpHistory = useAppStore((s) => s.xpHistory);
  const currentUser = useAppStore((s) => s.currentUser);
  const leagueIndex = useAppStore((s) => s.leagueIndex);

  const weekKey = weekKeyOf(new Date());
  const myXp = userWeekXp(xpHistory, weekKey);
  const board = boardFor(
    weekKey,
    leagueIndex,
    currentUser?.username ?? "",
    myXp,
  );
  const rank = userRank(board);
  const league = LEAGUES[Math.min(leagueIndex, LEAGUES.length - 1)];

  return (
    <section className="mt-6">
      <button
        onClick={() => navigate("leaderboard")}
        className="flex w-full items-center gap-3 rounded-2xl border border-line p-4 text-left shadow-card transition-transform duration-150 active:scale-[.98]"
        style={{
          backgroundImage: `linear-gradient(120deg, ${league.color}30 0%, transparent 60%)`,
        }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/5 text-2xl">
          <img
            src="/img/icon/weekly-race-illustration.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">
            🏁 {t.weekRaceTitle}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {fmt(t.weekRaceRank, { league: t[league.key], n: rank })} · {myXp}{" "}
            XP
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </button>
    </section>
  );
}

function BattleCard() {
  const t = useStrings();
  const openBattle = useAppStore((s) => s.openBattle);
  const wins = useAppStore((s) => s.battlesWon);
  const losses = useAppStore((s) => s.battlesLost);

  return (
    <section className="mt-3">
      <button
        onClick={() => openBattle("all")}
        className="flex w-full items-center gap-3 rounded-2xl border border-line p-4 text-left shadow-card transition-transform duration-150 active:scale-[.98]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #EF444430 0%, transparent 60%)",
        }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
          <img
            src="/img/icon/battle-handshake.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">
            ⚔️ {t.battleTitle}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {t.promoBattle}
            {(wins > 0 || losses > 0) && ` · ${wins}–${losses}`}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </button>
    </section>
  );
}

function KahootCard() {
  const t = useStrings();
  const openKahoot = useAppStore((s) => s.openKahoot);

  return (
    <section className="mt-3">
      <button
        onClick={() => openKahoot("all")}
        className="flex w-full items-center gap-3 rounded-2xl border border-line p-4 text-left shadow-card transition-transform duration-150 active:scale-[.98]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #46178F40 0%, transparent 60%)",
        }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#46178F]/15 text-[#46178F]">
          <img
            src="/img/icon/kahoot.svg"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">
            🎯 {t.kahootTitle}
          </p>
          <p className="mt-0.5 text-xs text-muted">{t.promoKahoot}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </button>
    </section>
  );
}
