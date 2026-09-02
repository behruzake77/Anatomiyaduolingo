"use client";

import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-soft hover:bg-primary-deep",
  secondary: "bg-primary/10 text-primary hover:bg-primary/15",
  outline: "border-2 border-line bg-surface text-ink hover:bg-surface2",
  ghost: "bg-surface2 text-ink hover:brightness-95",
  danger: "bg-danger text-white hover:brightness-105",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-ui-button="true"
      data-variant={variant}
      className={cn(
        "ui-button relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-[var(--button-radius,1.5rem)] font-semibold transition-all duration-200 active:scale-[.97] disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
