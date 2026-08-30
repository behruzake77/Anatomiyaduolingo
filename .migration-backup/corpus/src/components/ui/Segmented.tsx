"use client";

import { cn } from "@/utils/cn";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-line bg-surface2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors",
            value === o.value ? "bg-surface text-ink shadow-soft" : "text-muted",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
