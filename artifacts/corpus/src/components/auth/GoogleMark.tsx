"use client";

/**
 * Google belgisi — "Google bilan kirish" tugmasi uchun.
 *
 * Zanjir: foydalanuvchi yuklagan animatsiyali GIF → mahalliy animatsiyali
 * SVG (xuddi shu "in-reveal" effekti) → statik FcGoogle belgisi.
 *
 * - `mode="loop"` (standart): animatsiya doimiy aylanadi, sichqoncha olib
 *   borilganda boshidan ijro etiladi.
 * - `mode="reveal"`: animatsiya faqat ekranga chiqqanda (va hover'da) bir
 *   marta ochiladi, keyin statik belgi qoladi.
 *
 * Harakat kamaytirilgan va low-end qurilmalarda animatsiya o'chiriladi.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/utils/cn";
import "./GoogleMark.css";

export const GOOGLE_MARK_GIF = "/img/stickers/logo-google-in-reveal.gif";
export const GOOGLE_MARK_SVG = "/img/stickers/logo-google-in-reveal.svg";

/** Animatsiya davomiyliklari (ms) — reveal rejimi uchun. */
const GIF_MS = 2000;
const SVG_MS = 3000;
/** Statik belgi uchun CSS reveal animatsiyasi davomiyligi (ms). */
const STATIC_MS = 700;

type Stage = "gif" | "svg" | "static";

function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (document.documentElement.classList.contains("low-end")) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GoogleMark({
  size = 20,
  mode = "loop",
  className,
}: {
  size?: number;
  mode?: "loop" | "reveal";
  className?: string;
}) {
  const [stage, setStage] = useState<Stage>("gif");
  const [playing, setPlaying] = useState(false);
  const [playId, setPlayId] = useState(0);
  const timer = useRef<number | null>(null);

  const play = useCallback(() => {
    if (!motionAllowed()) return;
    setPlaying(true);
    setPlayId((n) => n + 1);
    if (timer.current) window.clearTimeout(timer.current);
    if (mode === "reveal" || stage === "static") {
      const ms = stage === "static" ? STATIC_MS : stage === "svg" ? SVG_MS : GIF_MS;
      timer.current = window.setTimeout(() => setPlaying(false), ms);
    }
  }, [mode, stage]);

  useEffect(() => {
    play();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [play]);

  const src = stage === "gif" ? GOOGLE_MARK_GIF : GOOGLE_MARK_SVG;

  return (
    <span
      className={cn(
        "google-mark",
        mode === "loop" ? "google-mark--loop" : "google-mark--reveal",
        playing && "google-mark--playing",
        className,
      )}
      style={{ width: size, height: size }}
      onMouseEnter={play}
    >
      <FcGoogle className="google-mark__icon" size={size} aria-hidden />
      {stage !== "static" && (
        <img
          key={`${stage}-${playId}`}
          src={src}
          alt=""
          width={size}
          height={size}
          draggable={false}
          decoding="async"
          className="google-mark__gif"
          onError={() => setStage(stage === "gif" ? "svg" : "static")}
        />
      )}
    </span>
  );
}
