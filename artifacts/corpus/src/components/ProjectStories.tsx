"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Info, X } from "lucide-react";

const STORIES = [
  {
    title: "Anatomiyani oson o‘rganing",
    text: "AnatomiyaDuolingo — tibbiyot talabalariga anatomiya fanini qiziqarli va tushunarli o‘rganishga yordam beradigan loyiha.",
    image: "/img/atlas/miya.jpg",
    color: "#6C5CE7",
    icon: <Info className="h-5 w-5" />,
  },
  {
    title: "Bo‘limlar bilan tanishing",
    text: "Suyaklar, mushaklar, bo‘g‘imlar, ichki a’zolar va boshqa tizimlarni bosqichma-bosqich o‘rganing.",
    image: "/img/atlas/skelet.jpg",
    color: "#00B894",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Rasm va atlaslar",
    text: "Har bir mavzu rangli anatomik rasmlar, lotincha atamalar va qisqa tushuntirishlar bilan beriladi.",
    image: "/img/atlas/myologia.jpg",
    color: "#EC4899",
    icon: <span className="text-lg">✦</span>,
  },
  {
    title: "Qanday ishlaydi?",
    text: "Mavzuni tanlang, darsni o‘ting va quiz savollariga javob bering. To‘g‘ri javoblar bilan bilim va XP to‘plang.",
    image: "/img/atlas/yurak.jpg",
    color: "#F59E0B",
    icon: <Check className="h-5 w-5" />,
  },
];

export function ProjectStories() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const story = STORIES[index];

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (index < STORIES.length - 1) setIndex((value) => value + 1);
      else setOpen(false);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [open, index]);

  const show = (next: number) => {
    if (next < 0) setIndex(STORIES.length - 1);
    else if (next >= STORIES.length) setOpen(false);
    else setIndex(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setIndex(0); setOpen(true); }}
        className="group mt-4 flex items-center gap-3 text-left"
        aria-label="Loyiha haqida hikoyalarni ochish"
      >
        <span className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FD79A8] via-[#6C5CE7] to-[#00B894] p-[3px] shadow-pop transition-transform group-active:scale-95">
          <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-bg bg-surface text-primary">
            <span className="text-2xl">🫀</span>
          </span>
        </span>
        <span>
          <span className="block text-sm font-bold">Loyihamiz haqida</span>
          <span className="mt-0.5 block text-xs text-muted">Qanday ishlashini bilib oling · 4 ta hikoya</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative h-[min(720px,calc(100vh-32px))] w-full max-w-md overflow-hidden rounded-[30px] bg-black text-white shadow-2xl"
              initial={{ scale: 0.94, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div key={index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <img src={story.image} alt="" className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/90" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute left-4 right-4 top-4 z-10 flex gap-1.5">
                {STORIES.map((_, item) => <span key={item} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"><span className={`block h-full rounded-full bg-white ${item < index ? "w-full" : item === index ? "w-1/2" : "w-0"}`} /></span>)}
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Yopish" className="absolute right-4 top-9 z-10 rounded-full bg-black/30 p-2"><X className="h-5 w-5" /></button>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: story.color }}>{story.icon}</div>
                <p className="mb-2 text-2xl font-extrabold leading-tight">{story.title}</p>
                <p className="text-sm leading-relaxed text-white/85">{story.text}</p>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={() => show(index - 1)} className="rounded-full bg-white/15 p-3 disabled:opacity-30" disabled={index === 0} aria-label="Oldingi hikoya"><ArrowLeft className="h-5 w-5" /></button>
                  <span className="text-xs font-semibold text-white/60">{index + 1} / {STORIES.length}</span>
                  <button type="button" onClick={() => show(index + 1)} className="rounded-full bg-white/15 p-3" aria-label="Keyingi hikoya"><ArrowRight className="h-5 w-5" /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
