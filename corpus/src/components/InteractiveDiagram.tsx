"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn } from "lucide-react";
import { COLOR_PALETTE } from "@/data/colorDiagrams";

interface LegendItem {
  n: string;
  name: string;
}

/** HEX rangni RGB ga aylantiradi. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const PALETTE_RGB = COLOR_PALETTE.map(hexToRgb);

/** Pikselni eng yaqin palitra rangiga solishtiradi (indeks qaytaradi, mos bo'lmasa -1). */
function nearestPaletteIndex(r: number, g: number, b: number): number {
  // Oq fon (juda ochiq) — qism emas.
  if (r > 235 && g > 235 && b > 235) return -1;
  // Kulrang/kuchsiz rang — qism emas.
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  if (mx - mn < 28) return -1;

  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < PALETTE_RGB.length; i++) {
    const [pr, pg, pb] = PALETTE_RGB[i];
    const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  // Tolerantlik chegarasi — juda uzoq bo'lsa qism emas.
  return bestDist <= 110 ** 2 ? best : -1;
}

/**
 * Interaktiv diagramma — rasmdagi qism ustiga bosilganda nomini ko'rsatadi.
 * Rasm har bir qism alohida rangda bo'yalgan bo'lishi kerak (rangli diagramma).
 * Piksel rangi → palitra → legend qismi aniqlanadi.
 */
export function InteractiveDiagram(props: {
  baseSrc: string;
  displaySrc: string;
  legend: LegendItem[];
  onPartTap: (n: string) => void;
  onZoom: () => void;
}) {
  const { baseSrc, displaySrc, legend, onPartTap, onZoom } = props;

  const imgRef = useRef<HTMLImageElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const [label, setLabel] = useState<{ x: number; y: number; items: LegendItem[] } | null>(null);
  const labelTimer = useRef<number | null>(null);

  // Asosiy (barcha qism rangli) rasmni yashirin canvasga chizamiz — piksel o'qish uchun.
  useEffect(() => {
    const img = new Image();
    img.src = baseSrc;
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      offRef.current = c;
    };
  }, [baseSrc]);

  const showLabel = (x: number, y: number, items: LegendItem[]) => {
    setLabel({ x, y, items });
    if (labelTimer.current) window.clearTimeout(labelTimer.current);
    labelTimer.current = window.setTimeout(() => setLabel(null), 2600);
  };

  const onTap = (e: React.PointerEvent) => {
    const img = imgRef.current;
    const off = offRef.current;
    if (!img || !off) return;

    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Ko'rsatilgan o'lchamdan tabiiy (canvas) pikselga o'tkazish.
    const sx = (e.clientX - rect.left) * (off.width / rect.width);
    const sy = (e.clientY - rect.top) * (off.height / rect.height);
    const ctx = off.getContext("2d");
    if (!ctx) return;

    const x = Math.max(0, Math.min(off.width - 1, Math.round(sx)));
    const y = Math.max(0, Math.min(off.height - 1, Math.round(sy)));

    // 3×3 maydon o'rtachasi (shovqinni kamaytiradi).
    let bestIdx = -1;
    let bestScore = 0;
    const scores = new Map<number, number>();
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        try {
          const p = ctx.getImageData(x + dx, y + dy, 1, 1).data;
          const idx = nearestPaletteIndex(p[0], p[1], p[2]);
          if (idx >= 0) {
            scores.set(idx, (scores.get(idx) ?? 0) + 1);
            if ((scores.get(idx) ?? 0) > bestScore) {
              bestScore = scores.get(idx)!;
              bestIdx = idx;
            }
          }
        } catch {
          /* no-op */
        }
      }
    }

    if (bestIdx < 0) return;

    // Palitra indeksi → legend qatorlari (rang 12 tadan takrorlanadi).
    const items = legend.filter((_, i) => i % 12 === bestIdx);
    if (items.length === 0) return;

    // Yorliqni bosilgan joyda ko'rsatish (ekran koordinatasi).
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    showLabel(relX, relY, items);

    // Asosiy qismga o'tish (faqat o'sha qism rangli bo'ladi).
    onPartTap(items[0].n);
  };

  return (
    <div className="relative mt-4 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <img
        ref={imgRef}
        src={displaySrc}
        alt=""
        draggable={false}
        onPointerDown={onTap}
        className="block w-full cursor-pointer select-none"
        style={{ touchAction: "manipulation" }}
      />

      {/* kattalashtirish tugmasi */}
      <button
        onClick={onZoom}
        aria-label="zoom"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
      >
        <ZoomIn className="h-4 w-4" aria-hidden />
      </button>

      {/* chiqadigan nom yorlig'i */}
      <AnimatePresence>
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute z-10 max-w-[70%] rounded-xl bg-black/85 px-3 py-2 text-white shadow-pop"
            style={{
              left: Math.min(label.x, 999) ,
              top: Math.max(0, label.y - 12),
              transform: "translate(-50%, -100%)",
            }}
          >
            {label.items.map((it, i) => (
              <div key={i} className={i > 0 ? "mt-0.5" : ""}>
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-white/20 px-1 text-[10px] font-bold">
                  {it.n}
                </span>{" "}
                <span className="text-[13px] font-semibold">{it.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
