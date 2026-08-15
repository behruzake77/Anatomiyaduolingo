"use client";

import { Bell, Moon, Languages, Volume2, Shield, FileText, LogOut, ChevronRight } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

export function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const toggleSetting = useAppStore((s) => s.toggleSetting);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const navigate = useAppStore((s) => s.navigate);
  const t = useStrings();

  const rows = [
    { key: "notifications" as const, label: t.notifications, icon: Bell },
    { key: "darkMode" as const, label: t.darkMode, icon: Moon },
    { key: "sound" as const, label: t.soundEffects, icon: Volume2 },
  ];

  return (
    <Screen className="pt-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.settings}</h1>
        <p className="text-sm text-muted">{t.settingsSubtitle}</p>
      </header>

      {/* toggles */}
      <Card className="mt-5 overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={r.key}
            className={"flex items-center gap-3 px-4 py-3.5 " + (i > 0 ? "border-t border-line" : "")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1 text-base font-medium">{r.label}</span>
            <Toggle checked={settings[r.key]} onChange={() => toggleSetting(r.key)} label={r.label} />
          </div>
        ))}

        {/* language */}
        <div className="flex items-center gap-3 border-t border-line px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex-1 text-base font-medium">{t.language}</span>
          <select
            value={settings.language}
            onChange={(e) => setLanguage(e.target.value as "en" | "uz")}
            className="rounded-xl border border-line bg-surface2 px-3 py-1.5 text-sm font-medium"
            aria-label={t.language}
          >
            <option value="uz">O&lsquo;zbekcha</option>
            <option value="en">English</option>
          </select>
        </div>
      </Card>

      {/* links */}
      <Card className="mt-4 overflow-hidden">
        {[
          { label: t.privacy, icon: Shield },
          { label: t.terms, icon: FileText },
        ].map((l, i) => (
          <button
            key={l.label}
            className={
              "flex w-full items-center gap-3 px-4 py-3.5 text-left " + (i > 0 ? "border-t border-line" : "")
            }
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface2 text-muted">
              <l.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1 text-base font-medium">{l.label}</span>
            <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
          </button>
        ))}
        <button
          onClick={() => {
            resetProgress();
            navigate("dashboard");
          }}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left text-danger"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <LogOut className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex-1 text-base font-medium">{t.resetLogout}</span>
        </button>
      </Card>
    </Screen>
  );
}
