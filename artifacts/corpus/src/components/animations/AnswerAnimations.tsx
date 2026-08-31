/**
 * Savolga javob berish uchun savol tuplari bo'yicha animatsiyalar.
 * Turli savol turlari → turli animation effektlari.
 */

import { motion } from "motion/react";
import React from "react";

export type QuestionType = "quiz" | "img" | "match" | "build" | "tf" | "order" | "fill" | "func";

/**
 * To'g'ri javobning animatsiyasi
 */
export const CorrectAnimation: React.FC<{
  type: QuestionType;
  children: React.ReactNode;
}> = ({ type, children }) => {
  const variants = {
    quiz: {
      scale: [1, 1.15, 1],
      backgroundColor: ["transparent", "rgba(0, 184, 148, 0.2)", "transparent"],
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    img: {
      y: [0, -20, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 0.7, ease: "easeOut" },
    },
    match: {
      x: [0, 10, -10, 0],
      transition: { duration: 0.6, repeat: 2 },
    },
    build: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
      transition: { duration: 0.8 },
    },
    tf: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.6 },
    },
    order: {
      x: [0, 20, 0],
      transition: { duration: 0.5 },
    },
    fill: {
      backgroundColor: ["transparent", "rgba(108, 92, 231, 0.15)", "transparent"],
      transition: { duration: 0.7 },
    },
    func: {
      y: [0, -15, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.7 },
    },
  };

  const anim = variants[type] || variants.quiz;

  return (
    <motion.div animate={anim}>
      {children}
    </motion.div>
  );
};

/**
 * Noto'g'ri javobning animatsiyasi
 */
export const WrongAnimation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div
      animate={{
        x: [-15, 15, -15, 0],
        backgroundColor: ["transparent", "rgba(255, 67, 67, 0.2)", "transparent"],
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Particle Burst — to'g'ri javobda partiklalar
 */
export const ParticleBurst: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  const particles = Array.from({ length: 8 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
};

/**
 * Trophy Animation — to'g'ri javobda trophy shakli
 */
export const TrophyPop: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center text-6xl pointer-events-none"
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: -50, opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      🏆
    </motion.div>
  );
};

/**
 * Pulse Ring — to'g'ri javobda pulsating ring
 */
export const PulseRing: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl border-2 border-primary"
      initial={{ scale: 0.8, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
};

/**
 * Shake Effect — noto'g'ri javobda
 */
export const ShakeEffect: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
}> = ({ isActive, children }) => {
  if (!isActive) return <>{children}</>;

  return (
    <motion.div
      animate={{
        x: [-10, 10, -10, 10, 0],
        backgroundColor: ["transparent", "rgba(255, 67, 67, 0.1)", "transparent"],
      }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Success Checkmark Animation
 */
export const CheckmarkAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center text-5xl pointer-events-none"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      ✓
    </motion.div>
  );
};

/**
 * X Mark Animation — xato
 */
export const XMarkAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center text-5xl pointer-events-none text-danger"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      ✕
    </motion.div>
  );
};

/**
 * Sparkle Animation — savol tiplari uchun
 */
export const SparkleAnimation: React.FC<{
  isActive: boolean;
  count?: number;
}> = ({ isActive, count = 6 }) => {
  if (!isActive) return null;

  const sparkles = Array.from({ length: count });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((_, i) => {
        const delay = (i / count) * 0.2;
        const angle = (i / count) * Math.PI * 2;
        const distance = 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 text-xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay,
              ease: "easeOut",
            }}
          >
            ✨
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * Confetti Animation — katta bayram
 */
export const ConfettiAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  const confetti = Array.from({ length: 12 });

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {confetti.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.2;

        return (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              left: `${left}%`,
              top: "-20px",
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              top: "100vh",
              rotate: 360 * Math.random(),
              opacity: 0,
            }}
            transition={{
              duration: 2,
              delay,
              ease: "easeIn",
            }}
          >
            {["🎉", "🎊", "🎈", "⭐"][Math.floor(Math.random() * 4)]}
          </motion.div>
        );
      })}
    </div>
  );
};
