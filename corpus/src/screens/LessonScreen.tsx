"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lightbox, type LightboxMarker } from "@/components/ui/Lightbox";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppStore } from "@/store/useAppStore";
import { lessonById, unitOfLesson, sortByDifficulty, difficultyOf, type Question, type Lesson, type Difficulty } from "@/data/content";
import { LESSON_MARKERS } from "@/data/markers";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Dars ekrani: kirish slaydlari → savollar (8 tur) → natija.
 */
export function LessonScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const activeLessonId = useAppStore((s) => s.activeLessonId);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const haptic = useHaptics();
  const t = useStrings();

  const lesson = useMemo(() => lessonById(activeLessonId ?? ""), [activeLessonId]);
  const unit = useMemo(() => unitOfLesson(activeLessonId ?? ""), [activeLessonId]);

  const [slideIdx, setSlideIdx] = useState(0);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  if (!lesson || !unit) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">{t.errEmpty}</p>
        <Button onClick={() => navigate("lessons")}>« {t.backToTopics}</Button>
      </div>
    );
  }

  const slides = lesson.slides ?? [];
  const inSlides = slideIdx < slides.length;
  // Savollar oson → o'rta → qiyin tartibida gradatsiyalanadi.
  const questions = useMemo(() => sortByDifficulty(lesson.questions), [lesson]);
  const total = questions.length;
  const q = questions[idx];
  const isLast = idx + 1 >= total;

  const finish = (finalScore: number) => {
    const accuracy = finalScore / Math.max(1, total);
    completeLesson(lesson.id, unit.id, finalScore, total);
    navigate(accuracy >= 0.7 ? "result-correct" : "result-wrong");
  };

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
      {/* header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate("lessons")}
          aria-label={t.quitLesson}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(idx / Math.max(1, total)) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="text-sm font-semibold text-muted">
          {inSlides ? 0 : idx + 1}/{total}
        </span>
      </header>

      {inSlides ? (
        <SlideView
          lesson={lesson}
          slide={slides[slideIdx]}
          slideNo={slideIdx + 1}
          slideTotal={slides.length}
          onNext={() => setSlideIdx((i) => i + 1)}
          onQuit={() => navigate("lessons")}
        />
      ) : (
        <QuestionBlock
          key={`${lesson.id}-${idx}`}
          q={q}
          onCorrect={() => setScore((s) => s + 1)}
          onNext={() => {
            if (isLast) finish(score);
            else setIdx((i) => i + 1);
          }}
          isLast={isLast}
          haptic={haptic}
        />
      )}
    </div>
  );
}

/* ---------- Slayd (kirish) ---------- */
function SlideView(props: {
  lesson: Lesson;
  slide: { title: string; text: string; img?: string; cap?: string; legend?: { n: string; name: string }[] };
  slideNo: number;
  slideTotal: number;
  onNext: () => void;
  onQuit: () => void;
}) {
  const { lesson, slide, slideNo, slideTotal, onNext, onQuit } = props;
  const t = useStrings();
  const isLast = slideNo >= slideTotal;
  const [zoom, setZoom] = useState(false);
  const [find, setFind] = useState<string | null>(null);

  const markers: LightboxMarker[] | undefined = useMemo(() => {
    const raw = LESSON_MARKERS[lesson.id];
    if (!raw || raw.length === 0) return undefined;
    const byN = new Map((slide.legend ?? []).map((l) => [l.n, l.name]));
    return raw.map((m) => ({ n: m.n, x: m.x, y: m.y, name: byN.get(m.n) ?? m.n }));
  }, [lesson.id, slide.legend]);

  const findName = find ? (slide.legend?.find((l) => l.n === find)?.name ?? find) : null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{lesson.title}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{slide.title}</h1>
      </div>

      {slide.img && (
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label={t.zoomHint}
          className="group relative mt-4 block w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card"
        >
          <span className="relative mx-auto block w-fit max-w-full">
            <img src={slide.img} alt={slide.title} className="max-h-56 max-w-full object-contain" />
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
              <ZoomIn className="h-4 w-4" aria-hidden />
            </span>
          </span>
        </button>
      )}

      {slide.legend && slide.legend.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-surface2 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            {t.imageParts}
            <span className="ml-1 font-normal normal-case text-muted">— {t.tapToFind}</span>
          </p>
          <ul className="grid max-h-52 grid-cols-1 gap-1 overflow-y-auto pr-1">
            {slide.legend.map((it, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    setFind(it.n);
                    setZoom(true);
                  }}
                  className="flex w-full items-start gap-2 rounded-lg px-1 py-0.5 text-left text-[13px] leading-snug transition-colors hover:bg-primary/10"
                >
                  <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 px-1 text-[11px] font-bold text-primary">
                    {it.n}
                  </span>
                  <span className="text-ink">{it.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {zoom && slide.img && (
        <Lightbox
          src={slide.img}
          alt={slide.title}
          onClose={() => {
            setZoom(false);
            setFind(null);
          }}
          labels={{ close: t.zoomClose, zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.zoomReset }}
          banner={findName ? t.findPart.replace("{n}", find ?? "").replace("{name}", findName) : undefined}
          markers={markers}
        />
      )}

      <p className="mt-4 text-sm leading-relaxed text-muted">{slide.text}</p>
      {slide.cap && <p className="mt-2 text-xs italic text-muted">{slide.cap}</p>}

      <div className="mt-auto flex gap-3 pt-6">
        <Button variant="ghost" onClick={onQuit}>
          {t.backToTopics}
        </Button>
        <Button className="flex-1" size="lg" onClick={onNext}>
          {isLast ? t.continue : t.next}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Kattalashtiriladigan rasm ---------- */
function ZoomableImage(props: { src: string; alt: string; maxH: string; showHint?: boolean }) {
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

/* ---------- Savol bloki ---------- */
function QuestionBlock(props: {
  q: Question;
  onCorrect: () => void;
  onNext: () => void;
  isLast: boolean;
  haptic: (p: number | number[]) => void;
}) {
  const { q } = props;
  let body: React.ReactNode;
  if (q.type === "match") body = <MatchUI {...props} />;
  else if (q.type === "build") body = <BuildUI {...props} />;
  else if (q.type === "order") body = <OrderUI {...props} />;
  else if (q.type === "fill") body = <FillUI {...props} />;
  else if (q.type === "tf") body = <TfUI {...props} />;
  else body = <ChoiceUI {...props} />; // quiz / img / func

  return (
    <>
      <div className="mt-3">
        <DifficultyBadge q={q} />
      </div>
      {body}
    </>
  );
}

function Footer(props: { revealed: boolean; explanation?: string; onNext: () => void; isLast: boolean }) {
  const t = useStrings();
  return (
    <div className="mt-auto pt-5">
      {props.revealed && props.explanation && (
        <p className="mb-3 rounded-xl bg-surface2 p-3 text-sm text-muted">{props.explanation}</p>
      )}
      <Button className="w-full" size="lg" disabled={!props.revealed} onClick={props.onNext}>
        {props.isLast ? t.finish : t.next}
      </Button>
    </div>
  );
}

/* ---------- Tanlovli (quiz / img / func) ---------- */
function ChoiceUI(props: { q: Question; onCorrect: () => void; onNext: () => void; isLast: boolean; haptic: (p: number | number[]) => void }) {
  const { q, onCorrect, onNext, isLast, haptic } = props;
  const t = useStrings();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>

      {q.image && <ZoomableImage src={q.image} alt="Anatomiya rasmi" maxH="max-h-52" />}

      <div className="mt-5 flex flex-col gap-3">
        <AnimatePresence>
          {q.options?.map((opt, i) => {
            const isCorrect = revealed && i === q.answer;
            const isWrong = revealed && selected === i && i !== q.answer;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                onClick={() => {
                  if (revealed) return;
                  setSelected(i);
                  setRevealed(true);
                  if (i === q.answer) { onCorrect(); haptic(12); } else haptic([30, 40, 30]);
                }}
                disabled={revealed}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-medium transition-colors",
                  !revealed && "border-line active:border-primary",
                  isCorrect && "border-success bg-success/10",
                  isWrong && "border-danger bg-danger/10",
                  revealed && !isCorrect && !isWrong && "border-line opacity-60",
                )}
              >
                <span className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold",
                  isCorrect ? "border-success bg-success text-white" : isWrong ? "border-danger bg-danger text-white" : "border-line text-muted",
                )}>
                  {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <Footer revealed={revealed} explanation={q.explanation ?? q.hint} onNext={onNext} isLast={isLast} />
    </div>
  );
}

/* ---------- To'g'ri / noto'g'ri ---------- */
function TfUI(props: { q: Question; onCorrect: () => void; onNext: () => void; isLast: boolean; haptic: (p: number | number[]) => void }) {
  const { q, onCorrect, onNext, isLast, haptic } = props;
  const t = useStrings();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const options = [true, false];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {options.map((v, i) => {
          const isCorrect = revealed && v === q.statement;
          const isWrong = revealed && selected === i && v !== q.statement;
          return (
            <button
              key={i}
              onClick={() => {
                if (revealed) return;
                setSelected(i);
                setRevealed(true);
                if (v === q.statement) { onCorrect(); haptic(12); } else haptic([30, 40, 30]);
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-surface p-4 text-left text-base font-semibold transition-colors",
                isCorrect && "border-success bg-success/10",
                isWrong && "border-danger bg-danger/10",
                revealed && !isCorrect && !isWrong && "border-line opacity-60",
              )}
            >
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border-2 text-sm font-bold",
                isCorrect ? "border-success bg-success text-white" : isWrong ? "border-danger bg-danger text-white" : "border-line text-muted",
              )}>
                {isCorrect ? <Check className="h-4 w-4" aria-hidden /> : v ? "✓" : "✕"}
              </span>
              {v ? "To'g'ri" : "Noto'g'ri"}
            </button>
          );
        })}
      </div>
      <Footer revealed={revealed} explanation={q.explanation} onNext={onNext} isLast={isLast} />
    </div>
  );
}

/* ---------- Moslashtirish ---------- */
function MatchUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, haptic } = props;
  const t = useStrings();
  const pairs = q.pairs ?? [];
  const [leftSel, setLeftSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);

  const done = matched.length === pairs.length;

  const click = (side: "L" | "R", i: number) => {
    if (matched.includes(i)) return;
    if (side === "L") { setLeftSel(i); return; }
    if (leftSel === null) return;
    if (leftSel === i) {
      setMatched((m) => [...m, i]);
      haptic(12);
      setLeftSel(null);
      if (matched.length + 1 === pairs.length) onCorrect();
    } else {
      haptic([30, 40, 30]);
      setLeftSel(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {pairs.map((p, i) => (
          <div key={i} className="flex flex-col gap-3">
            <button
              onClick={() => click("L", i)}
              className={cn(
                "min-h-16 rounded-2xl border-2 bg-surface p-3 text-sm font-medium transition-colors",
                leftSel === i && !matched.includes(i) ? "border-primary bg-primary/10" : "border-line",
                matched.includes(i) && "border-success bg-success/10 opacity-60",
              )}
            >
              {p[0]}
            </button>
            <button
              onClick={() => click("R", i)}
              className={cn(
                "min-h-16 rounded-2xl border-2 bg-surface p-3 text-sm font-medium transition-colors",
                matched.includes(i) ? "border-success bg-success/10 opacity-60" : "border-line",
              )}
            >
              {p[1]}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <Button className="w-full" size="lg" disabled={!done} onClick={onNext}>
          {isLast ? t.finish : t.next}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Atama yig'ish ---------- */
function BuildUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, haptic } = props;
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
    if (correct) { onCorrect(); haptic(12); } else haptic([30, 40, 30]);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>
      <div className="mt-5 min-h-16 rounded-2xl border-2 border-dashed border-line p-3">
        {picked.length === 0 && <span className="text-sm text-muted">{t.buildHint}</span>}
        {picked.map((k) => (
          <button key={k} onClick={() => unpick(k)} className="m-1 rounded-xl border-2 border-primary bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            {bank.find((b) => b.key === k)?.word}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {bank.filter((b) => !picked.includes(b.key)).map((b) => (
          <button key={b.key} onClick={() => pick(b.key)} className="rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-sm font-semibold">
            {b.word}
          </button>
        ))}
      </div>
      <div className="mt-auto pt-5">
        {revealed && <p className="mb-3 rounded-xl bg-surface2 p-3 text-sm text-muted">{t.correct}: {q.answerText}</p>}
        {!revealed ? (
          <Button className="w-full" size="lg" disabled={picked.length === 0} onClick={check}>{t.finish}</Button>
        ) : (
          <Button className="w-full" size="lg" onClick={onNext}>{isLast ? t.finish : t.next}</Button>
        )}
      </div>
    </div>
  );
}

/* ---------- Tartiblash ---------- */
function OrderUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, haptic } = props;
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
    if (correct) { onCorrect(); haptic(12); } else haptic([30, 40, 30]);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>
      <div className="mt-5 min-h-16 rounded-2xl border-2 border-dashed border-line p-3">
        {picked.length === 0 && <span className="text-sm text-muted">{t.orderHint}</span>}
        {picked.map((k, i) => (
          <button key={k} onClick={() => unpick(k)} className="m-1 rounded-xl border-2 border-primary bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            <span className="mr-1 opacity-60">{i + 1}.</span>{bank.find((b) => b.key === k)?.word}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {bank.filter((b) => !picked.includes(b.key)).map((b) => (
          <button key={b.key} onClick={() => pick(b.key)} className="rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-sm font-semibold">
            {b.word}
          </button>
        ))}
      </div>
      <div className="mt-auto pt-5">
        {revealed && <p className="mb-3 rounded-xl bg-surface2 p-3 text-sm text-muted">{q.explanation ?? t.correct + ": " + items.join(" → ")}</p>}
        {!revealed ? (
          <Button className="w-full" size="lg" disabled={picked.length !== items.length} onClick={check}>{t.finish}</Button>
        ) : (
          <Button className="w-full" size="lg" onClick={onNext}>{isLast ? t.finish : t.next}</Button>
        )}
      </div>
    </div>
  );
}

/* ---------- Bo'sh joyni to'ldirish ---------- */
function FillUI(props: { q: Question; onNext: () => void; isLast: boolean; onCorrect: () => void; haptic: (p: number | number[]) => void }) {
  const { q, onNext, isLast, onCorrect, haptic } = props;
  const t = useStrings();
  const bank = useMemo(() => shuffle([q.answerText ?? "", ...(q.extra ?? [])].map((w, i) => ({ key: i, word: w }))), [q]);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.question}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{q.prompt}</h1>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {bank.map((b) => {
          const correct = revealed && b.word === q.answerText;
          return (
            <button
              key={b.key}
              onClick={() => {
                if (revealed) return;
                setRevealed(true);
                if (b.word === q.answerText) { onCorrect(); haptic(12); } else haptic([30, 40, 30]);
              }}
              className={cn(
                "rounded-2xl border-2 bg-surface px-5 py-3 text-base font-semibold transition-colors",
                correct ? "border-success bg-success/10 text-success" : revealed ? "border-line opacity-50" : "border-line active:border-primary",
              )}
            >
              {b.word}
            </button>
          );
        })}
      </div>
      <Footer revealed={revealed} explanation={q.explanation} onNext={onNext} isLast={isLast} />
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
