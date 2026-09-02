"use client";

/**
 * Kahoot-uslubidagi anatomiya viktorinasi.
 *  - Host PIN ochadi, o'yinchilar qo'shiladi
 *  - 10 savol · 20 soniya · tezlik balli
 *  - Mashq: 3 bot (internetsiz)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Gamepad2,
  Users,
  KeyRound,
  Bot,
  Copy,
  Check,
  X,
  Crown,
  Play,
  Pencil,
  SkipForward,
} from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { useAppStore } from "@/store/useAppStore";
import { useHaptics } from "@/hooks/useHaptics";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import {
  KAHOOT_Q_COUNT,
  KAHOOT_SECONDS,
  battleScopeLabel,
  makeBattleSeed,
  parseBattleSeed,
  pickKahootQuestions,
  collectChoiceQuestions,
  type PoolItem,
} from "@/utils/quizPool";
import { getQuiz, quizToPool, snapshotToPool } from "@/lib/userQuizzes";
import { CONTENT_SYSTEMS } from "@/data/content";
import { ReportFlagButton } from "@/components/ReportQuestion";
import { ReactionSticker } from "@/components/ReactionSticker";
import {
  KAHOOT_BOT_NAMES,
  KAHOOT_PALETTE,
  cancelKahoot,
  createKahootGame,
  isKahootOnline,
  joinKahootByPin,
  kahootPoints,
  kahootXp,
  leaveKahoot,
  listKahootPlayers,
  patchKahootGame,
  playerColor,
  sortKahootBoard,
  submitKahootAnswer,
  subscribeKahoot,
  type KahootGame,
  type KahootPlayer,
  type KahootStatus,
} from "@/lib/kahoot";

type Phase = "hub" | "join" | "lobby" | "play";

export function KahootScreen() {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const currentUser = useAppStore((s) => s.currentUser);
  const battleScope = useAppStore((s) => s.battleScope);
  const setBattleScope = useAppStore((s) => s.setBattleScope);
  const pendingQuiz = useAppStore((s) => s.pendingKahootQuiz);
  const setPendingQuiz = useAppStore((s) => s.setPendingKahootQuiz);
  const openQuizStudio = useAppStore((s) => s.openQuizStudio);
  const recordKahoot = useAppStore((s) => s.recordKahoot);
  const kahootName = useAppStore((s) => s.kahootName);
  const setKahootName = useAppStore((s) => s.setKahootName);
  const myAvatar = useAppStore((s) => s.avatar);
  const haptic = useHaptics();
  const { flies: flyStickers, throwSticker } = useStickers();
  const topicName = battleScopeLabel(battleScope);

  // Kahootdagi kimlik: maxsus ism (bo'sh bo'lsa — profil ismi) + profil avatar
  const myName = kahootName.trim() || currentUser?.username || t.you;
  const identity = { name: myName, avatar: myAvatar };
  const poolN = pendingQuiz?.questions.length ?? collectChoiceQuestions(battleScope).length;

  const [phase, setPhase] = useState<Phase>("hub");
  const [practice, setPractice] = useState(false);
  const [game, setGame] = useState<KahootGame | null>(null);
  const [players, setPlayers] = useState<KahootPlayer[]>([]);
  const [meId, setMeId] = useState<string>("");
  const [items, setItems] = useState<PoolItem[]>([]);
  const [pinInput, setPinInput] = useState("");
  const [joinHint, setJoinHint] = useState("");
  const [lateJoin, setLateJoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cd, setCd] = useState(3);
  const [left, setLeft] = useState(KAHOOT_SECONDS);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [earned, setEarned] = useState(0);
  const [myRank, setMyRank] = useState(0);

  const gameRef = useRef<KahootGame | null>(null);
  const playersRef = useRef<KahootPlayer[]>([]);
  const meIdRef = useRef("");
  const itemsRef = useRef<PoolItem[]>([]);
  const recorded = useRef(false);
  const qStart = useRef(0);
  gameRef.current = game;
  playersRef.current = players;
  meIdRef.current = meId;
  itemsRef.current = items;

  const me = players.find((p) => p.id === meId);
  const isHost = Boolean(game && currentUser && game.host_id === currentUser.id) || (practice && Boolean(game));
  // Jonli o'yinda host = BOSHQARUVCHI: savollarni yechmaydi, reytingga tushmaydi
  const isModerator = isHost && !practice && Boolean(game && game.id !== "local");
  const activePlayers =
    isModerator && game ? players.filter((p) => p.user_id !== game.host_id) : players;
  const status: KahootStatus = game?.status ?? "lobby";
  const qIndex = game?.q_index ?? 0;
  const item = items[qIndex] ?? null;
  const board = sortKahootBoard(activePlayers);

  const resetLocal = () => {
    setSelected(null);
    setLocked(false);
    setLeft(game?.q_seconds ?? KAHOOT_SECONDS);
  };

  const goHub = async () => {
    const g = gameRef.current;
    const mid = meIdRef.current;
    if (g && !practice && currentUser) {
      if (g.host_id === currentUser.id) void cancelKahoot(g.id);
      else if (mid) void leaveKahoot(mid);
    }
    gameRef.current = null;
    setGame(null);
    setPlayers([]);
    setMeId("");
    setPhase("hub");
    setPractice(false);
    setError("");
    setLateJoin(false);
    recorded.current = false;
  };

  const applyItems = (qs: PoolItem[]) => {
    setItems(qs);
    itemsRef.current = qs;
    return qs;
  };

  const loadItems = async (
    g: { seed: string; q_count: number; questions?: KahootGame["questions"] },
    fallbackQuiz = pendingQuiz,
  ) => {
    if (g.questions && g.questions.length >= 2) {
      return applyItems(snapshotToPool(fallbackQuiz?.title || t.quizStudio, g.questions));
    }
    if (fallbackQuiz && fallbackQuiz.questions.length >= 2) {
      return applyItems(quizToPool(fallbackQuiz));
    }
    const { scope } = parseBattleSeed(g.seed);
    if (scope.startsWith("quiz:")) {
      const quiz = await getQuiz(scope.slice(5));
      if (quiz && quiz.questions.length >= 2) return applyItems(quizToPool(quiz));
    }
    return applyItems(pickKahootQuestions(g.seed, g.q_count));
  };

  const startPractice = () => {
    setError("");
    const custom = pendingQuiz && pendingQuiz.questions.length >= 2 ? pendingQuiz : null;
    const seed = custom ? `quiz:${custom.id}::practice` : makeBattleSeed(battleScope);
    const qs = custom
      ? quizToPool(custom)
      : pickKahootQuestions(seed, KAHOOT_Q_COUNT);
    applyItems(qs);
    const host: KahootPlayer = {
      id: "me",
      game_id: "local",
      user_id: currentUser?.id ?? "local",
      name: myName,
      score: 0,
      streak: 0,
      answers: [],
      is_bot: false,
      joined_at: new Date().toISOString(),
      avatar: myAvatar,
    };
    const bots: KahootPlayer[] = KAHOOT_BOT_NAMES.slice(0, 3).map((name, i) => ({
      id: `bot-${i}`,
      game_id: "local",
      user_id: null,
      name,
      score: 0,
      streak: 0,
      answers: [],
      is_bot: true,
      joined_at: new Date().toISOString(),
      avatar: null,
    }));
    const g: KahootGame = {
      id: "local",
      pin: "------",
      host_id: host.user_id || "local",
      host_name: myName,
      seed,
      q_count: qs.length,
      q_seconds: KAHOOT_SECONDS,
      status: "lobby",
      q_index: 0,
      q_started_at: null,
      created_at: new Date().toISOString(),
      quiz_id: custom?.id ?? null,
      questions: custom?.questions ?? null,
    };
    setPractice(true);
    setGame(g);
    setPlayers([host, ...bots]);
    setMeId(host.id);
    recorded.current = false;
    setPhase("lobby");
  };

  const hostLive = async () => {
    setError("");
    if (!currentUser) {
      setError(t.kahootNeedLogin);
      return;
    }
    if (!isKahootOnline()) {
      setError(t.kahootOfflineHost);
      return;
    }
    setBusy(true);
    const created = await createKahootGame(currentUser, battleScope, pendingQuiz, identity);
    setBusy(false);
    if (!created) {
      setError(t.kahootHostFail);
      return;
    }
    setPractice(false);
    setGame(created.game);
    setMeId(created.me.id);
    await loadItems(created.game, pendingQuiz);
    setPlayers([created.me]);
    recorded.current = false;
    setPhase("lobby");
  };

  const doJoin = async (rawPin = pinInput) => {
    setError("");
    setJoinHint("");
    if (!currentUser || !isKahootOnline()) {
      setError(t.kahootNeedLogin);
      return;
    }
    setBusy(true);
    const joined = await joinKahootByPin(currentUser, rawPin, identity);
    setBusy(false);
    if (!joined.ok) {
      // Xona topilmadi — faqat haqiqiy mavjud xonalarga kiriladi
      setError(joined.reason === "full" ? t.kahootFull : t.kahootNoRoom);
      setJoinHint(joined.reason === "full" ? "" : t.kahootNoRoomHint);
      return;
    }
    setPractice(false);
    setGame(joined.game);
    setMeId(joined.me.id);
    await loadItems(joined.game);
    const list = await listKahootPlayers(joined.game.id);
    setPlayers(list.length ? list : [joined.me]);
    recorded.current = false;
    if (joined.inProgress) {
      // O'yin allaqachon boshlangan — o'yin oqimiga to'g'ridan-to'g'ri tushamiz
      setLateJoin(true);
      setPhase("play");
    } else {
      setPhase("lobby");
    }
  };

  const patch = useCallback(async (next: Partial<KahootGame>) => {
    const g = gameRef.current;
    if (!g) return;
    const merged = { ...g, ...next };
    gameRef.current = merged;
    setGame(merged);
    if (practice || g.id === "local") return;
    const saved = await patchKahootGame(g.id, next);
    if (saved) {
      gameRef.current = saved;
      setGame(saved);
    }
  }, [practice]);

  const beginPlay = () => {
    resetLocal();
    setPhase("play");
    void patch({ status: "countdown", q_index: 0, q_started_at: null });
  };

  // Live sync
  useEffect(() => {
    const g = game;
    if (!g || practice || g.id === "local") return;
    const pull = async () => {
      const list = await listKahootPlayers(g.id);
      if (list.length) setPlayers(list);
    };
    void pull();
    const iv = setInterval(pull, 1400);
    const unsub = subscribeKahoot(
      g.id,
      (row) => {
        gameRef.current = row;
        setGame(row);
        if (row.status === "cancelled") {
          setPhase("hub");
          setGame(null);
        }
      },
      setPlayers,
    );
    return () => {
      clearInterval(iv);
      unsub();
    };
  }, [game?.id, practice]);

  // Joriy savolga javob bergan o'yinchilar soni (host-moderator hisobga olinmaydi)
  const answeredN = activePlayers.filter((p) => p.answers.some((a) => a.i === qIndex)).length;
  const allAnswered = activePlayers.length > 0 && answeredN >= activePlayers.length;

  // Host auto-advance
  useEffect(() => {
    if (phase !== "play" || !isHost) return;
    const g = gameRef.current;
    if (!g) return;
    if (status === "countdown") {
      const id = setTimeout(() => {
        if (gameRef.current?.status !== "countdown") return;
        void patch({ status: "question", q_started_at: new Date().toISOString() });
      }, 3200);
      return () => clearTimeout(id);
    }
    if (status === "question") {
      // Vaqt tugasa yoki HAMMA javob bersa — keyingiga o'tamiz
      const fullMs = (g.q_seconds + 0.4) * 1000;
      const delay = allAnswered ? 900 : fullMs;
      const id = setTimeout(() => {
        if (gameRef.current?.status !== "question") return;
        void patch({ status: "reveal" });
      }, delay);
      return () => clearTimeout(id);
    }
    if (status === "reveal") {
      const id = setTimeout(() => {
        if (gameRef.current?.status !== "reveal") return;
        void patch({ status: "scoreboard" });
      }, 4200);
      return () => clearTimeout(id);
    }
    if (status === "scoreboard") {
      const id = setTimeout(() => {
        const cur = gameRef.current;
        if (!cur || cur.status !== "scoreboard") return;
        const last = qIndex + 1 >= (cur.q_count || itemsRef.current.length);
        if (last) void patch({ status: "podium" });
        else void patch({ status: "countdown", q_index: qIndex + 1, q_started_at: null });
      }, 5200);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [phase, isHost, status, qIndex, allAnswered, patch]);

  // Countdown number
  useEffect(() => {
    if (status !== "countdown") return;
    setCd(3);
    const iv = setInterval(() => setCd((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(iv);
  }, [status, qIndex]);

  // Question timer
  useEffect(() => {
    if (status !== "question") return;
    setSelected(null);
    setLocked(false);
    const started = game?.q_started_at ? Date.parse(game.q_started_at) : Date.now();
    qStart.current = started;
    const limit = game?.q_seconds ?? KAHOOT_SECONDS;
    const tick = () => {
      const elapsed = (Date.now() - started) / 1000;
      setLeft(Math.max(0, limit - elapsed));
    };
    tick();
    const iv = setInterval(tick, 150);
    return () => clearInterval(iv);
  }, [status, game?.q_started_at, game?.q_seconds, qIndex]);

  // Follow live status into play
  useEffect(() => {
    if (!game) return;
    if (game.status === "lobby") {
      if (phase === "play") setPhase("lobby");
      return;
    }
    if (game.status === "cancelled") return;
    if (phase !== "play") setPhase("play");
  }, [game?.status, phase, game]);

  // Practice bots
  useEffect(() => {
    if (!practice || status !== "question") return;
    const q = itemsRef.current[qIndex];
    if (!q?.q.options || q.q.answer == null) return;
    const limit = (game?.q_seconds ?? KAHOOT_SECONDS) * 1000;
    const timers = playersRef.current.filter((p) => p.is_bot).map((bot) => {
      const delay = 1600 + Math.random() * Math.min(9000, limit * 0.7);
      return window.setTimeout(() => {
        const ok = Math.random() < 0.64;
        let choice = q.q.answer ?? 0;
        if (!ok) {
          const wrong = q.q.options!.map((_, i) => i).filter((i) => i !== q.q.answer);
          choice = wrong[Math.floor(Math.random() * Math.max(1, wrong.length))] ?? 0;
        }
        const { pts, nextStreak } = kahootPoints(ok, delay, limit, bot.streak);
        setPlayers((cur) =>
          cur.map((p) =>
            p.id !== bot.id || p.answers.some((a) => a.i === qIndex)
              ? p
              : {
                  ...p,
                  score: p.score + pts,
                  streak: nextStreak,
                  answers: [...p.answers, { i: qIndex, choice, ms: delay, correct: ok, pts }],
                },
          ),
        );
      }, delay);
    });
    return () => timers.forEach((id) => clearTimeout(id));
  }, [practice, status, qIndex, game?.q_seconds]);

  // Award XP once on podium (host-moderator XP olmaydi — u yechmagan)
  useEffect(() => {
    if (status !== "podium" || recorded.current) return;
    const g = gameRef.current;
    // Jonli o'yinda host-moderator reytingga tushmaydi
    const active =
      g && !practice && g.id !== "local"
        ? playersRef.current.filter((p) => p.user_id !== g.host_id)
        : playersRef.current;
    const ranked = sortKahootBoard(active);
    const idx = ranked.findIndex((p) => p.id === meIdRef.current);
    if (idx < 0) return;
    recorded.current = true;
    const xp = kahootXp(idx + 1, ranked[idx].score);
    setMyRank(idx + 1);
    setEarned(xp);
    recordKahoot(xp);
  }, [status, recordKahoot]);

  const lockIn = async (choice: number) => {
    if (locked || status !== "question" || !item || item.q.answer == null) return;
    const ms = Date.now() - qStart.current;
    const ok = choice === item.q.answer;
    const mine = playersRef.current.find((p) => p.id === meIdRef.current);
    const { pts, nextStreak } = kahootPoints(ok, ms, (game?.q_seconds ?? KAHOOT_SECONDS) * 1000, mine?.streak ?? 0);
    setSelected(choice);
    setLocked(true);
    haptic(ok ? [40, 50, 80] : [50, 40]);
    const ans = { i: qIndex, choice, ms, correct: ok, pts };
    if (!mine || mine.answers.some((a) => a.i === qIndex)) return;
    if (practice || mine.game_id === "local" || !isKahootOnline()) {
      setPlayers((cur) =>
        cur.map((p) =>
          p.id === mine.id
            ? {
                ...p,
                score: p.score + pts,
                streak: nextStreak,
                answers: [...p.answers.filter((a) => a.i !== qIndex), ans],
              }
            : p,
        ),
      );
      return;
    }
    const next = await submitKahootAnswer(mine, ans);
    if (next) {
      setPlayers((cur) => cur.map((p) => (p.id === next.id ? next : p)));
      setMeId(next.id);
    }
  };

  const copyPin = async () => {
    if (!game?.pin) return;
    try {
      await navigator.clipboard.writeText(game.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* no-op */
    }
  };

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
          <h1 className="text-xl font-semibold">{t.kahootTitle}</h1>
        </header>

        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#46178F] via-[#6C5CE7] to-[#E21B3C] p-5 text-white shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Gamepad2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-tight">{t.kahootTitle}</p>
              <p className="mt-0.5 text-sm text-white/80">
                {topicName ? fmt(t.kahootOnTopic, { name: topicName }) : t.kahootSubtitle}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/75">{t.kahootHow}</p>
        </div>

        {pendingQuiz ? (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.kahootCustom}</p>
            <p className="mt-1 text-sm font-semibold">{pendingQuiz.title}</p>
            <p className="mt-0.5 text-xs text-muted">{fmt(t.quizN, { n: pendingQuiz.questions.length })}</p>
            <button type="button" className="mt-2 text-xs font-semibold text-primary" onClick={() => setPendingQuiz(null)}>
              {t.battleScopeAll}
            </button>
          </div>
        ) : (
          <>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">{t.battlePickTopic}</p>
            <KahootScopePicker
              battleScope={battleScope}
              onPick={(scope) => {
                setPendingQuiz(null);
                setBattleScope(scope);
              }}
              allLabel={t.battleScopeAll}
              partsLabel={t.kahootParts}
            />
          </>
        )}

        <div className="mt-4 rounded-2xl border border-line bg-surface p-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="kahoot-name">
            {t.kahootNickname}
          </label>
          <input
            id="kahoot-name"
            value={kahootName}
            onChange={(e) => setKahootName(e.target.value)}
            maxLength={20}
            placeholder={currentUser?.username || t.name}
            className="mt-2 w-full rounded-xl border-2 border-line bg-bg px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
          />
          <p className="mt-1.5 text-[11px] text-muted">{t.kahootNicknameHint}</p>
        </div>

        {!currentUser && (
          <p className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-ink">
            {t.kahootNeedLogin}
          </p>
        )}

        <p className="mt-3 text-center text-xs font-semibold text-muted">{fmt(t.kahootQsReady, { n: poolN })}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ModeCard
            icon={Users}
            color="#46178F"
            title={t.kahootHost}
            hint={t.kahootHostHint}
            disabled={busy}
            onClick={() => void hostLive()}
          />
          <ModeCard
            icon={KeyRound}
            color="#1368CE"
            title={t.kahootJoin}
            hint={t.kahootJoinHint}
            disabled={busy}
            onClick={() => {
              setError("");
              setPinInput("");
              setPhase("join");
            }}
          />
          <ModeCard
            icon={Bot}
            color="#26890C"
            title={t.kahootPractice}
            hint={t.kahootPracticeHint}
            disabled={busy}
            onClick={startPractice}
          />
          <ModeCard
            icon={Pencil}
            color="#D89E00"
            title={t.kahootMakeQuiz}
            hint={t.kahootMakeQuizHint}
            disabled={busy}
            onClick={() => openQuizStudio()}
          />
        </div>
        {error && <p className="mt-3 text-center text-sm font-semibold text-danger">{error}</p>}
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
          <h1 className="text-xl font-semibold">{t.kahootJoin}</h1>
        </header>
        <p className="mt-8 text-sm text-muted">{t.kahootEnterPin}</p>
        <input
          value={pinInput}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPinInput(v);
            if (v.length === 6) setTimeout(() => void doJoin(), 0);
          }}
          inputMode="numeric"
          maxLength={6}
          autoFocus
          className="mt-3 w-full rounded-2xl border-2 border-line bg-surface px-4 py-5 text-center font-mono text-4xl font-extrabold tracking-[0.35em] outline-none focus:border-[#1368CE]"
          placeholder="••••••"
        />
        {error && (
          <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-center">
            <p className="text-sm font-bold text-danger">{error}</p>
            {joinHint && <p className="mt-1 text-xs text-muted">{joinHint}</p>}
          </div>
        )}
        <Button className="mt-6 w-full" size="lg" loading={busy} disabled={pinInput.length < 6} onClick={() => void doJoin()}>
          {t.kahootJoinCta}
        </Button>
      </Screen>
    );
  }

  /* ===================== LOBBY ===================== */
  if (phase === "lobby" && game) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Screen className="pt-4">
          <header className="flex items-center gap-3">
            <button
              onClick={() => void goHub()}
              aria-label={t.battleCancel}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <h1 className="text-xl font-semibold">{t.kahootLobby}</h1>
          </header>

          <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#46178F] via-[#5A2AA8] to-[#6C5CE7] p-6 text-center text-white shadow-pop">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">{t.kahootPin}</p>
            <p className="mt-2 font-mono text-6xl font-black tracking-[0.18em]">{practice ? "BOT" : game.pin}</p>
            {!practice && (
              <Button className="mt-4" variant="secondary" onClick={() => void copyPin()}>
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? t.battleCopied : t.battleCopy}
              </Button>
            )}
            <p className="mt-3 text-sm text-white/80">
              {pendingQuiz
                ? pendingQuiz.title
                : topicName
                  ? fmt(t.kahootOnTopic, { name: topicName })
                  : t.kahootSubtitle}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t.kahootInRoom} · {fmt(t.kahootPlayers, { n: players.length })}
            </p>
          </div>
          <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {players.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5",
                  p.id === meId && "border-primary bg-primary/5",
                )}
              >
                <PlayerAvatar player={p} size={36} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {p.id === meId ? t.kahootYou : p.name}
                </span>
                {game.host_id === p.user_id && (
                  <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {t.kahootHostBadge}
                  </span>
                )}
                {p.is_bot && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase text-muted">{t.battlePractice}</span>
                )}
              </div>
            ))}
            {players.length === 1 && (
              <p className="col-span-2 rounded-2xl border border-dashed border-line px-3 py-4 text-center text-xs text-muted">
                {t.kahootWaitingPlayers}
              </p>
            )}
          </div>

          <StickerBar />

          {isHost ? (
            <Button className="mt-5 w-full" size="lg" onClick={beginPlay} loading={busy} disabled={busy}>
              <Play className="h-5 w-5" aria-hidden /> {t.kahootStartGame}
            </Button>
          ) : (
            <p className="mt-6 text-center text-sm font-semibold text-muted">{t.kahootWaitingHost}</p>
          )}
        </Screen>
      </div>
    );
  }

  /* ===================== PLAY ===================== */
  const playBg =
    status === "podium"
      ? "bg-gradient-to-b from-[#46178F] to-[#2A0D5C]"
      : status === "scoreboard" || status === "reveal"
        ? "bg-[#2A0D5C]"
        : "bg-[#46178F]";

  const myAns = me?.answers.find((a) => a.i === qIndex);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto text-white", playBg)}>
      <header className="flex items-center gap-3 px-5 pt-4">
        <button
          onClick={() => void goHub()}
          aria-label={t.battleCancel}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">
          {status === "podium" ? t.kahootPodium : fmt(t.kahootQuestionOf, { n: qIndex + 1, total: items.length || game?.q_count || KAHOOT_Q_COUNT })}
        </p>
        {item && (status === "question" || status === "reveal") && (
          <ReportFlagButton
            q={item.q}
            ctx={{
              lessonId: item.lessonId,
              lessonTitle: item.lessonTitle,
              prompt: item.q.prompt,
              qType: item.q.type,
              source: "kahoot",
              qIndex,
            }}
            className="border-white/35 text-white hover:border-white hover:text-white"
          />
        )}
        {status === "question" && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-black">{Math.ceil(left)}</span>
        )}
      </header>

      {lateJoin && (status === "countdown" || status === "question") && (
        <div className="mx-5 mt-3 rounded-2xl bg-white/20 px-4 py-2.5 text-center text-sm font-bold backdrop-blur">
          {t.kahootJoinedInProgress}
        </div>
      )}

      {status === "countdown" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">{t.kahootGetReady}</p>
          {item && <h2 className="max-w-sm text-xl font-bold leading-snug">{item.q.prompt}</h2>}
          {item?.q.image && (
            <img src={item.q.image} alt="" className="max-h-28 rounded-xl object-contain" />
          )}
          <motion.p
            key={cd}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-black"
          >
            {cd > 0 ? cd : "!"}
          </motion.p>
        </div>
      )}

      {status === "question" && item && (
        <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-[#F5C04E]"
              animate={{ width: `${(left / (game?.q_seconds ?? KAHOOT_SECONDS)) * 100}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/70">{item.lessonTitle}</p>
          <h1 className="mt-2 text-xl font-bold leading-snug">{item.q.prompt}</h1>
          {item.q.image && (
            <div className="mt-3 overflow-hidden rounded-2xl bg-white">
              <img src={item.q.image} alt="" className="mx-auto max-h-40 object-contain" />
            </div>
          )}
          {!isModerator && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                  allAnswered ? "bg-[#26890C] text-white" : "bg-white/15 text-white/85",
                )}
              >
                <Users className="h-3.5 w-3.5" aria-hidden />
                {fmt(t.kahootAnsweredCount, { a: answeredN, b: activePlayers.length })}
                {allAnswered && <Check className="h-3.5 w-3.5" aria-hidden />}
              </span>
              {isHost && (
                <button
                  type="button"
                  onClick={() => {
                    if (gameRef.current?.status !== "question") return;
                    void patch({ status: "reveal" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-bold text-white active:scale-95"
                >
                  <SkipForward className="h-3.5 w-3.5" aria-hidden /> {t.kahootSkip}
                </button>
              )}
            </div>
          )}
          {isModerator ? (
            <div className="mt-auto flex flex-1 flex-col items-center justify-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
                <Crown className="h-8 w-8 text-[#F5C04E]" aria-hidden />
              </span>
              <p className="text-lg font-black">{t.kahootHostMode}</p>
              <p className="max-w-xs text-center text-sm text-white/70">{t.kahootHostWatching}</p>
              <p className="mt-1 text-sm font-bold text-white/90">
                {allAnswered
                  ? t.kahootAllAnswered
                  : fmt(t.kahootAnsweredCount, { a: answeredN, b: activePlayers.length })}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (gameRef.current?.status !== "question") return;
                  void patch({ status: "reveal" });
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#46178F] active:scale-95"
              >
                <SkipForward className="h-4 w-4" aria-hidden /> {t.kahootSkip}
              </button>
            </div>
          ) : locked ? (
            <div className="mt-auto flex flex-1 flex-col items-center justify-center gap-2">
              <Check className="h-16 w-16" aria-hidden />
              <p className="text-lg font-bold">{t.kahootAnswered}</p>
              <p className="text-sm text-white/70">
                {fmt(t.kahootAnsweredCount, { a: answeredN, b: activePlayers.length })}
              </p>
            </div>
          ) : (
            <KahootOptionsGrid
              options={item.q.options ?? []}
              optionImages={item.q.optionImages}
              onPick={(i) => void lockIn(i)}
              disabled={locked}
              tapLabel={t.kahootTapAnswer}
            />
          )}
        </div>
      )}

      {status === "reveal" && item && (
        <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
          <h2 className="text-lg font-bold leading-snug">{item.q.prompt}</h2>
          {item.q.image && (
            <div className="mt-2 overflow-hidden rounded-2xl bg-white">
              <img src={item.q.image} alt="" className="mx-auto max-h-28 object-contain" />
            </div>
          )}
          <KahootOptionsGrid
            options={item.q.options ?? []}
            optionImages={item.q.optionImages}
            mode="reveal"
            answer={item.q.answer}
            myChoice={selected ?? myAns?.choice ?? null}
          />
          <div className="mt-auto flex flex-col items-center pt-5 text-center">
            {isModerator ? (
              <p className="max-w-xs text-sm font-bold text-white/70">{t.kahootHostWatching}</p>
            ) : (
              <>
                <ReactionSticker
                  ok={Boolean(myAns?.correct || selected === item.q.answer)}
                  seed={`${game?.id ?? "k"}-${qIndex}`}
                  size="lg"
                  label={myAns?.correct || selected === item.q.answer ? t.kahootCorrect : t.kahootWrong}
                />
                {myAns?.correct || selected === item.q.answer ? (
                  <p className="mt-1 text-2xl font-black text-[#7CFC98]">{t.kahootCorrect}</p>
                ) : (
                  <p className="mt-1 text-2xl font-black text-[#FF8A8A]">{t.kahootWrong}</p>
                )}
                <p className="mt-1 text-lg font-bold">
                  {fmt(t.kahootPts, { n: myAns?.pts ?? 0 })}
                  {(me?.streak ?? 0) >= 2 && ` · ${fmt(t.kahootStreakN, { n: me?.streak ?? 0 })}`}
                </p>
              </>
            )}
            <p className="mt-1 rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white/90">
              {fmt(t.kahootCorrectAns, { n: String.fromCharCode(65 + (item.q.answer ?? 0)) })}
            </p>
          </div>
        </div>
      )}

      {status === "scoreboard" && (
        <div className="flex flex-1 flex-col px-5 pb-6 pt-3">
          <h2 className="text-center text-xl font-black">{t.kahootBoard}</h2>
          <div className="mt-4 flex flex-col gap-2">
            {board.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5",
                  p.id === meId && "bg-white text-[#46178F]",
                )}
              >
                <span className="w-6 text-center text-sm font-black">{i + 1}</span>
                <span className="h-8 w-8 rounded-full text-center text-sm font-bold leading-8 text-white" style={{ backgroundColor: playerColor(p.name) }}>
                  {p.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                <span className="font-black">{p.score}</span>
              </div>
            ))}
          </div>
          {isHost && (
            <Button
              className="mt-auto w-full bg-white !text-[#46178F] hover:bg-white/90"
              onClick={() => {
                if (gameRef.current?.status !== "scoreboard") return;
                const last = qIndex + 1 >= (game?.q_count || items.length);
                if (last) void patch({ status: "podium" });
                else void patch({ status: "countdown", q_index: qIndex + 1, q_started_at: null });
              }}
            >
              {t.kahootNext}
            </Button>
          )}
        </div>
      )}

      {status === "podium" && (
        <div className="relative flex flex-1 flex-col items-center px-5 pb-8 pt-4">
          {myRank > 0 && myRank <= 3 && <Confetti />}
          <Crown className="h-10 w-10 text-[#F5C04E]" aria-hidden />
          <h1 className="mt-2 text-3xl font-black">{t.kahootTop5}</h1>
          <div className="mt-5 flex w-full flex-col gap-2">
            {board.slice(0, 5).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 32, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.18, type: "spring", stiffness: 240, damping: 18 }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 shadow-lg",
                  i === 0
                    ? "bg-gradient-to-r from-[#F5C04E] to-[#E0A030] text-[#3A2A00]"
                    : i % 2 === 0
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white",
                  p.id === meId && "ring-2 ring-white",
                )}
              >
                <span className="w-8 shrink-0 text-center text-xl font-black">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <PlayerAvatar player={p} size={38} />
                <span className="min-w-0 flex-1 truncate text-base font-bold">
                  {p.id === meId ? t.you : p.name}
                </span>
                <span className="text-lg font-black">{p.score}</span>
              </motion.div>
            ))}
            {board.length === 0 && (
              <p className="py-6 text-center text-sm text-white/70">{t.kahootNoPlayers}</p>
            )}
          </div>
          <div className="mt-6 flex flex-col items-center gap-1">
            {isModerator ? (
              <p className="text-lg font-bold">{t.kahootPodiumHost}</p>
            ) : (
              <p className="text-lg font-bold">
                {fmt(t.kahootRank, { n: myRank || Math.max(0, board.findIndex((p) => p.id === meId) + 1) })}
              </p>
            )}
            {myRank > 0 && <p className="text-sm text-white/80">{fmt(t.battleXp, { n: earned })}</p>}
          </div>
          <div className="mt-5 flex w-full gap-3">
            <Button variant="ghost" className="flex-1 bg-white/15 text-white hover:bg-white/25" onClick={() => navigate("dashboard")}>
              {t.battleHome}
            </Button>
            <Button
              className="flex-1 bg-white !text-[#46178F] hover:bg-white/90"
              onClick={() => {
                void goHub();
              }}
            >
              {t.battleAgain}
            </Button>
          </div>
        </div>
      )}

      {/* Stiker tashlash — o'yin davomida */}
      {(status === "countdown" || status === "question" || status === "reveal") && (
        <div className="border-t border-white/15 bg-black/10 px-3 py-2">
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STICKERS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => void throwSticker(e)}
                aria-label={`Stiker: ${e}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl transition active:scale-90"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      <StickerLayer items={flyStickers} />
    </div>
  );
}

function KahootScopePicker({
  battleScope,
  onPick,
  allLabel,
  partsLabel,
}: {
  battleScope: string;
  onPick: (scope: string) => void;
  allLabel: string;
  partsLabel: string;
}) {
  const selectedSys = (() => {
    if (battleScope.startsWith("sys:")) return CONTENT_SYSTEMS.find((s) => s.id === battleScope.slice(4));
    if (battleScope.startsWith("unit:")) {
      const id = battleScope.slice(5);
      return CONTENT_SYSTEMS.find((s) => s.units.some((u) => u.id === id));
    }
    if (battleScope.startsWith("lesson:")) {
      const id = battleScope.slice(7);
      return CONTENT_SYSTEMS.find((s) => s.units.some((u) => u.lessons.some((l) => l.id === id)));
    }
    return undefined;
  })();
  const selectedUnit = (() => {
    if (!selectedSys) return undefined;
    if (battleScope.startsWith("unit:")) return selectedSys.units.find((u) => u.id === battleScope.slice(5));
    if (battleScope.startsWith("lesson:")) {
      const id = battleScope.slice(7);
      return selectedSys.units.find((u) => u.lessons.some((l) => l.id === id));
    }
    return undefined;
  })();

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={battleScope === "all"} label={allLabel} onClick={() => onPick("all")} />
        {CONTENT_SYSTEMS.map((s) => (
          <Chip
            key={s.id}
            active={selectedSys?.id === s.id}
            label={s.name}
            color={s.color}
            onClick={() => onPick(`sys:${s.id}`)}
          />
        ))}
      </div>
      {selectedSys && selectedSys.units.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{partsLabel}</p>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip
              active={battleScope === `sys:${selectedSys.id}`}
              label={selectedSys.name}
              color={selectedSys.color}
              onClick={() => onPick(`sys:${selectedSys.id}`)}
            />
            {selectedSys.units.map((u) => (
              <Chip
                key={u.id}
                active={selectedUnit?.id === u.id}
                label={u.title}
                onClick={() => onPick(`unit:${u.id}`)}
              />
            ))}
          </div>
        </>
      )}
      {selectedUnit && selectedUnit.lessons.length > 1 && (
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip
            active={battleScope === `unit:${selectedUnit.id}`}
            label={selectedUnit.title}
            onClick={() => onPick(`unit:${selectedUnit.id}`)}
          />
          {selectedUnit.lessons.map((l) => (
            <Chip
              key={l.id}
              active={battleScope === `lesson:${l.id}`}
              label={l.title}
              onClick={() => onPick(`lesson:${l.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
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
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
        active ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink",
      )}
      style={active && color ? { backgroundColor: color, borderColor: color, color: "#fff" } : undefined}
    >
      {label}
    </button>
  );
}

function ModeCard({
  icon: Icon,
  color,
  title,
  hint,
  onClick,
  disabled,
}: {
  icon: typeof Gamepad2;
  color: string;
  title: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[108px] w-full flex-col items-start gap-2 rounded-2xl border-0 p-4 text-left text-white shadow-lg transition active:scale-[.97] disabled:opacity-50"
      style={{ backgroundColor: color }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-snug text-white/80">{hint}</span>
      </span>
    </button>
  );
}

/**
 * Kahoot variantlar to'rasi — 2 rejim:
 *  - "pick"   — o'yinchi tanlaydi (rangli tugmalar)
 *  - "reveal" — to'g'ri/noto'g'ri belgilanadi (oq halqa + ✓ / ✗)
 * Rasmli variantlarni (pickImage) ham ko'rsatadi.
 */
function KahootOptionsGrid({
  options,
  optionImages,
  mode = "pick",
  answer,
  myChoice,
  onPick,
  disabled,
  tapLabel,
}: {
  options: string[];
  optionImages?: string[];
  mode?: "pick" | "reveal";
  answer?: number;
  myChoice?: number | null;
  onPick?: (i: number) => void;
  disabled?: boolean;
  tapLabel?: string;
}) {
  const hasImgs = Boolean(optionImages?.some(Boolean));
  const shortTwo =
    options.length === 2 &&
    (options[0]?.length ?? 99) <= 20 &&
    (options[1]?.length ?? 99) <= 20;
  const cols = hasImgs || options.length >= 3 || shortTwo ? "grid-cols-2" : "grid-cols-1";
  return (
    <div className={cn("mt-3 grid flex-1 content-start gap-3", cols)}>
      {options.map((opt, i) => {
        const pal = KAHOOT_PALETTE[i % KAHOOT_PALETTE.length];
        const label = opt || String.fromCharCode(65 + i);
        const img = optionImages?.[i];
        const imgBlock = hasImgs ? (
          img ? (
            <img src={img} alt="" className="h-24 w-full rounded-xl bg-white object-contain p-1" />
          ) : (
            <span className="flex h-24 w-full items-center justify-center rounded-xl bg-white/25 text-2xl font-black">
              {String.fromCharCode(65 + i)}
            </span>
          )
        ) : null;
        if (mode === "reveal") {
          const good = i === answer;
          const mine = myChoice === i;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold text-white shadow-lg",
                hasImgs ? "min-h-[140px] flex-col" : "min-h-[72px]",
                good ? "ring-4 ring-white" : "opacity-45",
              )}
              style={{ backgroundColor: pal.bg }}
            >
              {imgBlock && <div className="w-full">{imgBlock}</div>}
              {!hasImgs && <KahootShape kind={pal.shape} />}
              <span className="min-w-0 flex-1 leading-snug">{label}</span>
              {good && <Check className="h-5 w-5 shrink-0" aria-hidden />}
              {mine && !good && <X className="h-5 w-5 shrink-0" aria-hidden />}
            </div>
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick?.(i)}
            disabled={disabled}
            aria-label={`${tapLabel ?? "Javob"}: ${label}`}
            className={cn(
              "flex rounded-2xl px-3 py-3 text-left text-sm font-bold text-white shadow-lg transition active:scale-[.97] disabled:opacity-70",
              hasImgs ? "min-h-[140px] flex-col" : "min-h-[96px] items-center gap-2",
            )}
            style={{ backgroundColor: pal.bg }}
          >
            {imgBlock && <div className="w-full">{imgBlock}</div>}
            {!hasImgs && <KahootShape kind={pal.shape} />}
            <span className="min-w-0 flex-1 leading-snug">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function KahootShape({ kind }: { kind: "triangle" | "diamond" | "circle" | "square" }) {
  if (kind === "circle") return <span className="h-6 w-6 shrink-0 rounded-full bg-white/90" />;
  if (kind === "square") return <span className="h-6 w-6 shrink-0 rounded-sm bg-white/90" />;
  if (kind === "diamond") {
    return <span className="h-6 w-6 shrink-0 rotate-45 rounded-sm bg-white/90" />;
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden>
      <polygon points="12,3 22,21 2,21" fill="white" fillOpacity="0.92" />
    </svg>
  );
}

/** O'yinchi avatar — emoji/color/dataURL/URL yoki harf fallback. */
function PlayerAvatar({ player, size }: { player: KahootPlayer; size: number }) {
  const av = player.avatar;
  if (av?.startsWith("emoji:")) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        {av.slice(6)}
      </span>
    );
  }
  if (av?.startsWith("color:")) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
        style={{ width: size, height: size, backgroundColor: av.slice(6), fontSize: size * 0.42 }}
      >
        {(player.name[0] ?? "?").toUpperCase()}
      </span>
    );
  }
  if (av) {
    return (
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
        style={{ width: size, height: size }}
      >
        <img src={av} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: playerColor(player.name), fontSize: size * 0.42 }}
    >
      {(player.name[0] ?? "?").toUpperCase()}
    </span>
  );
}

const STICKERS = ["🎉", "😂", "😮", "🔥", "💪", "🤯", "😎", "❤️"];

interface StickerFly {
  id: number;
  emoji: string;
  x: number; // %
  y: number; // %
  rot: number;
}

/** Ekran ustida uchayotgan stikerlar (pointer-events yo'q). */
function StickerLayer({ items }: { items: StickerFly[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-full justify-center">
      <div className="relative h-full w-full max-w-md overflow-hidden">
        {items.map((s) => (
          <motion.span
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ scale: 0, opacity: 0, y: 0, rotate: 0 }}
            animate={{ scale: [0, 1.6, 1.25], opacity: [0, 1, 0], y: -150, rotate: s.rot }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute select-none text-5xl drop-shadow-lg"
          >
            {s.emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** Stiker holati — bosilsa stiker ekran bo'ylab uchadi. */
function useStickers() {
  const haptic = useHaptics();
  const [flies, setFlies] = useState<StickerFly[]>([]);
  const idRef = useRef(0);

  const throwSticker = useCallback((emoji: string) => {
    const id = ++idRef.current;
    const s: StickerFly = {
      id,
      emoji,
      x: 10 + Math.random() * 72,
      y: 28 + Math.random() * 50,
      rot: -30 + Math.random() * 60,
    };
    setFlies((cur) => [...cur.slice(-14), s]);
    haptic([25]);
    window.setTimeout(() => setFlies((cur) => cur.filter((f) => f.id !== id)), 1650);
  }, [haptic]);

  return { flies, throwSticker };
}

/** Yorug' fon uchun stiker qatori (kutish xonasi). */
function StickerBar() {
  const { flies, throwSticker } = useStickers();
  return (
    <>
      <div className="mt-4 flex items-center justify-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STICKERS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => throwSticker(e)}
            aria-label={`Stiker: ${e}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-2xl transition active:scale-90"
          >
            {e}
          </button>
        ))}
      </div>
      <StickerLayer items={flies} />
    </>
  );
}
