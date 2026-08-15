"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { SkipBack, Play, Pause, SkipForward, RotateCcw, Box } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { ATLAS_OBJECTS } from "@/data/anatomy";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

/**
 * Interactive 3D-style viewer: drag to rotate the model,
 * auto-rotate on play, plus prev/next controls.
 */
export function StudyModeScreen() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const obj = ATLAS_OBJECTS[index % ATLAS_OBJECTS.length];

  const rotate = useMotionValue(0);
  const smooth = useSpring(rotate, { stiffness: 120, damping: 20 });
  const dragging = useRef(false);
  const lastX = useRef(0);

  // auto-rotation
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => rotate.set(rotate.get() + 2), 40);
    return () => clearInterval(id);
  }, [playing, rotate]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    setPlaying(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rotate.set(rotate.get() + dx * 0.6);
  };
  const onPointerUp = () => (dragging.current = false);

  const reset = () => rotate.set(0);

  return (
    <Screen padded={false}>
      <TopBar
        title={obj.name}
        right={
          <button
            onClick={reset}
            aria-label={t.resetRotation}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        }
      />

      <div className="px-5 pb-28">
        {/* 3D stage */}
        <div
          className="relative mt-2 h-72 touch-none overflow-hidden rounded-3xl border border-line bg-surface2 shadow-card"
          style={{ perspective: 1200 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          aria-label={t.drag}
          role="img"
        >
          <motion.img
            src={obj.image}
            alt={obj.name}
            draggable={false}
            className="mx-auto h-full w-auto select-none object-contain drop-shadow-2xl"
            style={{ rotateY: smooth }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white">
            {t.drag}
          </span>
        </div>

        {/* info */}
        <div className="mt-5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-semibold">{obj.name}</h2>
            <span className="text-sm italic text-primary">{obj.latin}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{obj.description}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
            {t.functionLabel}: {obj.function}
          </p>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => setIndex((i) => (i - 1 + ATLAS_OBJECTS.length) % ATLAS_OBJECTS.length)}
            aria-label={t.prevModel}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-card active:scale-95"
          >
            <SkipBack className="h-5 w-5" aria-hidden />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t.pause : t.play}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-pop active:scale-95"
          >
            {playing ? <Pause className="h-7 w-7" aria-hidden /> : <Play className="h-7 w-7" aria-hidden />}
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % ATLAS_OBJECTS.length)}
            aria-label={t.nextModel}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-card active:scale-95"
          >
            <SkipForward className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* real 3D modellar (suyaklar) */}
        <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate("models3d")}>
          <Box className="h-5 w-5" aria-hidden /> {t.models3d}
        </Button>
      </div>
    </Screen>
  );
}
