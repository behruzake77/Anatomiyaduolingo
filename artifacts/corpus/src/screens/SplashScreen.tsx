"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Crown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { PREMIUM_DISABLED } from "@/data/premium";

/**
 * High-Precision Anatomical Opening Sequence for CORPUS
 *
 * Sequence Chronology (2.8s total):
 * 0.0s - 0.4s :: INITIAL MOMENT — Deep dark ambient canvas, micro grid calibration.
 * 0.3s - 1.0s :: DISCOVERY — Sagittal axis laser line & reticle crosshairs establish anatomical focus.
 * 0.7s - 1.6s :: ANATOMY EMBLEM & BRAND — Central emblem resolves, halo activates, wordmark rises.
 * 1.5s - 2.2s :: MOMENT OF FOCUS — Precision progress calibration gauge completes (11 Systems / 2000+ Items).
 * 2.3s - 2.8s :: TRANSITION — Canvas scales subtly and reveals the active workspace smoothly.
 */

export function SplashScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const isPremium = useAppStore((s) => s.isPremium) && !PREMIUM_DISABLED;
  const t = useStrings();
  const reduced = useReducedMotion();
  const lite =
    reduced ||
    (typeof navigator !== "undefined" &&
      (((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2 ||
        (navigator.hardwareConcurrency ?? 8) <= 4));

  const [phase, setPhase] = useState<"init" | "grid" | "emblem" | "focus" | "exiting">("init");
  const [gaugeProgress, setGaugeProgress] = useState(0);

  useEffect(() => {
    if (lite) {
      const id = setTimeout(() => finish(), 280);
      return () => clearTimeout(id);
    }

    const t1 = setTimeout(() => setPhase("grid"), 300);
    const t2 = setTimeout(() => setPhase("emblem"), 700);
    const t3 = setTimeout(() => {
      setPhase("focus");
      setGaugeProgress(100);
    }, 1500);
    const t4 = setTimeout(() => setPhase("exiting"), 2300);
    const t5 = setTimeout(() => finish(), 2750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lite]);

  function finish() {
    const started = Date.now();
    const go = () => {
      const s = useAppStore.getState();
      if (s.isLoading && Date.now() - started < 5000) {
        setTimeout(go, 80);
        return;
      }
      if (!s.currentUser) navigate("login");
      else navigate(s.onboardingDone ? "dashboard" : "onboarding");
    };
    go();
  }

  const isGridActive = phase !== "init";
  const isEmblemActive = phase === "emblem" || phase === "focus" || phase === "exiting";
  const isExiting = phase === "exiting";

  return (
    <div className="relative flex flex-1 select-none flex-col items-center justify-center overflow-hidden bg-[#060810] text-white">
      {/* 1. Deep Medical Ambient Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(11,15,29,1)_0%,_rgba(6,8,16,1)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C5CE7]/10 blur-[130px]" />

      {/* 2. Precision Anatomical Grid */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: isGridActive ? 0.18 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(162, 155, 254, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(162, 155, 254, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(circle at center, black 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 25%, transparent 80%)",
        }}
      />

      {/* 3. Sagittal Alignment Laser Axis */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#6C5CE7]/60 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={isGridActive ? { scaleY: 1, opacity: 0.8 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#6C5CE7]/30 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isGridActive ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />

      {/* 4. Diagnostic Reticle Corner Framing */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2">
        {/* Top-Left */}
        <motion.div
          className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#A29BFE]/40"
          initial={{ opacity: 0, x: -10, y: -10 }}
          animate={isGridActive ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Top-Right */}
        <motion.div
          className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#A29BFE]/40"
          initial={{ opacity: 0, x: 10, y: -10 }}
          animate={isGridActive ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Bottom-Left */}
        <motion.div
          className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#A29BFE]/40"
          initial={{ opacity: 0, x: -10, y: 10 }}
          animate={isGridActive ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Bottom-Right */}
        <motion.div
          className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#A29BFE]/40"
          initial={{ opacity: 0, x: 10, y: 10 }}
          animate={isGridActive ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* 5. Main Hero Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={isExiting ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Emblem Reticle Target Frame */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          {/* Concentric Precision Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#6C5CE7]/20"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={isEmblemActive ? { scale: 1.25, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Halo Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#6C5CE7]/15 blur-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isEmblemActive ? { scale: 1.1, opacity: 0.8 } : { scale: 0.5, opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />

          {/* Central Logo */}
          <motion.div
            className="relative flex h-28 w-28 items-center justify-center"
            initial={{ opacity: 0, scale: 0.82, y: 8 }}
            animate={isEmblemActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.82, y: 8 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo size={112} />
          </motion.div>
        </div>

        {/* Brand Title Wordmark */}
        <div className="mt-6 flex flex-col items-center">
          <motion.h1
            className="text-3xl font-extrabold tracking-[0.22em] text-white"
            initial={{ opacity: 0, y: 12 }}
            animate={isEmblemActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {t.brand}
            <span className="text-[#A29BFE]">.</span>
          </motion.h1>

          <motion.p
            className="mt-1.5 text-[11px] font-medium tracking-[0.26em] text-white/50"
            initial={{ opacity: 0, y: 8 }}
            animate={isEmblemActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            {t.tagline.toUpperCase()}
          </motion.p>
        </div>

        {/* Premium Badge if active */}
        {isPremium && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isEmblemActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-3.5 py-1 text-[10px] font-bold tracking-wider text-[#1a1230] shadow-md"
          >
            <Crown className="h-3 w-3" aria-hidden /> PREMIUM
          </motion.span>
        )}

        {/* Clinical Gauge & Progress Bar */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#00B894]"
              initial={{ width: "0%" }}
              animate={{ width: `${gaugeProgress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <motion.div
            className="mt-3 flex items-center gap-3 text-[10px] font-mono tracking-widest text-white/40"
            initial={{ opacity: 0 }}
            animate={isEmblemActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span>SYSTEM CALIBRATED</span>
            <span className="h-1 w-1 rounded-full bg-[#00B894]" />
            <span>11 SYSTEMS</span>
          </motion.div>
        </div>
      </motion.div>

      {/* 6. Clinical Micro-Metadata Framing (Bottom) */}
      <motion.div
        className="pointer-events-none absolute bottom-6 inset-x-8 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/30"
        initial={{ opacity: 0 }}
        animate={isGridActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div>ANATOMICAL INDEX :: A. AHMEDOV</div>
        <div>CORPUS v1.0</div>
      </motion.div>

      {/* 7. Exit Smooth Dark Veil Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#060810]"
        initial={{ opacity: 0 }}
        animate={isExiting ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />
    </div>
  );
}
