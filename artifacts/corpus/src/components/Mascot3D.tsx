"use client";

/**
 * 3D maskot konteyneri.
 *  - WebGL2 qo'llab-quvvatlansa va qurilma quvvatli bo'lsa → real 3D sahna.
 *  - Aks holda (eski WebView / low-end / xato) → 2D tutor (SVG) ga tushadi.
 *  - three.js katta chunk sifatida dynamic import qilinadi (faqat kerak bo'lganda yuklanadi).
 */

import { Component, lazy, Suspense, type ReactNode } from "react";
import { useEffect, useState } from "react";
import { isLowEndDevice } from "@/lib/device";
import { AnatomyTutor } from "@/components/reengage/AnatomyTutor";
import type { TutorState } from "@/utils/activity";
import type { MascotClip } from "@/components/MascotR3F";

const MascotR3F = lazy(() =>
  import("@/components/MascotR3F").then((m) => ({ default: m.MascotCanvas })),
);

// MascotClip -> TutorState fallback (2D yuz ifodasi)
function tutorStateFor(clip: MascotClip): TutorState {
  switch (clip) {
    case "Dance":
    case "Yes":
    case "ThumbsUp":
      return "CELEBRATING";
    case "Wave":
      return "WELCOME_BACK";
    case "No":
    case "Sitting":
      return "CONCERNED";
    default:
      return "HAPPY";
  }
}

/** WebGL2 mavjudligini sinab ko'radigan hook (eski WebView'da false). */
function useWebGL2(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(Boolean(c.getContext("webgl2")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

class MascotErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function Mascot3D({
  clip = "Idle",
  size = 96,
  title,
}: {
  clip?: MascotClip;
  size?: number;
  title?: string;
}) {
  const webgl2 = useWebGL2();
  const lowEnd = isLowEndDevice();
  const [failed, setFailed] = useState(false);

  const fallback = (
    <div style={{ width: size, height: size }} aria-label={title ?? "CORPUS maskoti"}>
      <AnatomyTutor state={tutorStateFor(clip)} size={size} />
    </div>
  );

  if (!webgl2 || lowEnd || failed) return fallback;

  return (
    <MascotErrorBoundary fallback={fallback} onError={() => setFailed(true)}>
      <Suspense fallback={fallback}>
        <div
          style={{ width: size, height: size }}
          role="img"
          aria-label={title ?? "CORPUS 3D maskoti"}
        >
          <MascotR3F clip={clip} />
        </div>
      </Suspense>
    </MascotErrorBoundary>
  );
}
