"use client";

/**
 * CORPUS maskoti — kayfiyatiga qarab yuz ifodasi o'zgaradigan SVG personaj.
 * Qaytmagan bo'lsa jahli chiqadi, uzoq kirmasa "uxlab qoladi", seriya katta bo'lsa olovda.
 */

import type { MascotMood } from "@/utils/mascot";

const MOOD_COLOR: Record<MascotMood, string> = {
  fire: "#FD79A8",
  happy: "#6C5CE7",
  neutral: "#6C5CE7",
  sad: "#A29BFE",
  angry: "#EF4444",
  sleeping: "#9CA3AF",
};

interface Face {
  brows: React.ReactNode;
  eyes: React.ReactNode;
  mouth: React.ReactNode;
  extras?: React.ReactNode;
}

function face(mood: MascotMood): Face {
  switch (mood) {
    case "fire":
      return {
        brows: (
          <>
            <path d="M56 34 l8 -6" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
            <path d="M104 34 l-8 -6" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
          </>
        ),
        eyes: (
          <>
            <circle cx="64" cy="50" r="6" fill="#2D3436" />
            <circle cx="96" cy="50" r="6" fill="#2D3436" />
          </>
        ),
        mouth: <path d="M64 62 q16 14 32 0 q-8 -10 -16 -10 q-8 0 -16 10 z" fill="#2D3436" />,
        extras: (
          <g>
            <path d="M92 18 q4 -10 0 -18 q-8 2 -8 10 q0 8 8 8 z" fill="#F59E0B" />
            <path d="M98 22 q3 -7 0 -13 q-6 1 -6 7 q0 6 6 6 z" fill="#FD79A8" />
          </g>
        ),
      };
    case "happy":
      return {
        brows: <path d="M58 38 q6 -5 12 0 M90 38 q6 -5 12 0" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" fill="none" />,
        eyes: (
          <>
            <circle cx="64" cy="50" r="6" fill="#2D3436" />
            <circle cx="96" cy="50" r="6" fill="#2D3436" />
          </>
        ),
        mouth: <path d="M60 62 q10 12 20 0 q10 12 20 0" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" fill="none" />,
        extras: (
          <>
            <circle cx="50" cy="58" r="5" fill="#FD79A8" opacity="0.5" />
            <circle cx="110" cy="58" r="5" fill="#FD79A8" opacity="0.5" />
          </>
        ),
      };
    case "neutral":
      return {
        brows: null,
        eyes: (
          <>
            <circle cx="64" cy="50" r="6" fill="#2D3436" />
            <circle cx="96" cy="50" r="6" fill="#2D3436" />
          </>
        ),
        mouth: <path d="M66 62 q14 8 28 0" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" fill="none" />,
      };
    case "sad":
      return {
        brows: (
          <>
            <path d="M58 40 l10 -5" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
            <path d="M102 40 l-10 -5" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
          </>
        ),
        eyes: (
          <>
            <circle cx="64" cy="52" r="6" fill="#2D3436" />
            <circle cx="96" cy="52" r="6" fill="#2D3436" />
          </>
        ),
        mouth: <path d="M64 70 q16 -10 32 0" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" fill="none" />,
        extras: <path d="M70 60 l4 4 M86 62 l4 3" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />,
      };
    case "angry":
      return {
        brows: (
          <>
            <path d="M54 34 l14 8" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M106 34 l-14 8" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ),
        eyes: (
          <>
            <circle cx="64" cy="50" r="6" fill="#2D3436" />
            <circle cx="96" cy="50" r="6" fill="#2D3436" />
          </>
        ),
        mouth: <path d="M64 64 q16 10 32 0" stroke="#2D3436" strokeWidth="3.5" strokeLinecap="round" fill="none" />,
        extras: <text x="26" y="44" fontSize="16" fontWeight="bold" fill="#EF4444">💢</text>,
      };
    case "sleeping":
      return {
        brows: null,
        eyes: (
          <>
            <path d="M58 48 q6 5 12 0 M88 48 q6 5 12 0" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ),
        mouth: <circle cx="80" cy="64" r="3.5" fill="#2D3436" />,
        extras: (
          <g fill="#9CA3AF" fontWeight="bold">
            <text x="106" y="34" fontSize="14">z</text>
            <text x="116" y="26" fontSize="18">Z</text>
            <text x="126" y="18" fontSize="22">Z</text>
          </g>
        ),
      };
  }
}

export function Mascot({ mood, size = 96 }: { mood: MascotMood; size?: number }) {
  const f = face(mood);
  const color = MOOD_COLOR[mood];
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" role="img" aria-label="CORPUS maskoti">
      {/* quloq/antena */}
      <circle cx="32" cy="40" r="12" fill={color} opacity="0.85" />
      <circle cx="96" cy="40" r="12" fill={color} opacity="0.85" />
      {/* tana */}
      <circle cx="64" cy="66" r="46" fill={color} />
      <circle cx="64" cy="66" r="46" fill="url(#mascot-shine)" />
      {/* yuz */}
      {f.brows}
      {f.eyes}
      {f.mouth}
      {f.extras}
      <defs>
        <linearGradient id="mascot-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
