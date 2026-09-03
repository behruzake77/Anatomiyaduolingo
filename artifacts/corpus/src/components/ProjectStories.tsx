"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { PROJECT_STORIES, type ProjectStory } from "@/data/projectStories";
import { Sticker3D } from "@/components/ui/Sticker3D";

export function ProjectStories() {
  const [activeStory, setActiveStory] = useState<ProjectStory | null>(null);
  const [page, setPage] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activePage = activeStory?.pages[page];

  useEffect(() => {
    if (!activeStory) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveStory(null);
      if (event.key === "ArrowLeft") changePage(-1);
      if (event.key === "ArrowRight") changePage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      if (page < activeStory.pages.length - 1) setPage((value) => value + 1);
      else setActiveStory(null);
    }, 6000);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeStory, page]);

  const openStory = (story: ProjectStory) => {
    setActiveStory(story);
    setPage(0);
  };

  const changePage = (direction: 1 | -1) => {
    if (!activeStory) return;
    if (direction === 1 && page === activeStory.pages.length - 1) {
      setActiveStory(null);
      return;
    }
    if (direction === -1 && page === 0) {
      setActiveStory(null);
      return;
    }
    setPage((value) => value + direction);
  };

  return (
    <>
      <section aria-label="Project Stories" className="mt-4">
        <div className="-mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PROJECT_STORIES.map((story) => {
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(story)}
                className="flex w-[76px] shrink-0 snap-start flex-col items-center gap-1.5 text-center transition-transform active:scale-95"
                aria-label={`${story.label} storiesini ochish`}
              >
                <span className="project-story-ring rounded-full p-[3px] shadow-soft" style={{ background: `linear-gradient(135deg, ${story.color}, #FD79A8 50%, #F5C04E)` }}>
                  <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-bg bg-surface" style={{ color: story.color }}>
                    <img src={story.cover} alt="" loading="lazy" decoding="async" className="h-12 w-12 object-contain drop-shadow-[0_3px_7px_rgba(108,92,231,0.2)]" />
                  </span>
                </span>
                <span className="w-full truncate text-[10px] font-semibold leading-tight text-ink">{story.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {activeStory && activePage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveStory(null)}
            onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return;
              const distanceX = event.changedTouches[0].clientX - touchStart.current.x;
              const distanceY = event.changedTouches[0].clientY - touchStart.current.y;
              if (distanceY > 70 && Math.abs(distanceY) > Math.abs(distanceX)) {
                event.preventDefault();
                setActiveStory(null);
              } else if (Math.abs(distanceX) > 48) {
                event.preventDefault();
                changePage(distanceX < 0 ? 1 : -1);
              }
              touchStart.current = null;
            }}
          >
            <motion.div
              className="relative h-[min(720px,calc(100vh-32px))] w-full max-w-md overflow-hidden rounded-[30px] bg-black text-white shadow-2xl"
              initial={{ scale: 0.94, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div key={`${activeStory.id}-${page}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <img src={activePage.image} alt="" className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute left-4 right-4 top-4 z-10 flex gap-1.5" aria-label={`Story ${page + 1} / ${activeStory.pages.length}`}>
                {activeStory.pages.map((_, item) => (
                  <span key={item} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
                    <span className={`block h-full rounded-full bg-white ${item < page ? "w-full" : item === page ? "story-progress-active" : "w-0"}`} />
                  </span>
                ))}
              </div>
              <div className="absolute left-5 top-9 z-10 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <Sticker3D src={activeStory.cover} size={31} round />
                </span>
                {activeStory.label}
              </div>
              <button type="button" onClick={() => setActiveStory(null)} aria-label="Storyni yopish" className="absolute right-4 top-9 z-10 rounded-full bg-black/30 p-2"><X className="h-5 w-5" /></button>
              <Sticker3D
                src={activeStory.cover}
                size={92}
                className="pointer-events-none absolute right-5 top-24 z-10 opacity-90 drop-shadow-[0_8px_18px_rgba(0,0,0,0.32)]"
                round
              />

              <button type="button" aria-label="Oldingi story" onClick={() => changePage(-1)} className="absolute inset-y-20 left-0 z-10 w-1/3" />
              <button type="button" aria-label="Keyingi story" onClick={() => changePage(1)} className="absolute inset-y-20 right-0 z-10 w-2/3" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-8">
                <p className="mb-2 text-2xl font-extrabold leading-tight">{activePage.title}</p>
                <p className="text-sm leading-relaxed text-white/85">{activePage.text}</p>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={() => changePage(-1)} aria-label="Oldingi story" className="rounded-full bg-white/15 p-3"><ArrowLeft className="h-5 w-5" /></button>
                  <span className="text-xs font-semibold text-white/60">{page + 1} / {activeStory.pages.length}</span>
                  <button type="button" onClick={() => changePage(1)} aria-label="Keyingi story" className="rounded-full bg-white/15 p-3"><ArrowRight className="h-5 w-5" /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
