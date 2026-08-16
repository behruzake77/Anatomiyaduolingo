"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

type Mode = "register" | "login";

export function LoginScreen() {
  const register = useAppStore((s) => s.register);
  const login = useAppStore((s) => s.login);
  const t = useStrings();

  const [mode, setMode] = useState<Mode>("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (!username.trim() || !password) {
      setError(t.errEmpty);
      return;
    }
    const ok = mode === "register" ? register(username, password) : login(username, password);
    if (!ok) {
      setError(mode === "register" ? t.errExists : t.errLogin);
    }
    // muvaffaqiyatli bo'lsa store ekranni o'zi almashtiradi
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-surface shadow-soft">
          <Logo size={84} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.brand}</h1>
          <p className="mt-1 text-sm text-muted">{t.tagline}</p>
        </div>
      </motion.div>

      {/* mode toggle */}
      <div className="mt-8 flex rounded-2xl border border-line bg-surface2 p-1">
        {(
          [
            { id: "register", label: t.registerBtn },
            { id: "login", label: t.loginBtn },
          ] as { id: Mode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              setError(null);
            }}
            className={
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
              (mode === m.id ? "bg-surface text-ink shadow-soft" : "text-muted")
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* form */}
      <div className="mt-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <User className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.username}
            autoComplete="username"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <Lock className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.password}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button size="lg" className="w-full" onClick={submit}>
          {mode === "register" ? t.registerBtn : t.loginBtn}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Button>

        <p className="text-center text-sm text-muted">{mode === "register" ? t.haveAccount : t.noAccount}</p>
      </div>
    </div>
  );
}
