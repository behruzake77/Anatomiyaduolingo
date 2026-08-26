"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Crown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { getCurrent } from "@/auth";

/**
 * Kinematik kirish (intro) animatsiyasi — faqat ochilish ekranini yangilaydi.
 * Logotip ("Logo" komponenti orqali aynan mavjud rasm) va Dashboard o'zgarmaydi.
 *
 * Ketma-ketlik:
 *   0.0–0.5s  qorong'u anatomik fon + grid + donachalar
 *   0.5–1.1s  Logo: scale(0.75 → 1) + yumshoq nur
 *   1.1–1.7s  tibbiy skan nuri (gorizontal) + radial nur
 *   1.7–2.3s  "Corpus" matni (fade + yuqoriga)
 *   2.3–2.7s  yuklash chizig'i 0 → 100%
 *   2.7–3.2s  fade/zoom olib tashlash → asl ekranga o'tish
 */

const T = {
  start: 0,
  logo: 0.5,
  scan: 1.1,
  name: 1.7,
  progress: 2.3,
  exit: 2.7,
  leave: 3.15,
};

/** Aniq (deterministik) donachalar — qayta renderda farq qilmaydi. */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  delay: 0.2 + (i % 5) * 0.18,
  dur: 2.6 + (i % 4) * 0.5,
  o: 0.25 + (i % 4) * 0.12,
}));

export function SplashScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const isPremium = useAppStore((s) => s.isPremium);
  const t = useStrings();
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<number>(T.start);
  const [leaving, setLeaving] = useState(false);

  const elapsed = useMemo(() => phase, [phase]);

  useEffect(() => {
    // Harakatga sezgirlik: animatsiya o'rniga qisqa, statik kirish.
    if (reduced) {
      const id = setTimeout(() => finish(), 500);
      return () => clearTimeout(id);
    }
    const timers = [
      setTimeout(() => setPhase(T.logo), T.logo * 1000),
      setTimeout(() => setPhase(T.scan), T.scan * 1000),
      setTimeout(() => setPhase(T.name), T.name * 1000),
      setTimeout(() => setPhase(T.progress), T.progress * 1000),
      setTimeout(() => setPhase(T.exit), T.exit * 1000),
      setTimeout(() => setLeaving(true), 2800),
      setTimeout(() => finish(), T.leave * 1000),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function finish() {
    const loggedIn = !!getCurrent();
    if (!loggedIn) navigate("login");
    else navigate(onboardingDone ? "dashboard" : "onboarding");
  }

  const logoVisible = elapsed >= T.logo;
  const scanActive = elapsed >= T.scan;
  const nameVisible = elapsed >= T.name;
  const progressActive = elapsed >= T.progress;
  const exiting = elapsed >= T.exit;
  const title = t.brand; // "CORPUS" — loyihaning o'z nomi

  return (
    <div className="relative flex flex-1 select-none flex-col items-center justify-center overflow-hidden bg-[#0a0b16] text-white">
      {/* Qorong'u kinematik gradient (binafsha/ko'k nur) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#151030] via-[#0b0d1c] to-[#060711]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-[#0EA5E9]/12 blur-[120px]" />

      {/* Aniq anatomik/ilmiy grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Suzuvchi donachalar */}
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, opacity: p.o }}
            animate={{ y: [0, -18, 0], x: [0, i % 2 ? 6 : -6, 0], opacity: [p.o * 0.4, p.o, p.o * 0.4] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Tibbiy skan — gorizontal nur */}
      <motion.div
        className="pointer-events-none absolute inset-y-0"
        style={{ width: "24%" }}
        initial={false}
        animate={scanActive ? { x: ["-30%", "130%"] } : { x: "-30%" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/70" />
      </motion.div>

      <AnimatePresence>
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 1, scale: 1 }}
          animate={exiting ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo: aynan mavjud rasm, o'zgarmaydi */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            {logoVisible && (
              <>
                {/* yumshoq halo */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/35 blur-2xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.8, 0.45], scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/10"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1.15 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              </>
            )}

            <motion.div
              initial={false}
              animate={
                logoVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.75 }
              }
              transition={{ duration: reduced ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-28 w-28 items-center justify-center"
            >
              <Logo size={112} />
            </motion.div>

            {/* radial nur (skan payti) */}
            <motion.div
              className="pointer-events-none absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(162,155,254,0.16) 0%, rgba(162,155,254,0.05) 45%, transparent 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={scanActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>

          {/* Nom: loyihaning o'z nomi (t.brand) */}
          <div className="relative mt-7 h-11 overflow-hidden">
            <AnimatePresence>
              {nameVisible && (
                <motion.h1
                  key="title"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl font-bold tracking-[0.18em] text-white"
                >
                  {title}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-1 text-xs font-medium tracking-[0.22em] text-white/45">
            {t.tagline.toUpperCase()}
          </p>

          {/* Premium belgisi (mavjud) */}
          {isPremium && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-4 py-1.5 text-xs font-bold text-[#1a1230] shadow-pop"
            >
              <Crown className="h-3.5 w-3.5" aria-hidden /> PREMIUM
            </motion.span>
          )}

          {/* Yuklash chizig'i 0 → 100% */}
          <div className="relative mt-8 h-1 w-44 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-soft to-primary"
              initial={{ width: "0%" }}
              animate={progressActive ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: reduced ? 0.01 : 0.42, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Chiqish (leaving) oldidan butun ekranni qoraytirib, o'tishni yumshatamiz */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#0a0b16]"
        initial={{ opacity: 0 }}
        animate={leaving ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
    </div>
  );
}
