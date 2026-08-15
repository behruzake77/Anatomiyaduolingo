"use client";

import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function TopBar({
  title,
  right,
  showBack = true,
}: {
  title: string;
  right?: React.ReactNode;
  showBack?: boolean;
}) {
  const back = useAppStore((s) => s.back);
  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-6">
      {showBack && (
        <button
          onClick={back}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted transition active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      )}
      <h1 className="flex-1 text-2xl font-semibold leading-none">{title}</h1>
      {right}
    </header>
  );
}
