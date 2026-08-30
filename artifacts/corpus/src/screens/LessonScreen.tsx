"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lightbox } from "@/components/ui/Lightbox";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useHaptics } from "@/hooks/useHaptics";
import { useAppStore } from "@/store/useAppStore";
import { lessonById, unitOfLesson, sortByDifficulty, type Lesson } from "@/data/content";
import { colorForLegendN } from "@/data/colorDiagrams";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";
import { questionKey } from "@/utils/srs";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Dars ekrani: kirish slaydlari → savollar (8 tur) → natija.
 */
export function LessonScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const back = useAppStore((s) => s.back);
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
  const [flashDone, setFlashDone] = useState(false);

  if (!lesson || !unit) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">{t.errEmpty}</p>
        <Button onClick={() => back()}>« {t.backToTopics}</Button>
      </div>
    );
  }

  const slides = lesson.slides ?? [];
  const hasFlash = !!lesson.flashcards && lesson.flashcards.length > 0;
  const inFlash = hasFlash && !flashDone;
  const inSlides = !inFlash && slideIdx < slides.length;
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
          onClick={() => back()}
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
          {inFlash ? t.flashTitle : inSlides ? 0 : `${idx + 1}/${total}`}
        </span>
      </header>

      {inFlash ? (
        <FlashcardDeck cards={lesson.flashcards!} onDone={() => setFlashDone(true)} />
      ) : inSlides ? (
        <SlideView
          lesson={lesson}
          slide={slides[slideIdx]}
          slideNo={slideIdx + 1}
          slideTotal={slides.length}
          onNext={() => setSlideIdx((i) => i + 1)}
          onQuit={() => back()}
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
  slide: {
    title: string;
    text: string;
    img?: string;
    cap?: string;
    legend?: { n: string; name: string }[];
    highlights?: Record<string, string>;
  };
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
  const [selected, setSelected] = useState<string | null>(null);
  // Rangli diagramma slaydi — legend qatorlari rangli bo'ladi va bosilgan qism ajratib ko'rsatiladi.
  const isColor = (slide.img ?? "").startsWith("/img/color/");

  // Tanlangan qism bo'lsa — faqat o'sha qism rangli rasm, aks holda to'liq rangli diagramma.
  const displayImg = selected && slide.highlights?.[selected] ? slide.highlights[selected] : slide.img;
  const activeN = isColor ? selected : find;
  const activeName = activeN ? (slide.legend?.find((l) => l.n === activeN)?.name ?? null) : null;

  const onLegendTap = (n: string) => {
    if (isColor) {
      setSelected((cur) => (cur === n ? null : n)); // qayta bossa — to'liq rasmga qaytadi
    } else {
      setFind(n);
      setZoom(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{lesson.title}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug">{slide.title}</h1>
      </div>

      {displayImg && (
        isColor && slide.legend ? (
          <InteractiveDiagram
            baseSrc={slide.img!}
            displaySrc={displayImg}
            legend={slide.legend}
            highlights={slide.highlights}
            onPartTap={(n) => setSelected(n)}
            onZoom={() => setZoom(true)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={t.zoomHint}
            className="group relative mt-4 block w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card"
          >
            <span className="relative mx-auto block w-fit max-w-full">
              <img src={displayImg} alt={slide.title} className="max-h-56 max-w-full object-contain" />
              <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
                <ZoomIn className="h-4 w-4" aria-hidden />
              </span>
            </span>
          </button>
        )
      )}

      {/* tanlangan qism belgisi */}
      {isColor && selected && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          <span
            className="flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-bold text-white"
            style={{ background: colorForLegendN(selected) ?? "#6C5CE7" }}
          >
            {selected}
          </span>
          {activeName}
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      {slide.legend && slide.legend.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-surface2 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            {isColor ? t.colorLegend : t.imageParts}
            <span className="ml-1 font-normal normal-case text-muted">— {isColor ? t.colorLegendHint : t.tapToFind}</span>
          </p>
          <ul className="grid max-h-52 grid-cols-1 gap-1 overflow-y-auto pr-1">
            {slide.legend.map((it, i) => {
              const color = isColor ? colorForLegendN(it.n) : null;
              const isSelected = isColor && selected === it.n;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => onLegendTap(it.n)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-lg px-1 py-0.5 text-left text-[13px] leading-snug transition-colors hover:bg-primary/10",
                      isSelected && "bg-primary/15 ring-1 ring-primary",
                    )}
                  >
                    {color ? (
                      <span
                        className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1 text-[11px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {it.n}
                      </span>
                    ) : (
                      <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 px-1 text-[11px] font-bold text-primary">
                        {it.n}
                      </span>
                    )}
                    <span className="text-ink">{it.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {zoom && displayImg && (
        <Lightbox
          src={displayImg}
          alt={slide.title}
          onClose={() => {
            setZoom(false);
            setFind(null);
          }}
          labels={{ close: t.zoomClose, zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.zoomReset, list: t.legendList }}
          banner={activeName ? t.findPart.replace("{n}", activeN ?? "").replace("{name}", activeName) : undefined}
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

