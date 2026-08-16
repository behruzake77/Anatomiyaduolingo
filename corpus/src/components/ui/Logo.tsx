"use client";

import { cn } from "@/utils/cn";

export type LogoVariant = "primary" | "light" | "monochrome";

/**
 * CORPUS logosi — foydalanuvchi yuklagan haqiqiy logotip (PNG, shaffof fon).
 * SVG variantlar (light/dark/mono) zaxira sifatida saqlanadi.
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
  // Asosiy logo — foydalanuvchi yuklagan PNG
  const src =
    variant === "primary"
      ? "/logo/logo-256.png"
      : variant === "light"
        ? "/logo/logo-light.svg"
        : "/logo/logo-mono.svg";

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="CORPUS logo"
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
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
