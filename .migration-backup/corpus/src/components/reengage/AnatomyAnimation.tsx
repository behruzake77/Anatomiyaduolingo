"use client";

/**
 * AnatomyAnimation — tizimga mos mikro-animatsiya.
 * Real anatomik tasvirlar (loyihada mavjud) + yumshoq CSS motion.
 * dna uchun yengil CSS qo'sh spiral.
 * Faqat kerak bo'lganda render qilinadi (lazy), reduced-motion global qoidaga bo'ysunadi.
 */

export type AnatomyKind = "brain" | "heart" | "lungs" | "skeleton" | "dna";

const KINDS: Record<AnatomyKind, { img?: string; cls: string; color: string; label: string }> = {
  brain: { img: "/img/brain.jpg", cls: "rx-brain-pulse", color: "#6C5CE7", label: "Brain" },
  heart: { img: "/img/heart.jpg", cls: "rx-heartbeat", color: "#EF4444", label: "Heart" },
  lungs: { img: "/img/lungs.jpg", cls: "rx-lungs", color: "#0EA5E9", label: "Lungs" },
  skeleton: { img: "/img/skeleton.jpg", cls: "rx-sway", color: "#5A4BD1", label: "Skeleton" },
  dna: { cls: "rx-dna", color: "#00B894", label: "DNA" },
};

export function AnatomyAnimation({ kind, size = 72 }: { kind: AnatomyKind; size?: number }) {
  const k = KINDS[kind];

  if (kind === "dna") {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-label="DNA" className={k.cls} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <g stroke={k.color} strokeWidth="4" strokeLinecap="round">
            <path d="M18 6 C 18 34, 54 34, 54 66" />
            <path d="M54 6 C 54 34, 18 34, 18 66" />
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 12 + i * 10;
            return <line key={i} x1="18" y1={y} x2="54" y2={y + 10} stroke={k.color} strokeWidth="3" opacity="0.7" />;
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* yumshoq halo */}
      <div
        className="absolute inset-0 rounded-full opacity-25 blur-md"
        style={{ background: k.color }}
        aria-hidden
      />
      <div className={`absolute inset-0 ${k.cls}`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <img
          src={k.img}
          alt={k.label}
          className="h-full w-full rounded-full border-2 object-cover"
          style={{ borderColor: `${k.color}55` }}
        />
      </div>
    </div>
  );
}
