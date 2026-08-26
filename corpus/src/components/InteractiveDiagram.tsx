"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn } from "lucide-react";
import { COLOR_PALETTE } from "@/data/colorDiagrams";

interface LegendItem {
  n: string;
  name: string;
}

interface Marker {
  n: string;
  name: string;
  x: number; // natural koordinata (0..1)
  y: number;
}

/** HEX rangni RGB ga aylantiradi. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const PALETTE_RGB = COLOR_PALETTE.map(hexToRgb);

/** Pikselni eng yaqin palitra rangiga solishtiradi (indeks, mos bo'lmasa -1). */
function nearestPaletteIndex(r: number, g: number, b: number): number {
  if (r > 235 && g > 235 && b > 235) return -1;
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
  return bestDist <= 110 ** 2 ? best : -1;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Highlight rasmidan rangli (bo'yalgan) qismning og'irlik markazini topadi. */
function coloredCentroid(img: HTMLImageElement): { x: number; y: number } | null {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, w, h);
  } catch {
    return null;
  }
  const px = data.data;
  let sx = 0;
  let sy = 0;
  let count = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      // rangli (kulrang emas) va oq fon emas
      if (mx - mn < 30) continue;
      if (r > 240 && g > 240 && b > 240) continue;
      sx += x;
      sy += y;
      count++;
    }
  }
  if (count < 30) return null;
  return { x: sx / count / w, y: sy / count / h };
}

/**
 * Interaktiv diagramma — qismlarga RAQAM qo'yadi (ilova o'zi chizadi),
 * bosilganda nomini ko'rsatadi va faqat o'sha qismni rangli qiladi.
 */
export function InteractiveDiagram(props: {
  baseSrc: string;
  displaySrc: string;
  legend: LegendItem[];
  highlights?: Record<string, string>;
  onPartTap: (n: string) => void;
  onZoom: () => void;
}) {
  const { baseSrc, displaySrc, legend, highlights, onPartTap, onZoom } = props;

  const imgRef = useRef<HTMLImageElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const [label, setLabel] = useState<{ x: number; y: number; items: LegendItem[] } | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selected, setSelected] = useState(false);
  const labelTimer = useRef<number | null>(null);

  // Asosiy rasmni yashirin canvasga (piksel o'qish uchun) + raqam markerlarini hisoblash.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const base = await loadImage(baseSrc);
        if (!alive) return;
        const c = document.createElement("canvas");
        c.width = base.naturalWidth;
        c.height = base.naturalHeight;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(base, 0, 0);
          offRef.current = c;
        }

        // Har bir qismning joyini highlight rasmidan topamiz.
        if (highlights) {
          const ms: Marker[] = [];
          for (const it of legend) {
            const src = highlights[it.n];
            if (!src) continue;
            try {
              const hi = await loadImage(src);
              const ctr = coloredCentroid(hi);
              if (ctr) ms.push({ n: it.n, name: it.name, x: ctr.x, y: ctr.y });
            } catch {
              /* no-op */
            }
          }
          if (alive) setMarkers(ms);
        }
      } catch {
        /* no-op */
      }
    })();
    return () => {
      alive = false;
    };
  }, [baseSrc, highlights, legend]);

  useEffect(() => {
    setSelected(displaySrc !== baseSrc);
  }, [displaySrc, baseSrc]);

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
    const sx = (e.clientX - rect.left) * (off.width / rect.width);
    const sy = (e.clientY - rect.top) * (off.height / rect.height);
    const ctx = off.getContext("2d");
    if (!ctx) return;
    const x = Math.max(0, Math.min(off.width - 1, Math.round(sx)));
    const y = Math.max(0, Math.min(off.height - 1, Math.round(sy)));

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

    const items = legend.filter((_, i) => i % 12 === bestIdx);
    if (items.length === 0) return;

    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    showLabel(relX, relY, items);
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

      {/* Raqam markerlari — faqat asos diagrammada */}
      {!selected &&
        markers.map((m) => (
          <div
            key={m.n}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
          >
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-[12px] font-bold text-white shadow-soft ring-2 ring-white">
              {m.n}
            </span>
          </div>
        ))}

      <button
        onClick={onZoom}
        aria-label="zoom"
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
      >
        <ZoomIn className="h-4 w-4" aria-hidden />
      </button>

      <AnimatePresence>
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute z-30 max-w-[70%] rounded-xl bg-black/85 px-3 py-2 text-white shadow-pop"
            style={{
              left: Math.min(label.x, 999),
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
