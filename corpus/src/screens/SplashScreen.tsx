"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Crown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { getCurrent } from "@/auth";

export function SplashScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const isPremium = useAppStore((s) => s.isPremium);
  const t = useStrings();

  useEffect(() => {
    const time = setTimeout(() => {
      const loggedIn = !!getCurrent();
      if (!loggedIn) navigate("login");
      else navigate(onboardingDone ? "dashboard" : "onboarding");
    }, 2000);
    return () => clearTimeout(time);
  }, [navigate, onboardingDone]);

  // Premium — oltin/quyuq muhit; bepul — binafsha.
  const bg = isPremium
    ? "bg-gradient-to-br from-[#1a1230] via-[#2d1f4e] to-[#0e0b1a]"
    : "bg-gradient-to-br from-primary to-primary-soft";

  return (
    <div className={`relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden px-8 text-white ${bg}`}>
      {/* premium zarralar */}
      {isPremium && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F5C04E]/25 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
          </div>
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#F5C04E]"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                opacity: 0.7,
              }}
              animate={{ y: [0, -16, 0], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2.4 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </>
      )}

      <div className="relative">
        {/* shimmer */}
        <motion.div
          className="absolute inset-0 -z-0 overflow-hidden rounded-[28px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="absolute -inset-y-10 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ["-150%", "350%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-32 w-32 items-center justify-center rounded-[28px] bg-white/95 shadow-pop"
        >
          <Logo size={104} />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="relative text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">{t.brand}</h1>
        <p className="mt-1 text-sm font-medium text-white/85">{t.tagline}</p>
      </motion.div>

      {/* premium belgisi */}
      {isPremium && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F5C04E] to-[#E0A030] px-4 py-1.5 text-xs font-bold text-[#1a1230] shadow-pop"
        >
          <Crown className="h-3.5 w-3.5" aria-hidden /> PREMIUM
        </motion.span>
      )}

      {/* loading indicator */}
      <motion.div
        className="relative mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <motion.div
          className={`h-full rounded-full ${isPremium ? "bg-[#F5C04E]" : "bg-white"}`}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
