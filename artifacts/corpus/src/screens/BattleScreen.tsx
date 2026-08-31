"use client";

/**
 * 1ga-1 anatomiya bellashuvi.
 *  - Tezkor: onlayn navbat (Supabase realtime)
 *  - Kod: do'stni chaqirish
 *  - Mashq raqibi: internetsiz ham o'ynaladi
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Swords,
  Zap,
  Users,
  KeyRound,
  Bot,
  Copy,
  Check,
  X,
  Timer,
  Trophy,
  Crown,
} from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { useAppStore } from "@/store/useAppStore";
import { useHaptics } from "@/hooks/useHaptics";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import {
  BATTLE_Q_COUNT,
  BATTLE_SECONDS,
  battleScopeLabel,
  makeBattleSeed,
  pickBattleQuestions,
  rng,
  type PoolItem,
} from "@/utils/quizPool";
import { CONTENT_SYSTEMS } from "@/data/content";
import { ReportFlagButton } from "@/components/ReportQuestion";
import {
  avatarColor,
  battleXp,
  cancelBattle,
  claimOpenBattle,
  createBattle,
  getBattle,
  isOnlineArena,
  joinBattleByCode,
  opponentOf,
  pushMyBattleProgress,
  subscribeBattle,
  type BattleRow,
} from "@/lib/competition";

type Phase = "hub" | "matching" | "invite" | "join" | "play" | "wait" | "result";
type Outcome = "win" | "lose" | "draw";

const BOT_NAMES = ["Aziza", "Bekzod", "Dilnoza", "Sardor", "Nilufar", "Jasur", "Madina", "Sherzod"];

export function BattleScreen() {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const currentUser = useAppStore((s) => s.currentUser);
  const battlesWon = useAppStore((s) => s.battlesWon);
  const battlesLost = useAppStore((s) => s.battlesLost);
  const recordBattle = useAppStore((s) => s.recordBattle);
  const battleScope = useAppStore((s) => s.battleScope);
  const setBattleScope = useAppStore((s) => s.setBattleScope);
  const haptic = useHaptics();
  const topicName = battleScopeLabel(battleScope);

  const [phase, setPhase] = useState<Phase>("hub");
  const [vsBot, setVsBot] = useState(false);
  const [oppName, setOppName] = useState("Raqib");
  const [items, setItems] = useState<PoolItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [oppDone, setOppDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [left, setLeft] = useState(BATTLE_SECONDS);
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("draw");
  const [earned, setEarned] = useState(0);
  const [busy, setBusy] = useState(false);

  const battleRef = useRef<BattleRow | null>(null);
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recorded = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const stopBot = () => {
    if (botTimer.current) clearTimeout(botTimer.current);
    botTimer.current = null;
  };

  const resetPlay = () => {
    setIdx(0);
    setScore(0);
    setOppScore(0);
    setOppDone(false);
    setSelected(null);
    setRevealed(false);
    setLeft(BATTLE_SECONDS);
    recorded.current = false;
  };

  const startPlay = (seed: string, name: string, bot: boolean) => {
    stopBot();
    setItems(pickBattleQuestions(seed));
    setOppName(name);
    setVsBot(bot);
    resetPlay();
    setPhase("play");
    if (bot) runBot(seed);
  };

  const runBot = (seed: string) => {
    const r = rng(`${seed}:bot`);
    const name = BOT_NAMES[Math.floor(r() * BOT_NAMES.length)];
    setOppName(name);
    const n = Math.max(1, pickBattleQuestions(seed).length);
    let s = 0;
    let i = 0;
    const step = () => {
      const delay = 2200 + r() * 6500;
      botTimer.current = setTimeout(() => {
        if (r() < 0.6) s += 1;
        i += 1;
        setOppScore(s);
        if (i >= n) {
          setOppDone(true);
          return;
        }
        step();
      }, delay);
    };
    step();
  };

  useEffect(() => () => stopBot(), []);

  // 28 soniyada raqib chiqmasa — mashq raqibi bilan davom etamiz.
  useEffect(() => {
    if (phase !== "matching") return;
    const id = setTimeout(() => {
      const b = battleRef.current;
      battleRef.current = null;
      if (b) void cancelBattle(b.id);
      startPlay(makeBattleSeed(battleScope), "", true);
    }, 28_000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const goResult = useCallback(
    (my: number, their: number) => {
      const out: Outcome = my > their ? "win" : my < their ? "lose" : "draw";
      const xp = battleXp(out, my);
      setOutcome(out);
      setEarned(xp);
      setScore(my);
      setOppScore(their);
      setPhase("result");
      if (!recorded.current) {
        recorded.current = true;
        recordBattle(out, xp);
      }
    },
    [recordBattle],
  );

  // Online battle sync
  useEffect(() => {
    const id = battleRef.current?.id;
    if (!id || vsBot || !currentUser) return;
    let alive = true;
    const apply = (row: BattleRow) => {
      if (!alive) return;
      battleRef.current = row;
      const opp = opponentOf(row, currentUser.id);
      setOppName(opp.name);
      setOppScore(opp.score);
      setOppDone(opp.done);
      if (row.status === "active" && (phase === "matching" || phase === "invite")) {
        startPlay(row.seed, opp.name, false);
      }
      if (row.status === "cancelled" && (phase === "matching" || phase === "invite")) {
        setPhase("hub");
        battleRef.current = null;
      }
    };
    const pull = async () => {
      const row = await getBattle(id);
      if (row) apply(row);
    };
    void pull();
    const iv = setInterval(pull, 1600);
    const unsub = subscribeBattle(id, apply);
    return () => {
      alive = false;
      clearInterval(iv);
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, vsBot, currentUser]);

  // When I finished and opponent finished → result
  useEffect(() => {
    if (phase === "wait" && oppDone) goResult(scoreRef.current, oppScore);
  }, [phase, oppDone, oppScore, goResult]);

  const leaveQueue = async () => {
    const b = battleRef.current;
    if (b) await cancelBattle(b.id);
    battleRef.current = null;
    setPhase("hub");
  };

  const quickMatch = async () => {
    setError("");
    if (!currentUser || !isOnlineArena()) {
      startPlay(makeBattleSeed(battleScope), "", true);
      return;
    }
    setBusy(true);
    setPhase("matching");
    try {
      const claimed = await claimOpenBattle(currentUser, battleScope);
      if (claimed) {
        battleRef.current = claimed;
        startPlay(claimed.seed, claimed.host_name, false);
        return;
      }
      const created = await createBattle(currentUser, { scope: battleScope });
      if (!created) {
        startPlay(makeBattleSeed(battleScope), "", true);
        return;
      }
      battleRef.current = created;
    } finally {
      setBusy(false);
    }
  };

  const makeInvite = async () => {
    setError("");
    if (!currentUser || !isOnlineArena()) {
      setError(t.battleNeedLogin);
      return;
    }
    setBusy(true);
    const created = await createBattle(currentUser, { code: true, scope: battleScope });
    setBusy(false);
    if (!created?.code) {
      setError(t.battleNeedLogin);
      return;
    }
    battleRef.current = created;
    setCode(created.code);
    setPhase("invite");
  };

  const doJoin = async () => {
    setError("");
    if (!currentUser || !isOnlineArena()) {
      setError(t.battleNeedLogin);
      return;
    }
    setBusy(true);
    const joined = await joinBattleByCode(currentUser, joinCode);
    setBusy(false);
    if (!joined) {
      setError(t.battleBadCode);
      return;
    }
    battleRef.current = joined;
    startPlay(joined.seed, joined.host_name, false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };

  /* ---------- timer during play ---------- */
  useEffect(() => {
    if (phase !== "play" || revealed) return;
    setLeft(BATTLE_SECONDS);
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, idx, revealed]);

  useEffect(() => {
    if (phase === "play" && left === 0 && !revealed) {
      setRevealed(true);
      haptic([30, 40, 30]);
    }
  }, [left, phase, revealed, haptic]);

  const item = phase === "play" ? items[idx] : null;

  const lockIn = (i: number | null) => {
    if (revealed || !item) return;
    setSelected(i);
    setRevealed(true);
    const ok = i !== null && i === item.q.answer;
    if (ok) {
      setScore((s) => s + 1);
      haptic([40, 60, 90]);
    } else {
      haptic([50, 50]);
    }
  };

  const advance = async () => {
    const nextScore = score;
    const last = idx + 1 >= items.length;
    if (last) {
      if (!vsBot && battleRef.current && currentUser) {
        const row = await pushMyBattleProgress(battleRef.current, currentUser.id, { score: nextScore, done: true });
        if (row) {
          battleRef.current = row;
          const opp = opponentOf(row, currentUser.id);
          setOppScore(opp.score);
          setOppDone(opp.done);
          if (opp.done) {
            goResult(nextScore, opp.score);
            return;
          }
        }
      }
      if (vsBot && oppDone) {
        goResult(nextScore, oppScore);
        return;
      }
      setPhase("wait");
      return;
    }
    if (!vsBot && battleRef.current && currentUser) {
      const row = await pushMyBattleProgress(battleRef.current, currentUser.id, { score: nextScore, done: false });
      if (row) {
        battleRef.current = row;
        const opp = opponentOf(row, currentUser.id);
        setOppScore(opp.score);
        setOppDone(opp.done);
      }
    }
    setIdx((n) => n + 1);
    setSelected(null);
    setRevealed(false);
    setLeft(BATTLE_SECONDS);
  };

  useEffect(() => {
    if (phase !== "play" || !revealed) return;
    const id = setTimeout(() => void advance(), 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, phase]);

  /* ===================== HUB ===================== */
  if (phase === "hub") {
    return (
      <Screen className="pt-4">
        <header className="flex items-center gap-3">
          <button
            onClick={() => navigate("dashboard")}
            aria-label={t.backToTopics}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-xl font-semibold">{t.battleTitle}</h1>
        </header>

        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-primary/15 via-accent/10 to-success/10 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-pop">
              <Swords className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-tight">{t.battleTitle}</p>
              <p className="mt-0.5 text-sm text-muted">
                {topicName ? fmt(t.battleOnTopic, { name: topicName }) : t.battleSubtitle}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label={t.battleWins} value={String(battlesWon)} />
            <Stat label={t.battleLosses} value={String(battlesLost)} />
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">{t.battlePickTopic}</p>
        <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ScopeChip active={battleScope === "all"} label={t.battleScopeAll} onClick={() => setBattleScope("all")} />
          {CONTENT_SYSTEMS.map((s) => (
            <ScopeChip
              key={s.id}
              active={battleScope === `sys:${s.id}`}
              label={s.name}
              color={s.color}
              onClick={() => setBattleScope(`sys:${s.id}`)}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{t.battleTopicHint}</p>

        {!currentUser && (
          <p className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-ink">
            {t.battleNeedLogin}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <ModeCard
            icon={Zap}
            color="#6C5CE7"
            title={t.battleQuick}
            hint={t.battleQuickHint}
            onClick={() => void quickMatch()}
          />
          <ModeCard
            icon={Users}
            color="#EC4899"
            title={t.battleInvite}
            hint={t.battleInviteHint}
            onClick={() => void makeInvite()}
          />
          <ModeCard
            icon={KeyRound}
            color="#F59E0B"
            title={t.battleJoin}
            hint={t.battleJoinHint}
            onClick={() => {
              setError("");
              setJoinCode("");
              setPhase("join");
            }}
          />
          <ModeCard
            icon={Bot}
            color="#00B894"
            title={t.battleBot}
            hint={t.battleBotHint}
            onClick={() => startPlay(makeBattleSeed(battleScope), "", true)}
          />
        </div>
        {error && <p className="mt-3 text-center text-sm text-danger">{error}</p>}
      </Screen>
    );
  }

  /* ===================== MATCHING ===================== */
  if (phase === "matching") {
    return (
      <Screen className="pt-4">
        <header className="flex items-center gap-3">
          <button
            onClick={() => void leaveQueue()}
            aria-label={t.battleCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-xl font-semibold">{t.battleQuick}</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <motion.div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-pop"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Swords className="h-10 w-10" aria-hidden />
          </motion.div>
          <h2 className="text-2xl font-bold">{t.battleFind}</h2>
          <p className="max-w-xs text-sm text-muted">{t.battleFindHint}</p>
          <Button variant="ghost" onClick={() => void leaveQueue()}>
            {t.battleCancel}
          </Button>
          <button
            onClick={() => {
              const b = battleRef.current;
              battleRef.current = null;
              if (b) void cancelBattle(b.id);
              startPlay(makeBattleSeed(battleScope), "", true);
            }}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t.battleFillBot}
          </button>
        </div>
      </Screen>
    );
  }

  /* ===================== INVITE ===================== */
  if (phase === "invite") {
    return (
      <Screen className="pt-4">
        <header className="flex items-center gap-3">
          <button
            onClick={() => void leaveQueue()}
            aria-label={t.battleCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-xl font-semibold">{t.battleInvite}</h1>
        </header>
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">{t.battleYourCode}</p>
          <p className="mt-3 font-mono text-4xl font-extrabold tracking-[0.3em] text-primary">{code}</p>
          <Button className="mt-5" variant="secondary" onClick={() => void copyCode()}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? t.battleCopied : t.battleCopy}
          </Button>
          <p className="mt-6 max-w-xs text-sm text-muted">{t.battleWaitingFriend}</p>
          <motion.div
            className="mt-4 h-2 w-40 overflow-hidden rounded-full bg-line"
            initial={false}
          >
            <motion.div
              className="h-full bg-primary"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              style={{ width: "40%" }}
            />
          </motion.div>
        </div>
      </Screen>
    );
  }

  /* ===================== JOIN ===================== */
  if (phase === "join") {
    return (
      <Screen className="pt-4">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setPhase("hub")}
            aria-label={t.battleCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-xl font-semibold">{t.battleJoin}</h1>
        </header>
        <p className="mt-8 text-sm text-muted">{t.battleEnterCode}</p>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          maxLength={8}
          autoCapitalize="characters"
          className="mt-3 w-full rounded-2xl border-2 border-line bg-surface px-4 py-4 text-center font-mono text-2xl font-bold tracking-[0.35em] outline-none focus:border-primary"
          placeholder="ABC123"
        />
        {error && <p className="mt-3 text-center text-sm text-danger">{error}</p>}
        <Button className="mt-6 w-full" size="lg" loading={busy} onClick={() => void doJoin()}>
          {t.battleJoinCta}
        </Button>
      </Screen>
    );
  }

  /* ===================== WAIT ===================== */
  if (phase === "wait") {
    return (
      <Screen className="pt-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          >
            <Swords className="h-9 w-9" aria-hidden />
          </motion.div>
          <h2 className="text-xl font-bold">{t.battleWaitOpp}</h2>
          <VsBar me={score} them={oppScore} myName={t.you} oppName={oppName} />
        </div>
      </Screen>
    );
  }

  /* ===================== RESULT ===================== */
  if (phase === "result") {
    const title = outcome === "win" ? t.battleWin : outcome === "lose" ? t.battleLose : t.battleDraw;
    return (
      <Screen className="pt-4">
        {outcome === "win" && <Confetti />}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full",
              outcome === "win" ? "bg-success/15 text-success" : outcome === "lose" ? "bg-danger/15 text-danger" : "bg-primary/15 text-primary",
            )}
          >
            {outcome === "win" ? <Crown className="h-12 w-12" aria-hidden /> : <Trophy className="h-12 w-12" aria-hidden />}
          </div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <VsBar me={score} them={oppScore} myName={t.you} oppName={oppName} />
          <p className="text-lg font-bold text-primary">{fmt(t.battleXp, { n: earned })}</p>
          <div className="mt-4 flex w-full gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => navigate("dashboard")}>
              {t.battleHome}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                battleRef.current = null;
                setPhase("hub");
              }}
            >
              {t.battleAgain}
            </Button>
          </div>
        </div>
      </Screen>
    );
  }

  /* ===================== PLAY ===================== */
  if (!item) return null;
  const isLast = idx + 1 >= items.length;

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <button
          onClick={() => {
            stopBot();
            void leaveQueue();
            setPhase("hub");
          }}
          aria-label={t.battleCancel}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <VsBar me={score} them={oppScore} myName={t.you} oppName={oppName} compact />
        </div>
        <ReportFlagButton
          q={item.q}
          ctx={{
            lessonId: item.lessonId,
            lessonTitle: item.lessonTitle,
            prompt: item.q.prompt,
            qType: item.q.type,
            source: "battle",
            qIndex: idx,
          }}
        />
        <span className="flex items-center gap-1 rounded-full bg-surface2 px-2.5 py-1 text-xs font-semibold text-muted">
          <Timer className="h-3.5 w-3.5" aria-hidden /> {left}s
        </span>
      </header>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
        <motion.div
          className={cn("h-full rounded-full", left <= 4 ? "bg-danger" : "bg-primary")}
          animate={{ width: `${(left / BATTLE_SECONDS) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-muted">{fmt(t.battleRound, { n: idx + 1, total: items.length })}</p>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{item.lessonTitle}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{item.q.prompt}</h1>
      </div>

      {item.q.image && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <img src={item.q.image} alt="" className="mx-auto max-h-44 object-contain" />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {item.q.options?.map((opt, i) => {
          const isCorrect = revealed && i === item.q.answer;
          const isWrong = revealed && selected === i && i !== item.q.answer;
          return (
            <button
              key={i}
              onClick={() => lockIn(i)}
              disabled={revealed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-medium transition-colors",
                !revealed && "border-line active:border-primary",
                isCorrect && "border-success bg-success/10",
                isWrong && "border-danger bg-danger/10",
                revealed && !isCorrect && !isWrong && "border-line opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold",
                  isCorrect
                    ? "border-success bg-success text-white"
                    : isWrong
                      ? "border-danger bg-danger text-white"
                      : "border-line text-muted",
                )}
              >
                {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className="mt-auto pt-4 text-center text-xs text-muted">
          {isLast ? t.battleWaitOpp : t.next}…
        </p>
      )}
    </div>
  );
}

function ScopeChip({
  active,
  label,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink",
      )}
      style={active && color ? { backgroundColor: color, borderColor: color, color: "#fff" } : undefined}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/60 px-3 py-2 text-center dark:bg-black/20">
      <p className="text-lg font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted">{label}</p>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  color,
  title,
  hint,
  onClick,
}: {
  icon: typeof Swords;
  color: string;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-transform active:scale-[.98]"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{hint}</span>
      </span>
    </button>
  );
}

function VsBar({
  me,
  them,
  myName,
  oppName,
  compact,
}: {
  me: number;
  them: number;
  myName: string;
  oppName: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact ? "" : "w-full max-w-xs")}>
      <Face name={myName} score={me} mine />
      <span className="text-[10px] font-black tracking-widest text-muted">VS</span>
      <Face name={oppName} score={them} />
    </div>
  );
}

function Face({ name, score, mine }: { name: string; score: number; mine?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
          mine && "bg-primary",
        )}
        style={{ backgroundColor: mine ? undefined : avatarColor(name) }}
      >
        {(name || "?").slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold">{name}</span>
        <span className={cn("block text-sm font-extrabold leading-none", mine ? "text-primary" : "text-ink")}>
          {score}
        </span>
      </span>
    </div>
  );
}
