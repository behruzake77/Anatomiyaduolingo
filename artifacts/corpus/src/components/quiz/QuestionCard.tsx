"use client";

/**
 * Yagona savol UI — dars (LessonScreen) va takrorlash (ReviewScreen) uchun.
 *
 * Duolingo uslubidagi 2 bosqichli oqim:
 *   1) variantni tanlash (ko'k ajralib turadi) → pastda "Tekshirish" tugmasi.
 *   2) "Tekshirish" bosilgach — pastki panel yashil (to'g'ri) / qizil (xato)
 *      bo'yaladi, izoh va "Davom etish" tugmasi chiqadi.
 * `onCorrect` / `onWrong` — faqat "Tekshirish" paytida bir marta chaqiriladi.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ZoomIn, Bookmark, ArrowRight, RotateCcw } from "lucide-react";
import { ReportFlagButton, type ReportContext } from "@/components/ReportQuestion";
import { Button } from "@/components/ui/Button";
import { Lightbox } from "@/components/ui/Lightbox";
import { useAppStore } from "@/store/useAppStore";
import { difficultyOf, type Question, type Difficulty } from "@/data/content";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";
import { useHaptics } from "@/hooks/useHaptics";

/* ---------- Kattalashtiriladigan rasm ---------- */
export function ZoomableImage(props: { src: string; alt: string; maxH: string; showHint?: boolean }) {
  const { src, alt, maxH, showHint } = props;
  const t = useStrings();
  const [zoom, setZoom] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={t.zoomHint}
        className="group relative mt-4 block w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card"
      >
        <span className="relative mx-auto block w-fit max-w-full">
          <img src={src} alt={alt} className={cn("max-w-full object-contain", maxH)} />
          <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
            <ZoomIn className="h-4 w-4" aria-hidden />
          </span>
          {showHint && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {t.zoomHint}
            </span>
          )}
        </span>
      </button>

      {zoom && (
        <Lightbox
          src={src}
          alt={alt}
          onClose={() => setZoom(false)}
          labels={{ close: t.zoomClose, zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.zoomReset }}
        />
      )}
    </>
  );
}

/* ---------- Qiyinlik ko'rsatkichi ---------- */
function DifficultyBadge({ q }: { q: Question }) {
  const t = useStrings();
  const d = difficultyOf(q);
  const conf: Record<Difficulty, { label: string; cls: string }> = {
    easy: { label: t.easy, cls: "bg-success/15 text-success border-success/30" },
    medium: { label: t.medium, cls: "bg-warning/15 text-warning border-warning/30" },
    hard: { label: t.hard, cls: "bg-danger/15 text-danger border-danger/30" },
  };
  const c = conf[d];
  return (
    <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-bold ${c.cls}`}>
      {c.label}
    </span>
  );
}

/* ---------- Pastki panel: 2 bosqichli Duolingo bar ---------- */
function AnswerBar(props: {
  selected: boolean;          // tanlangan bormi (Check tugmasini ko'rsatish uchun)
  revealed: boolean;          // tekshirilganmi
  correct: boolean;           // natija
  showCorrect?: string;       // xato bo'lganda ko'rsatiladigan to'g'ri javob
  explanation?: string;
  onCheck: () => void;
  onNext: () => void;
  isLast: boolean;
  disabled?: boolean;         // Check tugmasini o'chirish (build/order uchun)
  canRetry?: boolean;
  onRetry?: () => void;
  haptic: (p: number | number[]) => void;
}) {
  const t = useStrings();

  if (!props.revealed) {
    // 1-bosqich: tanlash — pastda ko'k "Tekshirish" bar
    return (
      <div className="sticky bottom-0 -mx-5 mt-auto border-t border-line bg-bg/90 px-5 py-4 backdrop-blur">
        <Button
          className="w-full"
          size="lg"
          disabled={!props.selected || props.disabled}
          onClick={() => {
            props.haptic(12);
            props.onCheck();
          }}
        >
          {t.check}
        </Button>
      </div>
    );
  }

  // 2-bosqich: natija — yashil / qizil bar
  const ok = props.correct;
  return (
    <div
      className={cn(
        "sticky bottom-0 -mx-5 mt-auto px-5 py-4",
        ok ? "bg-success" : "bg-danger",
      )}
    >
      <div className="flex items-start gap-3 text-white">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25">
          {ok ? <Check className="h-5 w-5" aria-hidden /> : <X className="h-5 w-5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{ok ? t.correct : t.wrong}</p>
          {!ok && props.showCorrect && (
            <p className="mt-0.5 text-sm text-white/90">
              {t.correctAnswer}: <span className="font-semibold">{props.showCorrect}</span>
            </p>
          )}
          {props.explanation && (
            <p className="mt-1 text-sm leading-snug text-white/90">{props.explanation}</p>
          )}
        </div>
      </div>

      <Button
        className="mt-3 w-full !bg-white !text-[#1a1230]"
        size="lg"
        onClick={() => {
          if (ok) props.onNext();
          else if (props.onRetry) props.onRetry();
          else props.onNext();
        }}
      >
        <span className="flex items-center gap-2">
          {ok ? t.continue : props.canRetry ? t.retry : t.continue}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </span>
      </Button>
    </div>
  );
}

/* ---------- Savol bloki ---------- */
export function QuestionCard(props: {
  q: Question;
  qKey?: string;
  report?: ReportContext;
  onCorrect: () => void;
  onWrong?: () => void;
  onNext: () => void;
  isLast: boolean;
  haptic: (p: number | number[]) => void;
}) {
  const { q, qKey, report } = props;
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const t = useStrings();
  const bookmarked = qKey ? bookmarks.includes(qKey) : false;

  let body: React.ReactNode;
  if (q.type === "match") body = <MatchUI {...props} />;
  else if (q.type === "build") body = <BuildUI {...props} />;
  else if (q.type === "order") body = <OrderUI {...props} />;
  else if (q.type === "fill") body = <FillUI {...props} />;
  else if (q.type === "tf") body = <TfUI {...props} />;
  else body = <ChoiceUI {...props} />; // quiz / img / func

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-3 flex items-center justify-between gap-2">
        <DifficultyBadge q={q} />
        <div className="flex items-center gap-2">
          <ReportFlagButton q={q} ctx={{ ...report, qKey, prompt: q.prompt, qType: q.type }} />
          {qKey && (
            <button
              onClick={() => toggleBookmark(qKey)}
              aria-label={bookmarked ? t.bookmarkRemove : t.bookmarkAdd}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                bookmarked ? "border-accent bg-accent/15 text-accent" : "border-line text-muted",
              )}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} aria-hidden />
            </button>
          )}
        </div>
      </div>
      {body}
    </div>
  );
}

function Prompt({ prompt, type }: { prompt: string; type: string }) {
  const t = useStrings();
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
      <h1 className="mt-2 text-2xl font-semibold leading-snug dark:text-white">{prompt}</h1>
    </div>
  );
}

/* ---------- Tanlovli (quiz / img / func) ---------- */
function ChoiceUI(props: { q: Question; onCorrect: () => void; onWrong?: () => void; onNext: () => void; isLast: boolean; haptic: (p: number | number[]) => void }) {
  const { q, onCorrect, onWrong, onNext, isLast, haptic } = props;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = revealed && selected === q.answer;

  const onCheck = () => {
    setRevealed(true);
    if (selected === q.answer) { onCorrect(); haptic([40, 60, 90]); }
    else { onWrong?.(); haptic([50, 50]); }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />

      {q.image && <ZoomableImage src={q.image} alt="Anatomiya rasmi" maxH="max-h-52" />}

      <div className="mt-5 flex flex-col gap-3 pb-2">
        {q.options?.map((opt, i) => {
          const isSel = selected === i && !revealed;
          const isCorrect = revealed && i === q.answer;
          const isWrong = revealed && selected === i && i !== q.answer;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
              onClick={() => { if (!revealed) setSelected(i); }}
              disabled={revealed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-medium transition-colors dark:bg-surface2",
                // tanlanmagan / tanlangan / natija holatlari
                !revealed && !isSel && "border-line",
                !revealed && isSel && "border-primary bg-primary/10 ring-1 ring-primary",
                isCorrect && "border-success bg-success/10",
                isWrong && "border-danger bg-danger/10",
                revealed && !isCorrect && !isWrong && "border-line opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold",
                  isCorrect
                    ? "border-success bg-success text-white"
                    : isWrong
                      ? "border-danger bg-danger text-white"
                      : isSel
                        ? "border-primary bg-primary text-white"
                        : "border-line text-muted",
                )}
              >
                {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : isWrong ? <X className="h-4 w-4" aria-hidden /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      <AnswerBar
        selected={selected !== null}
        revealed={revealed}
        correct={correct}
        showCorrect={q.answer !== undefined ? q.options?.[q.answer] : undefined}
        explanation={q.explanation ?? q.hint}
        onCheck={onCheck}
        onNext={onNext}
        isLast={isLast}
        haptic={haptic}
      />
    </div>
  );
}

/* ---------- To'g'ri / noto'g'ri ---------- */
function TfUI(props: { q: Question; onCorrect: () => void; onWrong?: () => void; onNext: () => void; isLast: boolean; haptic: (p: number | number[]) => void }) {
  const { q, onCorrect, onWrong, onNext, isLast, haptic } = props;
  const t = useStrings();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const options = [true, false];
  const correct = revealed && selected !== null && options[selected] === q.statement;

  const onCheck = () => {
    setRevealed(true);
    if (options[selected!] === q.statement) { onCorrect(); haptic([40, 60, 90]); }
    else { onWrong?.(); haptic([50, 50]); }
  };

  const correctLabel = q.statement ? t.trueLabel : t.falseLabel;

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />

      <div className="mt-5 flex flex-col gap-3 pb-2">
        {options.map((v, i) => {
          const isSel = selected === i && !revealed;
          const isCorrect = revealed && v === q.statement;
          const isWrong = revealed && selected === i && v !== q.statement;
          return (
            <button
              key={i}
              onClick={() => { if (!revealed) setSelected(i); }}
              disabled={revealed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-semibold transition-colors dark:bg-surface2",
                !revealed && !isSel && "border-line",
                !revealed && isSel && "border-primary bg-primary/10 ring-1 ring-primary",
                isCorrect && "border-success bg-success/10",
                isWrong && "border-danger bg-danger/10",
                revealed && !isCorrect && !isWrong && "border-line opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border-2 text-sm font-bold",
                  isCorrect ? "border-success bg-success text-white" : isWrong ? "border-danger bg-danger text-white" : isSel ? "border-primary bg-primary text-white" : "border-line text-muted",
                )}
              >
                {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : isWrong ? <X className="h-4 w-4" aria-hidden /> : v ? "T" : "N"}
              </span>
              {v ? t.trueLabel : t.falseLabel}
            </button>
          );
        })}
      </div>

      <AnswerBar
        selected={selected !== null}
        revealed={revealed}
        correct={correct}
        showCorrect={correctLabel}
        explanation={q.explanation}
        onCheck={onCheck}
        onNext={onNext}
        isLast={isLast}
        haptic={haptic}
      />
    </div>
  );
}

/* ---------- Moslashtirish: chap — lotincha, o'ng — o'zbekcha (alohida aralashtiriladi) ---------- */
function MatchUI(props: {
  q: Question;
  onNext: () => void;
  isLast: boolean;
  onCorrect: () => void;
  onWrong?: () => void;
  haptic: (p: number | number[]) => void;
}) {
  const { q, onNext, isLast, onCorrect, haptic } = props;
  const t = useStrings();
  const pairs = q.pairs ?? [];
  const { left, right } = useMemo(() => {
    const L = shuffle(pairs.map((p, i) => ({ id: i, text: p[0] })));
    const R = derangeAgainst(L, pairs.map((p, i) => ({ id: i, text: p[1] })));
    return { left: L, right: R };
  }, [q]);
  const [leftSel, setLeftSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongL, setWrongL] = useState<number | null>(null);
  const [wrongR, setWrongR] = useState<number | null>(null);

  const done = pairs.length > 0 && matched.length === pairs.length;

  const pickLeft = (id: number) => {
    if (matched.includes(id) || done) return;
    setLeftSel(id);
    setWrongL(null);
    setWrongR(null);
  };

  const pickRight = (id: number) => {
    if (matched.includes(id) || done) return;
    if (leftSel === null) return;
    if (leftSel === id) {
      const next = [...matched, id];
      setMatched(next);
      haptic(12);
      setLeftSel(null);
      setWrongL(null);
      setWrongR(null);
      if (next.length === pairs.length) onCorrect();
    } else {
      setWrongL(leftSel);
      setWrongR(id);
      haptic([50, 50]);
      setLeftSel(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />
      <p className="mt-2 text-xs text-muted">{t.matchHint}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((item) => {
            const isSel = leftSel === item.id && !matched.includes(item.id);
            const isOk = matched.includes(item.id);
            const isBad = wrongL === item.id;
            return (
              <button
                key={`L-${item.id}`}
                type="button"
                onClick={() => pickLeft(item.id)}
                disabled={isOk}
                className={cn(
                  "min-h-16 rounded-2xl border-2 bg-surface p-3 text-left text-sm font-medium transition-colors dark:bg-surface2",
                  isSel && "border-primary bg-primary/10 ring-1 ring-primary",
                  isOk && "border-success bg-success/10 opacity-60",
                  isBad && "animate-pulse border-danger bg-danger/10",
                  !isSel && !isOk && !isBad && "border-line",
                )}
              >
                {item.text}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((item) => {
            const isOk = matched.includes(item.id);
            const isBad = wrongR === item.id;
            return (
              <button
                key={`R-${item.id}`}
                type="button"
                onClick={() => pickRight(item.id)}
                disabled={isOk || leftSel === null}
                className={cn(
                  "min-h-16 rounded-2xl border-2 bg-surface p-3 text-left text-sm font-medium transition-colors dark:bg-surface2",
                  isOk && "border-success bg-success/10 opacity-60",
                  isBad && "animate-pulse border-danger bg-danger/10",
                  !isOk && !isBad && "border-line",
                )}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      <AnswerBar
        selected={matched.length > 0}
        revealed={done}
        correct={done}
        showCorrect={undefined}
        explanation={q.explanation}
        onCheck={() => onCorrect()}
        onNext={onNext}
        isLast={isLast}
        disabled={!done}
        haptic={haptic}
      />
    </div>
  );
}

/* ---------- Atama yig'ish ---------- */
function BuildUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; onWrong?: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, onWrong, haptic } = props;
  const t = useStrings();
  const words = q.answerText?.split(" ") ?? [];
  const bank = useMemo(() => shuffle([...words, ...(q.extra ?? [])].map((w, i) => ({ key: i, word: w }))), [q]);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const pick = (key: number) => { if (!revealed) setPicked((p) => [...p, key]); };
  const unpick = (key: number) => { if (!revealed) setPicked((p) => p.filter((k) => k !== key)); };
  const check = () => {
    const correct = picked.map((k) => bank.find((b) => b.key === k)?.word).join(" ") === (q.answerText ?? "");
    setRevealed(true);
    if (correct) { onCorrect(); haptic([40, 60, 90]); } else { onWrong?.(); haptic([50, 50]); }
  };

  const correct = revealed && picked.map((k) => bank.find((b) => b.key === k)?.word).join(" ") === (q.answerText ?? "");

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />

      <div className="mt-5 min-h-16 rounded-2xl border-2 border-dashed border-line p-3 dark:border-line">
        {picked.length === 0 && <span className="text-sm text-muted">{t.buildHint}</span>}
        {picked.map((k) => (
          <button key={k} onClick={() => unpick(k)} className="m-1 rounded-xl border-2 border-primary bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            {bank.find((b) => b.key === k)?.word}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {bank.filter((b) => !picked.includes(b.key)).map((b) => (
          <button key={b.key} onClick={() => pick(b.key)} className="rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-sm font-semibold dark:bg-surface2">
            {b.word}
          </button>
        ))}
      </div>

      <AnswerBar
        selected={picked.length > 0}
        revealed={revealed}
        correct={correct}
        showCorrect={q.answerText}
        explanation={q.explanation}
        onCheck={check}
        onNext={onNext}
        isLast={isLast}
        disabled={picked.length === 0}
        haptic={haptic}
      />
    </div>
  );
}

/* ---------- Tartiblash ---------- */
function OrderUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; onWrong?: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, onWrong, haptic } = props;
  const t = useStrings();
  const items = q.items ?? [];
  const bank = useMemo(() => shuffle(items.map((w, i) => ({ key: i, word: w }))), [q]);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const pick = (key: number) => { if (!revealed) setPicked((p) => [...p, key]); };
  const unpick = (key: number) => { if (!revealed) setPicked((p) => p.filter((k) => k !== key)); };
  const check = () => {
    const correct = picked.every((k, i) => bank.find((b) => b.key === k)?.word === items[i]);
    setRevealed(true);
    if (correct) { onCorrect(); haptic([40, 60, 90]); } else { onWrong?.(); haptic([50, 50]); }
  };

  const correct = revealed && picked.every((k, i) => bank.find((b) => b.key === k)?.word === items[i]);

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />

      <div className="mt-5 min-h-16 rounded-2xl border-2 border-dashed border-line p-3 dark:border-line">
        {picked.length === 0 && <span className="text-sm text-muted">{t.orderHint}</span>}
        {picked.map((k, i) => (
          <button key={k} onClick={() => unpick(k)} className="m-1 rounded-xl border-2 border-primary bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            <span className="mr-1 opacity-60">{i + 1}.</span>{bank.find((b) => b.key === k)?.word}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {bank.filter((b) => !picked.includes(b.key)).map((b) => (
          <button key={b.key} onClick={() => pick(b.key)} className="rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-sm font-semibold dark:bg-surface2">
            {b.word}
          </button>
        ))}
      </div>

      <AnswerBar
        selected={picked.length > 0}
        revealed={revealed}
        correct={correct}
        showCorrect={items.join(" → ")}
        explanation={q.explanation ?? t.correct + ": " + items.join(" → ")}
        onCheck={check}
        onNext={onNext}
        isLast={isLast}
        disabled={picked.length !== items.length}
        haptic={haptic}
      />
    </div>
  );
}

/* ---------- Bo'sh joyni to'ldirish (tanlash uslubida) ---------- */
function FillUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; onWrong?: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, onWrong, haptic } = props;
  const bank = useMemo(() => shuffle([q.answerText ?? "", ...(q.extra ?? [])].map((w, i) => ({ key: i, word: w }))), [q]);
  const [sel, setSel] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = revealed && sel !== null && bank[sel].word === q.answerText;
  const onCheck = () => setRevealed(true);

  return (
    <div className="flex flex-1 flex-col">
      <Prompt prompt={q.prompt} type={q.type} />

      <div className="mt-5 flex flex-wrap gap-3">
        {bank.map((b, i) => {
          const isSel = sel === i && !revealed;
          const isCorrect = revealed && b.word === q.answerText;
          const isWrong = revealed && sel === i && b.word !== q.answerText;
          return (
            <button
              key={b.key}
              onClick={() => { if (!revealed) setSel(i); }}
              disabled={revealed}
              className={cn(
                "rounded-2xl border-2 bg-surface px-5 py-3 text-base font-semibold transition-colors dark:bg-surface2",
                !revealed && !isSel && "border-line",
                !revealed && isSel && "border-primary bg-primary/10 ring-1 ring-primary",
                isCorrect && "border-success bg-success/10 text-success",
                isWrong && "border-danger bg-danger/10 text-danger",
                revealed && !isCorrect && !isWrong && "border-line opacity-50",
              )}
            >
              {b.word}
            </button>
          );
        })}
      </div>

      <AnswerBar
        selected={sel !== null}
        revealed={revealed}
        correct={correct}
        showCorrect={q.answerText}
        explanation={q.explanation}
        onCheck={() => {
          setRevealed(true);
          if (bank[sel!].word === q.answerText) { onCorrect(); haptic([40, 60, 90]); }
          else { onWrong?.(); haptic([50, 50]); }
        }}
        onNext={onNext}
        isLast={isLast}
        haptic={haptic}
      />
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Right column: same items, but never the matching pair on the same row. */
function derangeAgainst<T extends { id: number }>(left: T[], right: T[]): T[] {
  if (right.length < 2) return shuffle(right);
  const byId = new Map(right.map((item) => [item.id, item]));
  const leftIds = left.map((item) => item.id);
  for (let n = 0; n < 24; n++) {
    const perm = shuffle(leftIds);
    if (perm.every((id, i) => id !== leftIds[i])) {
      return perm.map((id) => byId.get(id)!);
    }
  }
  return [...leftIds.slice(1), leftIds[0]].map((id) => byId.get(id)!);
}
