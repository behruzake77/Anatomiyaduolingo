"use client";

import { cn } from "@/utils/cn";

/**
 * "Go Back" sweep button — adapted from Uiverse.io by AKAspidey01.
 * A green rounded pill holding a back arrow sits at the left; on hover it
 * smoothly expands across the button (500 ms), sweeping over the label.
 *
 * Layout notes (so any localized label stays readable in every state):
 * - the label is centered in the zone right of the resting pill;
 * - the button fills its parent width (min 192px), the pill stays 48px
 *   wide at rest and grows to (100% - 8px) on hover.
 */
export function GoBackButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative h-14 w-full min-w-48 cursor-pointer rounded-2xl bg-white text-xl font-semibold text-black transition-shadow duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "dark:bg-surface2 dark:text-ink",
        className,
      )}
    >
      {/* Label: centered in the space right of the resting pill (60px from left). */}
      <span className="pointer-events-none absolute inset-y-0 left-[3.75rem] right-3 flex items-center overflow-hidden">
        <span className="min-w-0 flex-1 truncate text-center">{label}</span>
      </span>

      {/* Sweeping green pill (rest: 48px w/ arrow; hover: fills the button). */}
      <div
        aria-hidden
        className="absolute left-1 top-[4px] z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-green-400 transition-all duration-500 group-hover:w-[calc(100%_-_0.5rem)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#000000"
          />
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#000000"
          />
        </svg>
      </div>
    </button>
  );
}
