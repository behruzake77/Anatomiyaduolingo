"use client";

import { Bell, Moon, Languages, Volume2, Shield, FileText, LogOut, ChevronRight, Info, Trash2, Flag, User } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { useAppStore, type InfoSection } from "@/store/useAppStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useStrings } from "@/i18n";

export function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const toggleSetting = useAppStore((s) => s.toggleSetting);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const logout = useAppStore((s) => s.logout);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const openInfo = useAppStore((s) => s.openInfo);
  const navigate = useAppStore((s) => s.navigate);
  const t = useStrings();
  const { requestPermission } = useNotifications();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentUser = useAppStore((s) => s.currentUser);
  const updateUsername = useAppStore((s) => s.updateUsername);
  const updateBirthYear = useAppStore((s) => s.updateBirthYear);
  const [uname, setUname] = useState(currentUser?.username ?? "");
  const thisYear = new Date().getFullYear();
  const [byear, setByear] = useState(String(currentUser?.birthYear ?? ""));
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setProfileErr(null);
    setProfileMsg(null);
    setSaving(true);
    if (uname.trim() && uname.trim() !== currentUser?.username) {
      const r = await updateUsername(uname);
      if (!r.success) {
        setSaving(false);
        setProfileErr(r.error || t.errUsernameTaken);
        return;
      }
    }
    const y = Number(byear);
    if (y && y !== currentUser?.birthYear) {
      const r = await updateBirthYear(y);
      if (!r.success) {
        setSaving(false);
        setProfileErr(r.error || t.errBirthYear);
        return;
      }
    }
    setSaving(false);
    setProfileMsg(t.profileSaved);
  };

  const onToggle = async (key: "notifications" | "darkMode" | "sound") => {
    if (key === "notifications" && !settings.notifications) {
      // Yoqilayotganda brauzerdan ruxsat so'rash.
      const granted = await requestPermission();
      toggleSetting(key);
      if (granted) {
        try {
          new Notification(t.notifWelcome, { body: t.notifReminder });
        } catch {
          /* no-op */
        }
      }
    } else {
      toggleSetting(key);
    }
  };

  const rows = [
    { key: "notifications" as const, label: t.notifications, icon: Bell },
    { key: "darkMode" as const, label: t.darkMode, icon: Moon },
    { key: "sound" as const, label: t.soundEffects, icon: Volume2 },
  ];

  return (
    <Screen padded={false}>
      <TopBar title={t.settings} />
      <div className="px-5 pb-28">
      <p className="text-sm text-muted">{t.settingsSubtitle}</p>

      {/* toggles */}
      <Card className="mt-5 overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={r.key}
            className={"flex items-center gap-3 px-4 py-3.5 " + (i > 0 ? "border-t border-line" : "")}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 break-words text-base font-medium">{r.label}</span>
            <Toggle checked={settings[r.key]} onChange={() => onToggle(r.key)} label={r.label} />
          </div>
        ))}

        {/* language */}
        <div className="flex items-center gap-3 border-t border-line px-4 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 break-words text-base font-medium">{t.language}</span>
          <select
            value={settings.language}
            onChange={(e) => setLanguage(e.target.value as "en" | "uz")}
            className="max-w-[45%] shrink-0 rounded-xl border border-line bg-surface2 px-3 py-1.5 text-sm font-medium"
            aria-label={t.language}
          >
            <option value="uz">O&lsquo;zbekcha</option>
            <option value="en">English</option>
          </select>
        </div>
      </Card>

      {/* links */}
      <Card className="mt-4 overflow-hidden">
        <button
          onClick={() => navigate("inbox")}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
            <Bell className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 break-words text-base font-medium">{t.inboxTitle}</span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        </button>
        <button
          onClick={() => navigate("feedback")}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left transition hover:bg-surface2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
            <Flag className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 break-words text-base font-medium">{t.feedbackTitle}</span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        </button>
        {[
          { label: t.about, icon: Info, section: "about" as InfoSection },
          { label: t.privacy, icon: Shield, section: "privacy" as InfoSection },
          { label: t.terms, icon: FileText, section: "terms" as InfoSection },
        ].map((l) => (
          <button
            key={l.section}
            onClick={() => openInfo(l.section)}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left transition hover:bg-surface2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
              <l.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 break-words text-base font-medium">{l.label}</span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
          </button>
        ))}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left text-danger"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <LogOut className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex-1 text-base font-medium">{t.logout}</span>
        </button>

        {/* Hisobni o'chirish — Play siyosati: majburiy, ikki bosqichli tasdiqlash */}
        <button
          onClick={() => (confirmDelete ? deleteAccount() : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          className={`flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left text-danger ${
            confirmDelete ? "bg-danger text-white" : ""
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              confirmDelete ? "bg-white/15 text-white" : "bg-danger/10 text-danger"
            }`}
          >
            <Trash2 className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 break-words text-base font-medium">
            {confirmDelete ? t.deleteAccountConfirm : t.deleteAccount}
          </span>
        </button>
      </Card>
    </div>
    </Screen>
  );
}
