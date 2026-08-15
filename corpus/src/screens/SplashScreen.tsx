"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/useAppStore";

export function SplashScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    const t = setTimeout(() => navigate(onboardingDone ? "dashboard" : "onboarding"), 1900);
    return () => clearTimeout(t);
  }, [navigate, onboardingDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-gradient-to-br from-primary to-primary-soft px-8 text-white">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo variant="light" size={96} />
      </motion.div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">CORPUS</h1>
        <p className="mt-1 text-sm font-medium text-white/85">Learn Anatomy. Master Life.</p>
      </motion.div>

      {/* loading indicator */}
      <motion.div
        className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
