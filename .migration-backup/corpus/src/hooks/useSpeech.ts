"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Browser SpeechSynthesis asosida lotincha atamalarni talaffuz qilish.
 * Server kerak emas — brauzerning o'z ovozi ishlatiladi.
 * Lotincha uchun `la`/`it` ovozini, topilmasa `en` ni tanlaydi.
 */
export function useSpeech() {
  const enabled = useAppStore((s) => s.settings.sound);

  return useCallback(
    (text: string, lang = "la") => {
      if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const clean = text.replace(/[()[\]{}]/g, "").replace(/\s+/g, " ").trim();
      if (!clean) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean);
        const voices = window.speechSynthesis.getVoices();
        const prefer = [lang, lang === "la" ? "it-IT" : lang, "en-US", "en-GB", "en"];
        for (const p of prefer) {
          const v = voices.find((v) => v.lang.toLowerCase().startsWith(p.toLowerCase()));
          if (v) { u.voice = v; break; }
        }
        u.lang = lang;
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      } catch {
        /* no-op */
      }
    },
    [enabled],
  );
}
