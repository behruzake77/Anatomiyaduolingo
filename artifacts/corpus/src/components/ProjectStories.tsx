"use client";

/**
 * Bosh sahifadagi Instagram uslubidagi «Hikoyalar» (Project Stories).
 *
 *  - Rangli halqa = hali ko'rilmagan story; kulrang = ko'rilgan (localStorage'da saqlanadi,
 *    story `version`i oshsa yana «yangi» bo'ladi).
 *  - Ko'rilmaganlar ro'yxat boshiga chiqadi.
 *  - Ko'ruvchi: avto-o'tish, bosib turganda pauza, chap/o'ng bosish, swipe (chap/o'ng — sahifa,
 *    pastga — yopish), klaviatura (←/→/Esc/Space), bir storydan keyingisiga avtomatik o'tish.
 *  - Keyingi sahifa rasmi oldindan yuklanadi, shuning uchun almashish silliq.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, Pause, Pointer, X } from "lucide-react";
import {
  PROJECT_STORIES,
  STORY_PAGE_DURATION,
  type ProjectStory,
  type ProjectStoryPage,
  type StoryCta,
  type StoryText,
} from "@/data/projectStories";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/utils/cn";

const SEEN_KEY = "corpus-stories-seen";
const SWIPE_X = 48;
const SWIPE_DOWN = 80;
const HOLD_DELAY = 180;

type SeenMap = Record<string, number>;

function readSeen(): SeenMap {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as SeenMap) : {};
  } catch {
    return {};
  }
}

function writeSeen(map: SeenMap) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(map));
  } catch {
    /* no-op */
  }
}

function pick(text: StoryText, lang: "uz" | "en"): string {
  return lang === "en" ? text.en : text.uz;
}

function preload(src: string) {
  if (typeof window === "undefined") return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export function ProjectStories() {
  const t = useStrings();
  const lang = useAppStore((s) => s.settings.language);
  const [seen, setSeen] = useState<SeenMap>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // localStorage faqat mount'dan keyin o'qiladi (SSR/hydration xavfsiz).
  useEffect(() => {
    setSeen(readSeen());
  }, []);

  const isSeen = useCallback((story: ProjectStory) => (seen[story.id] ?? 0) >= story.version, [seen]);

  // Ko'rilmaganlar oldinda, qolganlari asl tartibda.
  const ordered = useMemo(() => {
    const unseen = PROJECT_STORIES.filter((s) => !isSeen(s));
    const rest = PROJECT_STORIES.filter((s) => isSeen(s));
    return [...unseen, ...rest];
  }, [isSeen]);

  const unseenCount = ordered.filter((s) => !isSeen(s)).length;

  const markSeen = useCallback((story: ProjectStory) => {
    setSeen((prev) => {
      if ((prev[story.id] ?? 0) >= story.version) return prev;
      const next = { ...prev, [story.id]: story.version };
      writeSeen(next);
      return next;
    });
  }, []);

  // Ko'ruvchi ochiq bo'lganda tartib o'zgarib ketmasligi uchun ro'yxat «muzlatiladi».
  const [frozen, setFrozen] = useState<ProjectStory[] | null>(null);
  const openAt = (index: number) => {
    setFrozen(ordered);
    setActiveIndex(index);
  };
  const close = () => {
    setActiveIndex(null);
    setFrozen(null);
  };

  const list = frozen ?? ordered;

  return (
    <>
      <section aria-label={t.storiesTitle} className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.storiesTitle}</h2>
          {unseenCount > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">
              {fmt(t.storiesNewCount, { n: unseenCount })}
            </span>
          )}
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ordered.map((story) => {
            const viewed = isSeen(story);
            return (
              <StoryBubble
                key={story.id}
                story={story}
                label={pick(story.label, lang)}
                viewed={viewed}
                onClick={() => openAt(ordered.indexOf(story))}
                ariaLabel={fmt(t.storyOpenAria, { name: pick(story.label, lang) })}
              />
            );
          })}
        </div>
      </section>

      {activeIndex !== null && list[activeIndex] && (
        <StoryViewer
          stories={list}
          startIndex={activeIndex}
          lang={lang}
          onSeen={markSeen}
          onClose={close}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Muqova halqasi                                                     */
/* ------------------------------------------------------------------ */

function StoryBubble({
  story,
  label,
  viewed,
  onClick,
  ariaLabel,
}: {
  story: ProjectStory;
  label: string;
  viewed: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex w-[74px] shrink-0 snap-start flex-col items-center gap-1.5 text-center transition-transform active:scale-95"
    >
      <span
        className={cn(
          "relative rounded-full p-[3px] transition-shadow",
          viewed ? "bg-line" : "story-ring-live shadow-soft",
        )}
        style={
          viewed
            ? undefined
            : ({ "--story-ring": `conic-gradient(from 180deg, ${story.color}, #FD79A8, #F5C04E, ${story.color})` } as React.CSSProperties)
        }
      >
        <span className="block overflow-hidden rounded-full border-[3px] border-bg bg-surface">
          <img
            src={story.cover}
            alt=""
            width={60}
            height={60}
            loading="lazy"
            decoding="async"
            className={cn("h-[60px] w-[60px] object-cover transition-opacity", viewed && "opacity-80 saturate-[.85]")}
          />
        </span>
        {!viewed && (
          <span
            className="absolute -right-0.5 bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-bg"
            style={{ backgroundColor: story.color }}
            aria-hidden
          />
        )}
      </span>
      <span className={cn("w-full truncate text-[10.5px] font-semibold leading-tight", viewed ? "text-muted" : "text-ink")}>
        {label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  To'liq ekranli ko'ruvchi                                           */
/* ------------------------------------------------------------------ */

function StoryViewer({
  stories,
  startIndex,
  lang,
  onSeen,
  onClose,
}: {
  stories: ProjectStory[];
  startIndex: number;
  lang: "uz" | "en";
  onSeen: (story: ProjectStory) => void;
  onClose: () => void;
}) {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const openSystem = useAppStore((s) => s.openSystem);
  const openLesson = useAppStore((s) => s.openLesson);
  const haptic = useHaptics();

  const [storyIndex, setStoryIndex] = useState(startIndex);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 joriy sahifa uchun
  const [direction, setDirection] = useState<1 | -1>(1);

  // Pastki matn blokining balandligi — telefon ramkasi shu joyni bo'sh qoldiradi.
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const [textHeight, setTextHeight] = useState(200);
  useEffect(() => {
    const el = textBlockRef.current;
    if (!el) return;
    const measure = () => setTextHeight(Math.round(el.getBoundingClientRect().height));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const story = stories[storyIndex];
  const current = story.pages[page];
  const duration = current.duration ?? STORY_PAGE_DURATION;

  // --- Taymer (rAF asosida, pauza-qayta davom ettirishni qo'llab-quvvatlaydi)
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    if (page < story.pages.length - 1) {
      setPage((p) => p + 1);
      return;
    }
    onSeen(story);
    if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setPage(0);
    } else {
      onClose();
    }
  }, [page, story, storyIndex, stories.length, onSeen, onClose]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    // Sahifa hozirgina boshlangan bo'lsa — oldingi sahifaga, aks holda shu sahifani boshidan.
    if (elapsedRef.current > 1200) {
      elapsedRef.current = 0;
      setProgress(0);
      return;
    }
    if (page > 0) {
      setPage((p) => p - 1);
      return;
    }
    if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1];
      setStoryIndex((i) => i - 1);
      setPage(prevStory.pages.length - 1);
    } else {
      elapsedRef.current = 0;
      setProgress(0);
    }
  }, [page, storyIndex, stories]);

  // Sahifa almashganda taymerni nolga tushiramiz.
  useEffect(() => {
    elapsedRef.current = 0;
    lastTickRef.current = null;
    setProgress(0);
  }, [storyIndex, page]);

  // Yagona rAF sikli; `paused` bo'lsa vaqt o'tmaydi.
  useEffect(() => {
    if (paused) {
      lastTickRef.current = null;
      return;
    }
    let finished = false;
    const tick = (now: number) => {
      if (finished) return;
      if (lastTickRef.current === null) lastTickRef.current = now;
      elapsedRef.current += now - lastTickRef.current;
      lastTickRef.current = now;
      const ratio = Math.min(1, elapsedRef.current / duration);
      setProgress(ratio);
      if (ratio >= 1) {
        finished = true;
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      finished = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, duration, goNext]);

  // Oxirgi sahifagacha yetgan story «ko'rilgan» hisoblanadi (yopib yuborsa ham).
  useEffect(() => {
    if (page === story.pages.length - 1) onSeen(story);
  }, [page, story, onSeen]);

  // Joriy story ochilganda uning barcha ekran skrinshotlari (kichik fayllar) oldindan yuklanadi —
  // telefon ramkasi hech qachon bo'sh ko'rinmasin.
  useEffect(() => {
    story.pages.forEach((pg) => {
      if (pg.screen) preload(pg.screen);
    });
  }, [story]);

  // Keyingi sahifa rasmlarini (fon + ekran) oldindan yuklash.
  useEffect(() => {
    const nextPage = story.pages[page + 1] ?? stories[storyIndex + 1]?.pages[0];
    if (!nextPage) return;
    preload(nextPage.image);
    if (nextPage.screen) preload(nextPage.screen);
  }, [story, page, stories, storyIndex]);

  // Body scroll qulf + klaviatura + ilova fonga o'tsa pauza.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") goPrev();
      else if (event.key === "ArrowRight") goNext();
      else if (event.key === " ") {
        event.preventDefault();
        setPaused((p) => !p);
      }
    };
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.style.overflow = previousOverflow;
    };
  }, [goNext, goPrev, onClose]);

  // --- Pointer: bosib turish = pauza; qisqa bosish = chap/o'ng; swipe = sahifa / yopish.
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);

  const clearHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    pointerStart.current = { x: event.clientX, y: event.clientY, t: performance.now() };
    heldRef.current = false;
    clearHold();
    holdTimer.current = window.setTimeout(() => {
      heldRef.current = true;
      setPaused(true);
    }, HOLD_DELAY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    clearHold();
    const start = pointerStart.current;
    pointerStart.current = null;
    const wasHeld = heldRef.current;
    heldRef.current = false;
    if (wasHeld) setPaused(false);
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (dy > SWIPE_DOWN && Math.abs(dy) > Math.abs(dx)) {
      onClose();
      return;
    }
    if (Math.abs(dx) > SWIPE_X && Math.abs(dx) > Math.abs(dy)) {
      haptic(8);
      if (dx < 0) goNext();
      else goPrev();
      return;
    }
    if (wasHeld) return; // uzoq bosish — navigatsiya emas
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const target = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - target.left) / target.width;
      haptic(6);
      if (ratio < 0.33) goPrev();
      else goNext();
    }
  };

  const onPointerCancel = () => {
    clearHold();
    pointerStart.current = null;
    if (heldRef.current) setPaused(false);
    heldRef.current = false;
  };

  const handleCta = (cta: StoryCta) => {
    onSeen(story);
    onClose();
    if (cta.lessonId) openLesson(cta.lessonId);
    else if (cta.systemId) openSystem(cta.systemId);
    else if (cta.screen) navigate(cta.screen);
  };

  const label = pick(story.label, lang);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <motion.div
        className="story-viewer relative h-full w-full max-w-md select-none overflow-hidden bg-[#141222] text-white shadow-2xl sm:h-[min(760px,calc(100vh-32px))] sm:rounded-[28px]"
        initial={{ scale: 0.94, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerCancel}
        onContextMenu={(event) => event.preventDefault()}
        style={{ touchAction: "none" }}
      >
        {/* Fon rasmi */}
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={`${story.id}-${page}`}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0, scale: 1.04, x: direction * 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: direction * -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ken Burns — sekin yaqinlashish (ekranli sahifada fon xiraroq va tinchroq) */}
            <motion.img
              src={current.image}
              alt=""
              draggable={false}
              decoding="async"
              className={cn("h-full w-full object-cover", current.screen && "opacity-60")}
              style={{ backgroundColor: "#141222" }}
              initial={{ scale: 1 }}
              animate={{ scale: paused ? 1.03 : current.screen ? 1.05 : 1.08 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/95",
                current.screen ? "via-30%" : "via-40%",
              )}
            />
            {current.screen && (
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(60% 45% at 50% 42%, ${story.color}33 0%, transparent 70%)` }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ilova ekrani — telefon ramkasida, «shu yerni bosing» belgisi bilan */}
        <AnimatePresence mode="wait" initial={false}>
          {current.screen && (
            <PhoneMock
              key={`${story.id}-${page}-phone`}
              page={current}
              color={story.color}
              paused={paused}
              bottomReserve={textHeight}
            />
          )}
        </AnimatePresence>

        {/* Yuqori panel: progress + muallif + yopish */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="flex gap-1" aria-label={`${page + 1} / ${story.pages.length}`}>
            {story.pages.map((_, i) => (
              <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                <span
                  className="block h-full rounded-full bg-white"
                  style={{
                    width: i < page ? "100%" : i === page ? `${progress * 100}%` : "0%",
                    transition: i === page ? "none" : "width .2s",
                  }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <span
              className="rounded-full p-[2px]"
              style={{ backgroundImage: `conic-gradient(from 180deg, ${story.color}, #FD79A8, #F5C04E, ${story.color})` }}
            >
              <img src={story.cover} alt="" className="h-8 w-8 rounded-full border-2 border-black/40 object-cover" draggable={false} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight drop-shadow">{label}</p>
              <p className="text-[11px] font-medium text-white/70">
                CORPUS · {storyIndex + 1}/{stories.length}
              </p>
            </div>
            <AnimatePresence>
              {paused && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[11px] font-semibold"
                >
                  <Pause className="h-3 w-3" aria-hidden /> {t.storyPaused}
                </motion.span>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={onClose}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              aria-label={t.storyClose}
              className="pointer-events-auto rounded-full bg-black/35 p-2 backdrop-blur-sm transition active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Pastki matn bloki */}
        <div
          ref={textBlockRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 pb-[max(20px,env(safe-area-inset-bottom))]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${story.id}-${page}-text`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {current.kicker && (
                <span
                  className="mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: `${story.color}D9` }}
                >
                  {pick(current.kicker, lang)}
                </span>
              )}
              <p
                className={cn(
                  "font-extrabold leading-[1.15] drop-shadow-md",
                  current.screen ? "text-[22px]" : "text-[26px]",
                )}
              >
                {pick(current.title, lang)}
              </p>
              <p
                className={cn(
                  "mt-1.5 leading-relaxed text-white/88",
                  current.screen ? "text-[13.5px]" : "text-[15px]",
                )}
              >
                {pick(current.text, lang)}
              </p>
              {current.tips && current.tips.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {current.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] leading-snug text-white/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: story.color }} aria-hidden />
                      <span>{pick(tip, lang)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {current.cta && (
                <button
                  type="button"
                  onClick={() => handleCta(current.cta!)}
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerUp={(event) => event.stopPropagation()}
                  className="pointer-events-auto mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1a1230] shadow-lg transition active:scale-[.97]"
                >
                  {pick(current.cta.label, lang)}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-2 text-center text-[10px] font-medium leading-none text-white/40">{t.storyHoldHint}</p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Telefon ramkasidagi haqiqiy ilova ekrani + «shu yerni bosing»     */
/* ------------------------------------------------------------------ */

function PhoneMock({
  page,
  color,
  paused,
  bottomReserve,
}: {
  page: ProjectStoryPage;
  color: string;
  paused: boolean;
  /** Pastdagi matn blokining o'lchangan balandligi (px) — telefon shu joyni bo'sh qoldiradi. */
  bottomReserve: number;
}) {
  const hs = page.hotspot;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex justify-center"
      style={{ paddingTop: "max(84px, calc(env(safe-area-inset-top) + 72px))", bottom: bottomReserve + 8 }}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative h-full max-h-full"
        style={{ aspectRatio: "9 / 19.2" }}
        animate={paused ? { y: 0 } : { y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Ramka */}
        <div
          className="absolute inset-0 rounded-[26px] border border-white/15 bg-[#0d0c14] p-[5px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)]"
          style={{ boxShadow: `0 24px 60px -12px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.06), 0 0 48px -8px ${color}66` }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-[#f8f9fa]">
            <img
              src={page.screen}
              alt=""
              draggable={false}
              loading="eager"
              decoding="sync"
              className="absolute inset-x-0 top-0 w-full"
            />
            {/* Dinamik orol */}
            <span className="absolute left-1/2 top-1.5 h-[14px] w-[58px] -translate-x-1/2 rounded-full bg-black/90" aria-hidden />

            {/* Hotspot — «shu yerni bosing» */}
            {hs && (
              <>
                {/* Qorong'ilashtirish maskasi — hotspot atrofi biroz xira */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse ${Math.max(hs.w ?? 12, 12) * 0.9 + 12}% ${Math.max(hs.h ?? 8, 8) * 0.9 + 10}% at ${hs.x + (hs.w ?? 12) / 2}% ${hs.y + (hs.h ?? 8) / 2}%, transparent 55%, rgba(8,6,20,0.42) 100%)`,
                  }}
                />
                <motion.span
                  className="absolute rounded-xl border-2"
                  style={{
                    left: `${hs.x}%`,
                    top: `${hs.y}%`,
                    width: `${hs.w ?? 12}%`,
                    height: `${hs.h ?? 8}%`,
                    borderColor: color,
                    boxShadow: `0 0 0 3px ${color}40, 0 0 22px ${color}99`,
                  }}
                  animate={paused ? { opacity: 1 } : { opacity: [0.85, 1, 0.85], scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Barmoq belgisi — hotspotning pastki-o'ng burchagida */}
                <motion.span
                  className="absolute flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white/80"
                  style={{
                    left: `calc(${hs.x + (hs.w ?? 12)}% - 14px)`,
                    top: `calc(${hs.y + (hs.h ?? 8)}% - 6px)`,
                    backgroundColor: color,
                  }}
                  animate={paused ? { scale: 1 } : { scale: [1, 0.86, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <Pointer className="h-4 w-4" strokeWidth={2.5} />
                </motion.span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
