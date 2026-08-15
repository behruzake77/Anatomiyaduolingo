"use client";

import { cn } from "@/utils/cn";

export type LogoVariant = "primary" | "light" | "monochrome";

/**
 * CORPUS split-face logo — half skull, half anatomy,
 * on a rounded-square purple gradient with a subtle laurel accent.
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
      ? { from: "#2D3436", to: "#2D3436" }
      : variant === "light"
        ? { from: "#FFFFFF", to: "#F1F2F7" }
        : { from: "#6C5CE7", to: "#A29BFE" };

  const skull = variant === "monochrome" ? "#FFFFFF" : variant === "light" ? "#6C5CE7" : "#F8FAFC";
  const face = variant === "monochrome" ? "#94A3B8" : "#3EE0C8";
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
        <clipPath id={`${id}-left`}>
          <rect x="0" y="0" width="60" height="120" />
        </clipPath>
        <clipPath id={`${id}-right`}>
          <rect x="60" y="0" width="60" height="120" />
        </clipPath>
      </defs>

      {/* rounded-square container */}
      <rect width="120" height="120" rx="26" fill={`url(#${id}-bg)`} />

      {/* laurel accent */}
      <g fill={variant === "monochrome" ? "#0B0F1A" : "#F9C74F"} opacity="0.9">
        <path d="M14 96c2-3 6-4 8-7 2 3 6 4 8 7-3 1-6 3-8 3s-5-2-8-3Z" />
        <path d="M90 96c2-3 6-4 8-7 2 3 6 4 8 7-3 1-6 3-8 3s-5-2-8-3Z" />
      </g>

      {/* head: left = skull, right = anatomy */}
      <g>
        <g clipPath={`url(#${id}-left)`}>
          <circle cx="60" cy="58" r="36" fill={skull} />
          <rect x="36" y="88" width="48" height="17" rx="8" fill={skull} />
          <circle cx="44" cy="58" r="8.5" fill={detail} />
          <path d="M60 72 52 88h16Z" fill={detail} />
          <g fill={detail}>
            <rect x="42" y="92" width="4" height="9" rx="1.5" />
            <rect x="49" y="92" width="4" height="9" rx="1.5" />
            <rect x="56" y="92" width="4" height="9" rx="1.5" />
          </g>
        </g>
        <g clipPath={`url(#${id}-right)`}>
          <circle cx="60" cy="58" r="36" fill={face} />
          <rect x="36" y="88" width="48" height="17" rx="8" fill={face} />
          <circle cx="76" cy="58" r="8.5" fill={detail} opacity="0.55" />
          <path d="M60 72v16" stroke={detail} strokeWidth="4.5" opacity="0.4" strokeLinecap="round" />
          <path d="M74 40c4 3 5 6 5 9M70 34c2 2 3 4 3 6" stroke={detail} strokeWidth="2.5" opacity="0.35" fill="none" strokeLinecap="round" />
        </g>
        <line x1="60" y1="16" x2="60" y2="112" stroke={detail} strokeWidth="4" opacity="0.45" />
      </g>
    </svg>
  );
}
