"use client";

import { cn } from "@/utils/cn";

/** Shared page wrapper: bottom padding so content clears the nav bar. */
export function Screen({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch] [&>*]:shrink-0",
        padded && "px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </main>
  );
}
