"use client";

import { useEffect } from "react";

/** Service worker'ni ro'yxatdan o'tkazish (offline PWA). */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline rejim ishlamay qolsa ham ilova ishlayveradi */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
