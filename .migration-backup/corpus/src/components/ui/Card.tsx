"use client";

import { cn } from "@/utils/cn";

export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-card",
        onClick && "w-full text-left transition-transform duration-150 active:scale-[.98]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
