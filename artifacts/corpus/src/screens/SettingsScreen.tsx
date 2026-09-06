"use client";

import {
  Bell,
  Moon,
  Languages,
  Volume2,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Info,
  Trash2,
  Flag,
  Mail,
  AtSign,
  KeyRound,
  Check,
  Palette,
  Paintbrush,
} from "lucide-react";
import { useState, useId } from "react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAppStore, type InfoSection } from "@/store/useAppStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useHaptics } from "@/hooks/useHaptics";
import { useStrings } from "@/i18n";
import { updateEmail, updatePassword } from "@/lib/auth";

export function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const toggleSetting = useAppStore((s) => s.toggleSetting);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setThemeOption = useAppStore((s) => s.setThemeOption);
  const logout = useAppStore((s) => s.logout);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const openInfo = useAppStore((s) => s.openInfo);
  const navigate = useAppStore((s) => s.navigate);
  const currentUser = useAppStore((s) => s.currentUser);
  const updateUsername = useAppStore((s) => s.updateUsername);
  const t = useStrings();
  const { requestPermission } = useNotifications();
  const haptic = useHaptics();
  const themeSwitchId = useId();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Hisobni boshqarish (email / username / parol)
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [editPassword, setEditPassword] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [acctMsg, setAcctMsg] = useState<string | null>(null);
  const [acctErr, setAcctErr] = useState<string | null>(null);
  const [savingAcct, setSavingAcct] = useState(false);

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
      haptic(10);
      toggleSetting(key);
    }
  };

  /**
   * Orqa fon uslubi va tungi rejim bir-biri bilan bog'liq: "Tun" — bu tungi
   * rejimning o'zi. Shuning uchun ikkala boshqaruv ham sinxron ishlaydi,
   * aks holda fon qor bo'lib qolib, rejim almashuvi ko'rinmas edi.
   */
  const applyBackground = (id: "clean" | "lavender" | "mint" | "midnight") => {
    haptic(10);
    setThemeOption("backgroundStyle", id);
    if ((id === "midnight") !== settings.darkMode) toggleSetting("darkMode");
  };

  const toggleDarkMode = () => {
    haptic(10);
    const next = !settings.darkMode;
    toggleSetting("darkMode");
    if (next) setThemeOption("backgroundStyle", "midnight");
    else if (settings.backgroundStyle === "midnight") setThemeOption("backgroundStyle", "clean");
  };

  const rows = [
    { key: "notifications" as const, label: t.notifications, icon: Bell },
    { key: "darkMode" as const, label: t.darkMode, icon: Moon },
    { key: "sound" as const, label: t.soundEffects, icon: Volume2 },
  ];

  const clearAcctMsg = () => {
    setAcctMsg(null);
    setAcctErr(null);
  };

  const toggleEmail = () => {
    setEditEmail((v) => !v);
    setEmail(currentUser?.email ?? "");
    clearAcctMsg();
  };

  const toggleUsername = () => {
    setEditUsername((v) => !v);
    setUsername(currentUser?.username ?? "");
    clearAcctMsg();
  };

  const togglePassword = () => {
    setEditPassword((v) => !v);
    setPass("");
    setPass2("");
    clearAcctMsg();
  };

  const saveEmail = async () => {
    clearAcctMsg();
    setSavingAcct(true);
    const r = await updateEmail(email);
    setSavingAcct(false);
    if (!r.success) {
      setAcctErr(r.error || t.errEmail);
      return;
    }
    setAcctMsg(t.emailSaved);
    setEditEmail(false);
  };

  const saveUsername = async () => {
    clearAcctMsg();
    setSavingAcct(true);
    const r = await updateUsername(username);
    setSavingAcct(false);
    if (!r.success) {
      setAcctErr(r.error || t.errUsernameTaken);
      return;
    }
    setAcctMsg(t.usernameSaved);
    setEditUsername(false);
  };

  const savePassword = async () => {
    clearAcctMsg();
    if (pass.length < 6) {
      setAcctErr(t.errPasswordLen);
      return;
    }
    if (pass !== pass2) {
      setAcctErr(t.errPasswordMatch);
      return;
    }
    setSavingAcct(true);
    const r = await updatePassword(pass);
    setSavingAcct(false);
    if (!r.success) {
      setAcctErr(r.error || t.resetFail);
      return;
    }
    setAcctMsg(t.passwordSaved);
    setEditPassword(false);
    setPass("");
    setPass2("");
  };

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
              {r.key === "darkMode" ? (
                /* Matn ham <label> — qatorning o'zi bosilganda rejim almashadi. */
                <label
                  htmlFor={themeSwitchId}
                  className="min-w-0 flex-1 cursor-pointer break-words text-base font-medium"
                >
                  {r.label}
                </label>
              ) : (
                <span className="min-w-0 flex-1 break-words text-base font-medium">{r.label}</span>
              )}
              {r.key === "darkMode" ? (
                <ThemeSwitch
                  id={themeSwitchId}
                  checked={settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                  size={12}
                  label={r.label}
                />
              ) : (
                <Toggle checked={settings[r.key]} onChange={() => onToggle(r.key)} label={r.label} />
              )}
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

        {/* Telegram uslubidagi shaxsiylashtirish */}
        <Card className="mt-4 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Palette className="h-5 w-5" aria-hidden /></span>
            <div><p className="text-base font-semibold">Dizaynni sozlash</p><p className="text-xs text-muted">Ilovani o‘zingizga moslang</p></div>
          </div>
          <ThemeChoice label="Profil rangi" icon={<span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#FD79A8]" />}>
            {[{ id: "purple", color: "#6C5CE7" }, { id: "ocean", color: "#0984E3" }, { id: "coral", color: "#E84393" }, { id: "emerald", color: "#00B894" }].map((item) => (
              <button key={item.id} type="button" onClick={() => setThemeOption("themeColor", item.id as "purple" | "ocean" | "coral" | "emerald")} aria-label={`${item.id} profil rangi`} className={`h-8 w-8 rounded-full border-2 p-0.5 transition-transform active:scale-90 ${settings.themeColor === item.id ? "border-ink scale-110" : "border-transparent"}`}><span className="block h-full w-full rounded-full" style={{ backgroundColor: item.color }} /></button>
            ))}
          </ThemeChoice>
          <ThemeChoice label="Orqa fon" icon={<Paintbrush className="h-4 w-4" />}>
            {[{ id: "clean", label: "Toza", className: "bg-[#F8F9FA]" }, { id: "lavender", label: "Lavanda", className: "bg-[#F4F1FF]" }, { id: "mint", label: "Yashil", className: "bg-[#EFFBF8]" }, { id: "midnight", label: "Tun", className: "bg-[#202231]" }].map((item) => (
              <button key={item.id} type="button" onClick={() => applyBackground(item.id as "clean" | "lavender" | "mint" | "midnight")} className={`rounded-xl border px-2 py-1.5 text-[10px] font-semibold transition active:scale-95 ${item.className} ${settings.backgroundStyle === item.id ? "border-primary ring-2 ring-primary/20" : "border-line text-muted"}`}>{item.label}</button>
            ))}
          </ThemeChoice>
          <ThemeChoice label="Tugmalar" icon={<span className="text-xs font-bold">Aa</span>}>
            {[{ id: "pill", label: "Pill" }, { id: "rounded", label: "Yumaloq" }, { id: "square", label: "Klassik" }].map((item) => (
              <button key={item.id} type="button" onClick={() => setThemeOption("buttonStyle", item.id as "pill" | "rounded" | "square")} className={`rounded-[var(--button-radius,1rem)] border px-3 py-1.5 text-[10px] font-semibold transition active:scale-95 ${settings.buttonStyle === item.id ? "border-primary bg-primary text-white" : "border-line bg-surface2 text-muted"}`}>{item.label}</button>
            ))}
          </ThemeChoice>
        </Card>

        {/* Hisob — email / username / parol */}
        <Card className="mt-4 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium">{t.account}</p>
              <p className="text-xs text-muted">{t.accountSubtitle}</p>
            </div>
          </div>

          {/* Email */}
          <div className="border-b border-line px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.email}</p>
                {!editEmail ? (
                  <p className="truncate text-base font-medium">{currentUser?.email ?? "—"}</p>
                ) : null}
              </div>
              {!editEmail && (
                <button
                  onClick={toggleEmail}
                  className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {t.changeEmail}
                </button>
              )}
            </div>

            {editEmail && (
              <div className="mt-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newEmail}
                  autoComplete="email"
                  className="w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
                />
                <p className="mt-2 text-xs text-muted">{t.emailChangeHint}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={toggleEmail}
                    className="flex-1 rounded-3xl bg-surface2 px-6 py-3 text-center text-base font-semibold text-muted transition-all duration-150 active:scale-[.97]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => void saveEmail()}
                    disabled={savingAcct}
                    className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-soft transition-all duration-150 active:scale-[.97]"
                  >
                    {savingAcct ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <Check className="h-5 w-5" aria-hidden />
                    )}
                    {t.saveProfile}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="border-b border-line px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
                <AtSign className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.username}</p>
                {!editUsername ? (
                  <p className="truncate text-base font-medium">{currentUser?.username ?? "—"}</p>
                ) : null}
              </div>
              {!editUsername && (
                <button
                  onClick={toggleUsername}
                  className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {t.changeUsername}
                </button>
              )}
            </div>

            {editUsername && (
              <div className="mt-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.newUsername}
                  autoComplete="username"
                  maxLength={20}
                  className="w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
                />
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={toggleUsername}
                    className="flex-1 rounded-3xl bg-surface2 px-6 py-3 text-center text-base font-semibold text-muted transition-all duration-150 active:scale-[.97]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => void saveUsername()}
                    disabled={savingAcct}
                    className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-soft transition-all duration-150 active:scale-[.97]"
                  >
                    {savingAcct ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <Check className="h-5 w-5" aria-hidden />
                    )}
                    {t.saveProfile}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Parol */}
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-muted">
                <KeyRound className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.password}</p>
                {!editPassword ? (
                  <p className="text-base font-medium">••••••••</p>
                ) : null}
              </div>
              {!editPassword && (
                <button
                  onClick={togglePassword}
                  className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {t.changePassword}
                </button>
              )}
            </div>

            {editPassword && (
              <div className="mt-3 flex flex-col gap-3">
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder={t.newPassword}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
                />
                <input
                  type="password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  placeholder={t.passwordAgain}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base font-medium outline-none focus:border-primary"
                />
                <div className="flex gap-3">
                  <button
                    onClick={togglePassword}
                    className="flex-1 rounded-3xl bg-surface2 px-6 py-3 text-center text-base font-semibold text-muted transition-all duration-150 active:scale-[.97]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => void savePassword()}
                    disabled={savingAcct}
                    className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-soft transition-all duration-150 active:scale-[.97]"
                  >
                    {savingAcct ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <Check className="h-5 w-5" aria-hidden />
                    )}
                    {t.saveProfile}
                  </button>
                </div>
              </div>
            )}
          </div>

          {(acctMsg || acctErr) && (
            <div className="border-t border-line px-4 py-3">
              {acctErr && <p className="text-sm font-medium text-danger">{acctErr}</p>}
              {acctMsg && <p className="text-sm font-medium text-success">{acctMsg}</p>}
            </div>
          )}
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

function ThemeChoice({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="mt-4 flex items-center gap-3"><div className="flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-muted">{icon}{label}</div><div className="flex shrink-0 items-center gap-2">{children}</div></div>;
}
