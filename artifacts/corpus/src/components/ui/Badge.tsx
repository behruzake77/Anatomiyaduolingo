"use client";

import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import { Sticker3D } from "@/components/ui/Sticker3D";

export function Badge({
  icon: Icon,
  title,
  description,
  accent,
  sticker,
  locked,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  sticker?: string;
  locked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-4 text-center shadow-card transition",
        locked && "opacity-55 grayscale",
      )}
    >
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: `${accent}1f`, color: accent }}
      >
        {sticker ? <Sticker3D src={sticker} size={38} /> : <Icon className="h-7 w-7" aria-hidden />}
        {locked && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-muted">
            <Lock className="h-3 w-3" aria-hidden />
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
    </div>
  );
}
