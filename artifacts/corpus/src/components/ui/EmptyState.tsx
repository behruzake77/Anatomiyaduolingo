"use client";

import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Sticker3D } from "@/components/ui/Sticker3D";

export function EmptyState({
  icon: Icon = Inbox,
  sticker,
  title,
  description,
}: {
  icon?: LucideIcon;
  sticker?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-12 text-center">
      {sticker ? <Sticker3D src={sticker} size={64} className="rx-float" /> : <Icon className="h-10 w-10 text-muted" aria-hidden />}
      <p className="text-base font-semibold">{title}</p>
      <p className="max-w-[240px] text-sm text-muted">{description}</p>
    </div>
  );
}
