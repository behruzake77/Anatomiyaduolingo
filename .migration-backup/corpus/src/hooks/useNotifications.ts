"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Bildirishnomalar — Notification API asosida.
 * Ruxsat so'rash + lokal bildirishnoma yuborish (ilova ochiq/installed bo'lganda).
 * Eslatma: ilova YOPIQ bo'lganda keladigan push uchun alohida server kerak
 * (Web Push / VAPID) — bu lokal qatlam eng ko'p ishlatiladigan holatni qamrab oladi.
 */
export function useNotifications() {
  const enabled = useAppStore((s) => s.settings.notifications);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    } catch {
      return false;
    }
  }, []);

  const notify = useCallback(
    (title: string, body: string) => {
      if (!enabled || typeof window === "undefined" || !("Notification" in window)) return;
      try {
        if (Notification.permission === "granted") {
          new Notification(title, { body, icon: "/logo/icon-192.png", badge: "/logo/icon-192.png" });
        }
      } catch {
        /* no-op */
      }
    },
    [enabled],
  );

  const canUse = typeof window !== "undefined" && "Notification" in window;

  return { requestPermission, notify, canUse, permission: canUse ? Notification.permission : "unsupported" };
}
