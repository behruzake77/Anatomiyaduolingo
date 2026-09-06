"use client";

/**
 * Google belgisi — "Google bilan kirish" tugmasi uchun.
 *
 * - `mode="loop"` (standart): animatsiyali GIF doimiy aylanadi, sichqoncha
 *   olib borilganda boshidan ijro etiladi.
 * - `mode="reveal"`: GIF faqat ekranga chiqqanda (va hover'da) bir marta
 *   "in-reveal" bo'lib ochiladi, keyin statik belgi qoladi.
 *
 * GIF topilmasa — statik FcGoogle belgisi shu tartibda jonlanadi (scale+fade),
 * shunda tugma baribir "tirik" ko'rinadi. Harakat kamaytirilgan va low-end
 * qurilmalarda animatsiya o'chiriladi.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/utils/cn";
import "./GoogleMark.css";

export const GOOGLE_MARK_GIF = "/img/stickers/logo-google-in-reveal.gif";

/** Lordicon "in-reveal" animatsiyasining taxminiy davomiyligi (ms). */
const GIF_MS = 2000;
/** Statik belgi uchun CSS reveal animatsiyasi davomiyligi (ms). */
const STATIC_MS = 700;

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
  const [broken, setBroken] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playId, setPlayId] = useState(0);
  const timer = useRef<number | null>(null);

  const play = useCallback(() => {
    if (!motionAllowed()) return;
    setPlaying(true);
    setPlayId((n) => n + 1);
    if (timer.current) window.clearTimeout(timer.current);
    if (mode === "reveal" || broken) {
      timer.current = window.setTimeout(() => setPlaying(false), broken ? STATIC_MS : GIF_MS);
    }
  }, [broken, mode]);

  useEffect(() => {
    play();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [play]);

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
      {!broken && (
        <img
          key={playId}
          src={GOOGLE_MARK_GIF}
          alt=""
          width={size}
          height={size}
          draggable={false}
          decoding="async"
          className="google-mark__gif"
          onError={() => setBroken(true)}
        />
      )}
    </span>
  );
}
