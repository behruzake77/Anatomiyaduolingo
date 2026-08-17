"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lightbox } from "@/components/ui/Lightbox";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppStore } from "@/store/useAppStore";
import { lessonById, unitOfLesson, sortByDifficulty, type Lesson } from "@/data/content";
import { questionKey } from "@/utils/srs";
import { useStrings } from "@/i18n";

/**
 * Dars ekrani: kirish slaydlari → savollar (8 tur) → natija.
 */
export function LessonScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const activeLessonId = useAppStore((s) => s.activeLessonId);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
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
        <QuestionCard
          key={`${lesson.id}-${idx}`}
          q={q}
          qKey={questionKey(lesson.id, idx)}
          onCorrect={() => {
            setScore((s) => s + 1);
            // Agar bu savol avval xato bo'lgan bo'lsa — kartani bir quti yuqoriga ko'tarish.
            recordAnswer(questionKey(lesson.id, idx), true);
          }}
          onWrong={() => recordAnswer(questionKey(lesson.id, idx), false)}
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
          labels={{ close: t.zoomClose, zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.zoomReset, list: t.legendList }}
          banner={findName ? t.findPart.replace("{n}", find ?? "").replace("{name}", findName) : undefined}
          legend={slide.legend}
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

