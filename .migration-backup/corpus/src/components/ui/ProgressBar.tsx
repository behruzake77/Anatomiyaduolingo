"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/cn";

export function ProgressBar({
  value,
  color = "#6C5CE7",
  className,
  trackClassName,
}: {
  value: number; // 0..100
  color?: string;
  className?: string;
  trackClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-line", trackClassName, className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
