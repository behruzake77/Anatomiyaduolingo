"use client";

import "./PulseLoader.css";

/**
 * Heartbeat polyline loader — markup from Uiverse.io by milley69.
 * Used as the Suspense fallback while lazy screens are loading.
 */
export function PulseLoader() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <svg width="64px" height="48px" aria-hidden="true">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="back"
        />
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="front"
        />
      </svg>
    </div>
  );
}
