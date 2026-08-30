"use client";

/**
 * Lightbox — rasmni to'liq ekranda ochib, kattalashtirib o'qish.
 * - Barmoq bilan chimchilab (pinch) kattalashtirish / kichraytirish
 * - Barmoq yoki sichqoncha bilan surib ko'chirish
 * - Ikki marta bosish (double-tap) → 1× ↔ 2.5×
 * - Sichqoncha g'ildiragi bilan zoom (desktop)
 * - + / − / tiklash tugmalari, ESC yoki tashqariga bosib yopish
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Minus, RotateCcw, List } from "lucide-react";
import { cn } from "@/utils/cn";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const DBL_TAP_ZOOM = 2.5;
const DBL_TAP_MS = 300;
const DBL_TAP_PX = 24;

interface LightboxLabels {
  close: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  list?: string;
}

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
  labels?: LightboxLabels;
  /** Yuqorida ko'rsatiladigan topish ko'rsatmasi (masalan: "№3 — ... ni toping") */
  banner?: string;
  /** Raqamlangan qismlar ro'yxati (kitob izohi) — har doim to'g'ri */
  legend?: { n: string; name: string }[];
}

interface Pt {
  x: number;
  y: number;
}

function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

/** Sursa hamda tarjimani chegaralab, rasm ekrandan butunlay chiqib ketishini oldini oladi. */
function clampPos(scale: number, x: number, y: number, w: number, h: number): Pt {
  const mx = Math.max(0, ((scale - 1) * w) / 2);
  const my = Math.max(0, ((scale - 1) * h) / 2);
  return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
}

export function Lightbox({ src, alt = "", onClose, labels, banner, legend }: LightboxProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState<Pt>({ x: 0, y: 0 });
  const [gesturing, setGesturing] = useState(false);
  const [listOpen, setListOpen] = useState<boolean>(!!banner);

  // Manba sifatida ref-lar (gesture ichida eskirgan holatdan qochish uchun).
  const scaleRef = useRef(1);
  const posRef = useRef<Pt>({ x: 0, y: 0 });

  const pointers = useRef(new Map<number, Pt>());
  const gesture = useRef({
    mode: "none" as "none" | "pan" | "pinch",
    startScale: 1,
    startPos: { x: 0, y: 0 } as Pt,
    startDist: 0,
    startMid: { x: 0, y: 0 } as Pt,
    startPointer: { x: 0, y: 0 } as Pt,
  });
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  const apply = (s: number, p: Pt) => {
    scaleRef.current = s;
    posRef.current = p;
    setScale(s);
    setPos(p);
  };

  const containerCenter = (): Pt => {
    const el = surfaceRef.current;
    if (!el) return { x: 0, y: 0 };
    return { x: el.clientWidth / 2, y: el.clientHeight / 2 };
  };

  /** Muayyan ekran nuqtasiga (markazga nisbatan) zoom qilish. */
  const zoomAt = (factor: number, around: Pt) => {
    const c = containerCenter();
    const p = { x: around.x - c.x, y: around.y - c.y };
    const s0 = scaleRef.current;
    const s1 = clampScale(s0 * factor);
    const p1 = {
      x: p.x - (p.x - posRef.current.x) * (s1 / s0),
      y: p.y - (p.y - posRef.current.y) * (s1 / s0),
    };
    apply(s1, clampPos(s1, p1.x, p1.y, c.x * 2, c.y * 2));
  };

  const toggleZoom = (around: Pt) => {
    if (scaleRef.current > MIN_SCALE + 0.01) {
      apply(1, { x: 0, y: 0 });
      return;
    }
    const c = containerCenter();
    const p = { x: around.x - c.x, y: around.y - c.y };
    const s = DBL_TAP_ZOOM;
    apply(s, clampPos(s, p.x - (p.x - 0) * s, p.y - (p.y - 0) * s, c.x * 2, c.y * 2));
  };

  const pointerPos = (e: React.PointerEvent): Pt => {
    const el = surfaceRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointerPos(e);

    // Ikki marta bosish → zoom.
    const now = Date.now();
    if (
      now - lastTap.current.t < DBL_TAP_MS &&
      Math.abs(p.x - lastTap.current.x) < DBL_TAP_PX &&
      Math.abs(p.y - lastTap.current.y) < DBL_TAP_PX
    ) {
      lastTap.current = { t: 0, x: 0, y: 0 };
      toggleZoom(p);
      return;
    }
    lastTap.current = { t: now, x: p.x, y: p.y };

    pointers.current.set(e.pointerId, p);
    setGesturing(true);

    if (pointers.current.size === 1) {
      gesture.current = {
        mode: "pan",
        startScale: scaleRef.current,
        startPos: posRef.current,
        startDist: 0,
        startMid: p,
        startPointer: p,
      };
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const d = dist(pts[0], pts[1]);
      const m = mid(pts[0], pts[1]);
      gesture.current = {
        mode: "pinch",
        startScale: scaleRef.current,
        startPos: posRef.current,
        startDist: d,
        startMid: m,
        startPointer: p,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const p = pointerPos(e);
    pointers.current.set(e.pointerId, p);
    const g = gesture.current;

    if (g.mode === "pan" && pointers.current.size === 1) {
      const s = scaleRef.current;
      if (s <= MIN_SCALE + 0.01) return;
      const c = containerCenter();
      const next = { x: g.startPos.x + (p.x - g.startPointer.x), y: g.startPos.y + (p.y - g.startPointer.y) };
      apply(s, clampPos(s, next.x, next.y, c.x * 2, c.y * 2));
    } else if (g.mode === "pinch" && pointers.current.size >= 2) {
      const pts = [...pointers.current.values()];
      const d = dist(pts[0], pts[1]);
      const m = mid(pts[0], pts[1]);
      const s1 = clampScale(g.startScale * (d / Math.max(1, g.startDist)));
      const p1 = {
        x: m.x - (g.startMid.x - g.startPos.x) * (s1 / g.startScale),
        y: m.y - (g.startMid.y - g.startPos.y) * (s1 / g.startScale),
      };
      const c = containerCenter();
      apply(s1, clampPos(s1, p1.x, p1.y, c.x * 2, c.y * 2));
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      // Bitta barmoq qoldi — pan uchun qayta boshlang'ich nuqta.
      const p = [...pointers.current.values()][0];
      gesture.current = {
        mode: "pan",
        startScale: scaleRef.current,
        startPos: posRef.current,
        startDist: 0,
        startMid: p,
        startPointer: p,
      };
    } else if (pointers.current.size === 0) {
      gesture.current.mode = "none";
      setGesturing(false);
    }
  };

  // Desktop: sichqoncha g'ildiragi bilan zoom (passive bo'lmagan listener kerak).
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const around = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      zoomAt(Math.exp(-e.deltaY * 0.0016), around);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Body scroll qulfi + ESC bilan yopish.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Rasm"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Yuqori panel */}
      <div className="flex items-center justify-between gap-3 p-4">
        {banner ? (
          <span className="flex-1 rounded-xl bg-primary/25 px-3 py-2 text-sm font-semibold leading-snug text-white">
            {banner}
          </span>
        ) : (
          <span className="max-w-[70%] truncate text-sm font-medium text-white/80">{alt}</span>
        )}
        <button
          onClick={onClose}
          aria-label={labels?.close ?? "Close"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Rasm maydoni */}
      <div
        ref={surfaceRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div
          className={cn(
            "relative",
            !gesturing && "transition-transform duration-150 ease-out",
          )}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="max-h-[78vh] max-w-[92vw] select-none object-contain"
          />
        </div>
      </div>

      {/* Raqamlangan qismlar ro'yxati (kitob izohi) — har doim to'g'ri */}
      {legend && legend.length > 0 && listOpen && (
        <ul className="mx-4 mb-2 max-h-40 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-2">
          {legend.map((it, i) => (
            <li key={`${it.n}-${i}`} className="flex items-start gap-2 px-2 py-1 text-left text-[13px] leading-snug text-white/90">
              <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-white/15 px-1 text-[11px] font-bold text-white">
                {it.n}
              </span>
              <span className="text-white">{it.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Pastki boshqaruv */}
      <div className="flex items-center justify-center gap-3 p-4">
        <button
          onClick={() => zoomAt(1 / 1.4, containerCenter())}
          aria-label={labels?.zoomOut ?? "Zoom out"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          disabled={scale <= MIN_SCALE + 0.01}
        >
          <Minus className="h-5 w-5" aria-hidden />
        </button>
        <span className="min-w-14 text-center text-sm font-semibold tabular-nums text-white/90">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => zoomAt(1.4, containerCenter())}
          aria-label={labels?.zoomIn ?? "Zoom in"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          disabled={scale >= MAX_SCALE - 0.01}
        >
          <Plus className="h-5 w-5" aria-hidden />
        </button>
        <button
          onClick={() => apply(1, { x: 0, y: 0 })}
          aria-label={labels?.reset ?? "Reset"}
          className="flex h-11 items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {labels?.reset ?? "Reset"}
        </button>
        {legend && legend.length > 0 && (
          <button
            onClick={() => setListOpen((o) => !o)}
            aria-label={labels?.list ?? "List"}
            className={cn(
              "flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
              listOpen ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <List className="h-4 w-4" aria-hidden />
            {labels?.list ?? "List"}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
