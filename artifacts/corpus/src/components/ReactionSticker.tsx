"use client";

/**
 * Javobdan keyin chiqadigan qurbaqa sticker to'plami.
 * To'g'ri / noto'g'ri pooldan savol seediga qarab aylanadi.
 */
import { motion } from "motion/react";
import { cn } from "@/utils/cn";

const OK = [
  "/img/stickers/ok-1.jpg",
  "/img/stickers/ok-2.jpg",
  "/img/stickers/ok-3.jpg",
  "/img/stickers/ok-4.jpg",
  "/img/stickers/ok-5.jpg",
  "/img/stickers/ok-6.jpg",
] as const;

const BAD = [
  "/img/stickers/bad-1.jpg",
  "/img/stickers/bad-2.jpg",
  "/img/stickers/bad-3.jpg",
  "/img/stickers/bad-4.jpg",
] as const;

function hashSeed(seed: string | number): number {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pickReactionSrc(ok: boolean, seed: string | number = 0): string {
  const pool = ok ? OK : BAD;
  return pool[hashSeed(seed) % pool.length];
}

export function ReactionSticker({
  ok,
  seed = 0,
  size = "md",
  className,
  label,
}: {
  ok: boolean;
  seed?: string | number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const src = pickReactionSrc(ok, seed);
  const dim = size === "lg" ? "h-40 w-40" : size === "sm" ? "h-[4.5rem] w-[4.5rem]" : "h-28 w-28";
  return (
    <motion.img
      key={`${ok}-${src}`}
      src={src}
      alt={label ?? ""}
      draggable={false}
      initial={{ scale: 0.28, rotate: ok ? -16 : 14, opacity: 0, y: 22 }}
      animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 460, damping: 16 }}
      className={cn("pointer-events-none select-none object-contain drop-shadow-lg", dim, className)}
    />
  );
}
