"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * PWA o'rnatish taklifi (`beforeinstallprompt`) — brauzer/telefon "Bosh ekranga
 * qo'shish" imkonini beradigan paytda hodisa keladi. Biz uni ushlab,
 * foydalanuvchiga tugma orqali o'rnatish taklif qilamiz.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export interface InstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
}

export function useInstallPrompt() {
  const [state, setState] = useState<InstallState>(() => ({
    canInstall: false,
    isInstalled: false,
    isIOS: false,
  }));

  useEffect(() => {
    const update = () => {
      const standalone =
        (typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)")?.matches) ||
        (typeof navigator !== "undefined" && (navigator as { standalone?: boolean }).standalone === true);
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isIOS = /iphone|ipad|ipod/i.test(ua) && !/msie|trident/i.test(ua);
      setState({
        canInstall: !!deferred && !standalone,
        isInstalled: !!standalone,
        isIOS,
      });
    };
    update();
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferred) return false;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        deferred = null;
        notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return { ...state, install };
}
