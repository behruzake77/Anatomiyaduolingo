"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Lightweight haptic feedback via the Vibration API
 * (falls back gracefully on devices without a vibrator).
 */
export function useHaptics() {
  const enabled = useAppStore((s) => s.settings.haptics);

  return useCallback(
    (pattern: number | number[]) => {
      if (!enabled) return;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch {
          /* no-op */
        }
      }
    },
    [enabled],
  );
}
