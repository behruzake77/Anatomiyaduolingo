/**
 * CORPUS — Design tokens (single source of truth for JS/TS consumers).
 * Mirrored in `app/globals.css` for Tailwind utilities.
 */

export const colors = {
  primary: "#6C5CE7",
  primarySoft: "#A29BFE",
  primaryDeep: "#5A4BD1",
  success: "#00B894",
  accent: "#FD79A8",
  danger: "#EF4444",
  warning: "#F59E0B",
  dark: "#2D3436",
  background: "#F8F9FA",
  white: "#FFFFFF",
} as const;

/** 8px grid system */
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

export const radius = {
  sm: 12, // small elements / chips
  card: 16, // cards
  btn: 24, // buttons / pills
} as const;

export const typography = {
  fontFamily: {
    sans: "Poppins",
    heading: "Poppins",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  size: {
    h1: 32,
    h2: 24,
    h3: 18,
    body: 16,
    small: 14,
    xs: 12,
  },
} as const;

export const shadows = {
  soft: "0 4px 12px rgba(108, 92, 231, 0.10)",
  card: "0 8px 24px rgba(45, 52, 54, 0.08)",
  pop: "0 12px 40px -8px rgba(108, 92, 231, 0.35)",
} as const;

export const motion = {
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
} as const;
