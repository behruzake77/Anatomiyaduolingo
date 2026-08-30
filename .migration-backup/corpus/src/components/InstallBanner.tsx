"use client";

/**
 * PWA o'rnatish banneri — ilova hali o'rnatilmagan bo'lsa foydalanuvchini
 * "Bosh ekranga qo'shish"ga undaydi.
 *  - Android/Chrome: `beforeinstallprompt` → "O'rnatish" tugmasi
 *  - iOS Safari: ko'rsatma (Share → Bosh ekranga qo'shish)
 * Yopilganda takror bezovta qilmaslik uchun localStorage'da eslab qolinadi.
 */

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useStrings } from "@/i18n";

const DISMISS_KEY = "corpus-install-dismissed";

export function InstallBanner() {
  const { canInstall, isInstalled, isIOS, install } = useInstallPrompt();
  const t = useStrings();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      /* no-op */
    }
  }, []);

  // O'rnatilgan yoki yopilgan bo'lsa ko'rsatilmaydi.
  if (isInstalled || dismissed) return null;
  // Android'da taklif mavjud emas va iOS ham emas → ko'rsatilmaydi.
  if (!canInstall && !isIOS) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Download className="h-6 w-6" aria-hidden />
      </div>

      {isIOS ? (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t.installIosTitle}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            {t.installIosHint1}
            <Share className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t.installIosHint2}
          </p>
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t.installTitle}</p>
          <p className="mt-0.5 text-xs text-muted">{t.installHint}</p>
        </div>
      )}

      {!isIOS && (
        <button
          onClick={async () => {
            setInstalling(true);
            await install();
            setInstalling(false);
          }}
          disabled={installing}
          className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
        >
          {installing ? "…" : t.installBtn}
        </button>
      )}

      <button
        onClick={dismiss}
        aria-label={t.zoomClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface2"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
