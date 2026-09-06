"use client";

/**
 * Google belgisi — "Google bilan kirish" tugmasi uchun.
 *
 * - Ekranga chiqqanda (register/login ekrani ochilganda) animatsiyali GIF
 *   bir marta "in-reveal" bo'lib ochiladi, keyin statik belgi qoladi.
 * - Sichqoncha olib borilganda (hover) animatsiya qayta ijro etiladi.
 * - GIF topilmasa yoki harakat o'chirilgan bo'lsa — statik FcGoogle belgisi.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/utils/cn";
import "./GoogleMark.css";

export const GOOGLE_MARK_GIF = "/img/stickers/logo-google-in-reveal.gif";

/** Lordicon "in-reveal" animatsiyasining taxminiy davomiyligi (ms). */
const REVEAL_MS = 2000;

function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (document.documentElement.classList.contains("low-end")) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GoogleMark({ size = 20, className }: { size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playId, setPlayId] = useState(0);
  const timer = useRef<number | null>(null);

  const play = useCallback(() => {
    if (broken || !motionAllowed()) return;
    setPlaying(true);
    setPlayId((n) => n + 1);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(false), REVEAL_MS);
  }, [broken]);

  useEffect(() => {
    play();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [play]);

  return (
    <span
      className={cn("google-mark", playing && "google-mark--playing", className)}
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
