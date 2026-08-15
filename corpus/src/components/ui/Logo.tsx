"use client";

import { cn } from "@/utils/cn";

export type LogoVariant = "primary" | "light" | "monochrome";

/**
 * CORPUS premium split-face logo — half skull, half anatomy,
 * rounded-square purple gradient with ring, highlight and laurel accent.
 */
export function Logo({
  variant = "primary",
  size = 48,
  className,
}: {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}) {
  const id = `corpus-${variant}`;
  const grad =
    variant === "monochrome"
      ? { from: "#2D3436", to: "#2D3436", skull: "#FFFFFF", face: "#94A3B8", laurel: "#94A3B8", ring: "rgba(255,255,255,0.10)" }
      : variant === "light"
        ? { from: "#FFFFFF", to: "#E9EBF4", skull: "#6C5CE7", face: "#3EE0C8", laurel: "#F59E0B", ring: "rgba(45,52,54,0.10)" }
        : { from: "#6C5CE7", to: "#A29BFE", skull: "#F8FAFC", face: "#3EE0C8", laurel: "#F9C74F", ring: "rgba(255,255,255,0.22)" };

  const detail = variant === "monochrome" ? "#0B0F1A" : "#2D3436";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="CORPUS logo"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={grad.from} />
          <stop offset="1" stopColor={grad.to} />
        </linearGradient>
        <radialGradient id={`${id}-hl`} cx="0.32" cy="0.26" r="0.6">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-left`}>
          <rect x="0" y="0" width="60" height="120" />
        </clipPath>
        <clipPath id={`${id}-right`}>
          <rect x="60" y="0" width="60" height="120" />
        </clipPath>
      </defs>

      {/* container + highlight + ring */}
      <rect width="120" height="120" rx="27" fill={`url(#${id}-bg)`} />
      <rect width="120" height="120" rx="27" fill={`url(#${id}-hl)`} />
      <rect x="4" y="4" width="112" height="112" rx="23" fill="none" stroke={grad.ring} strokeWidth="2" />

      {/* laurel */}
      <g fill={grad.laurel}>
        <path d="M12 97c2.6-3.2 6.2-4.4 8.4-7.4 1 1.6 2.2 2.9 3.6 3.6-2.6 3-6.2 4.2-8.4 7.2-1.4-1-2.6-2.2-3.6-3.4Z" />
        <path d="M96 97c2.6-3.2 6.2-4.4 8.4-7.4 1 1.6 2.2 2.9 3.6 3.6-2.6 3-6.2 4.2-8.4 7.2-1.4-1-2.6-2.2-3.6-3.4Z" />
      </g>

      {/* head: left = skull, right = anatomy */}
      <g>
        <g clipPath={`url(#${id}-left)`}>
          <circle cx="60" cy="56" r="37" fill={grad.skull} />
          <rect x="33" y="86" width="54" height="18" rx="9" fill={grad.skull} />
          <circle cx="43" cy="56" r="9" fill={detail} />
          <path d="M43 60q1.6 3 4 4.4" stroke={detail} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".55" />
          <path d="M60 70 52.5 86h15Z" fill={detail} />
          <g fill={detail}>
            <rect x="40.5" y="91" width="4" height="9" rx="1.6" />
            <rect x="47.5" y="91" width="4" height="9" rx="1.6" />
            <rect x="54.5" y="91" width="4" height="9" rx="1.6" />
          </g>
        </g>
        <g clipPath={`url(#${id}-right)`}>
          <circle cx="60" cy="56" r="37" fill={grad.face} />
          <rect x="33" y="86" width="54" height="18" rx="9" fill={grad.face} />
          <circle cx="96.5" cy="58" r="5.5" fill={grad.face} stroke={detail} strokeWidth="2.4" opacity=".6" />
          <circle cx="77" cy="56" r="9" fill={detail} opacity=".5" />
          <path d="M60 70v16" stroke={detail} strokeWidth="4.5" opacity=".4" strokeLinecap="round" />
          <g stroke={detail} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".4">
            <path d="M71 38q3 2 4 5" />
            <path d="M74 32q2.4 2 3 4.6" />
          </g>
        </g>
        <line x1="60" y1="14" x2="60" y2="112" stroke={detail} strokeWidth="4" opacity=".45" />
      </g>
    </svg>
  );
}

/** Logo + wordmark (premium branding row). */
export function Wordmark({
  variant = "primary",
  size = 40,
  className,
}: {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo variant={variant} size={size} />
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        CORPUS
      </span>
    </div>
  );
}
