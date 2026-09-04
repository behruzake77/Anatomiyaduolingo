"use client";

import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Sticker3D } from "@/components/ui/Sticker3D";
import { cn } from "@/utils/cn";

export function EmptyState({
  icon: Icon = Inbox,
  sticker,
  illustration,
  title,
  description,
  className,
}: {
  icon?: LucideIcon;
  sticker?: string;
  /** Large 3D illustration (transparent PNG/WebP) shown inside a soft halo. */
  illustration?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-12 text-center",
        className,
      )}
    >
      {illustration ? (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary/10 blur-md"
          />
          <img
            src={illustration || "/placeholder.svg"}
            alt=""
            loading="lazy"
            decoding="async"
            className="rx-float relative h-28 w-28 select-none object-contain drop-shadow-[0_8px_20px_rgba(108,92,231,0.22)]"
          />
        </div>
      ) : sticker ? (
        <Sticker3D src={sticker} size={64} className="rx-float" />
      ) : (
        <Icon className="h-10 w-10 text-muted" aria-hidden />
      )}
      <p className="text-base font-semibold">{title}</p>
      {description && <p className="max-w-[240px] text-sm text-muted">{description}</p>}
    </div>
  );
}
