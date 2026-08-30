"use client";

import { useEffect } from "react";

/**
 * Service worker'ni ro'yxatdan o'tkazish (offline PWA) VA
 * brauzerning tabiiy "Ilovani o'rnatish" (Add to Home Screen) taklifini butunlay
 * o'chirish. Bu komponent har doim yuklanadi (layout'da), shuning uchun
 * beforeinstallprompt hodisasi har safar ushlanadi — pastda o'rnatish tugmasi chiqmaydi.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Brauzerning avtomatik o'rnatish taklifini o'chiramiz (hech qanday o'rnatish tugmasi yo'q).
    const suppressInstall = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("beforeinstallprompt", suppressInstall);

    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline rejim ishlamay qolsa ham ilova ishlayveradi */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => {
      window.removeEventListener("beforeinstallprompt", suppressInstall);
    };
  }, []);

  return null;
}
