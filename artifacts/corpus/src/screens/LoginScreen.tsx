"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { User, Lock, ArrowRight, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAppStore } from "@/store/useAppStore";
import { fmt, useStrings } from "@/i18n";
import { isPasswordRecovery, loginWithGoogle, resetPassword, updatePassword } from "@/lib/auth";

type Mode = "register" | "login";
type Step = "form" | "otp" | "forgot" | "newpass";

const RESEND_SECONDS = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
  const register = useAppStore((s) => s.register);
  const login = useAppStore((s) => s.login);
  const verifyOtp = useAppStore((s) => s.verifyOtp);
  const resendOtp = useAppStore((s) => s.resendOtp);
  const t = useStrings();

  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpBusy = useRef(false);
  const lastTriedOtp = useRef("");
  const thisYear = new Date().getFullYear();

  useEffect(() => {
    if (isPasswordRecovery()) setStep("newpass");
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [resendIn]);

  const goToOtp = () => {
    setStep("otp");
    setOtp("");
    lastTriedOtp.current = "";
    setError(null);
    setInfo(null);
    setResendIn(RESEND_SECONDS);
  };

  const submit = async () => {
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password || (mode === "register" && !username.trim())) {
      setError(t.errEmpty);
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError(t.errEmail);
      return;
    }
    if (password.length < 6) {
      setError(t.errPasswordLen);
      return;
    }

    setLoading(true);

    // Select qiymati string bo'ladi. Oldingi kod bu yerda mavjud bo'lmagan
    // `year` o'zgaruvchisidan foydalangan va ro'yxatdan o'tish tugmasi bosilganda
    // ReferenceError sabab loading holatida abadiy qolib ketgan.
    const year = birthYear ? Number(birthYear) : undefined;

    try {
      const result =
        mode === "register"
          ? await register(cleanEmail, password, username.trim(), year)
          : await login(cleanEmail, password);

      if (result.needsVerification) {
        setEmail(cleanEmail);
        goToOtp();
        if (result.error) setInfo(result.error);
        return;
      }

      if (!result.success) {
        setError(result.error || (mode === "register" ? t.errExists : t.errLogin));
      }
    } catch {
      setError(mode === "register" ? "Ro'yxatdan o'tishda xatolik" : "Kirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (code = otp) => {
    const token = code.replace(/\D/g, "");
    if (token.length !== 6) {
      setError(t.otpInvalid);
      return;
    }
    if (otpBusy.current || lastTriedOtp.current === token) return;
    lastTriedOtp.current = token;
    otpBusy.current = true;
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = await verifyOtp(email, token);
    setLoading(false);
    otpBusy.current = false;
    if (!result.success) {
      lastTriedOtp.current = "";
      setError(result.error || t.otpInvalid);
    }
  };

  useEffect(() => {
    if (step === "otp" && otp.replace(/\D/g, "").length === 6 && !loading) {
      void submitOtp(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    setError(null);
    setInfo(null);
    setLoading(true);
    const result = await resendOtp(email);
    setLoading(false);
    if (result.success) {
      setInfo(t.otpSent);
      setResendIn(RESEND_SECONDS);
      setOtp("");
      lastTriedOtp.current = "";
    } else {
      setError(result.error || t.otpResendFail);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error ?? t.errLogin);
      setLoading(false);
    }
  };

  const sendReset = async () => {
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setError(t.errEmail);
      return;
    }
    setLoading(true);
    const result = await resetPassword(cleanEmail);
    setLoading(false);
    if (result.success) setInfo(t.resetSent);
    else setError(result.error || t.resetFail);
  };

  const saveNewPassword = async () => {
    setError(null);
    if (password.length < 6) {
      setError(t.errPasswordLen);
      return;
    }
    if (password !== password2) {
      setError(t.errPasswordMatch);
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || t.resetFail);
      return;
    }
    setStep("form");
    setMode("login");
    setInfo(t.resetDone);
  };

  if (step === "forgot") {
    return (
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <button
          type="button"
          onClick={() => {
            setStep("form");
            setError(null);
            setInfo(null);
          }}
          className="mb-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.otpBack}
        </button>
        <h1 className="text-2xl font-bold">{t.forgotTitle}</h1>
        <p className="mt-2 text-sm text-muted">{t.forgotHint}</p>
        <label className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <Mail className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>
        {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
        {info && <p className="mt-3 text-sm font-medium text-success">{info}</p>}
        <Button size="lg" className="mt-5 w-full" onClick={() => void sendReset()} disabled={loading}>
          {loading ? t.pleaseWait : t.resetSend}
        </Button>
      </div>
    );
  }

  if (step === "newpass") {
    return (
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <h1 className="text-2xl font-bold">{t.newPasswordTitle}</h1>
        <p className="mt-2 text-sm text-muted">{t.newPasswordHint}</p>
        <label className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <Lock className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.password}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>
        <label className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <Lock className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder={t.passwordAgain}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>
        {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
        <Button size="lg" className="mt-5 w-full" onClick={() => void saveNewPassword()} disabled={loading}>
          {loading ? t.pleaseWait : t.savePassword}
        </Button>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <button
          type="button"
          onClick={() => {
            setStep("form");
            setOtp("");
            lastTriedOtp.current = "";
            setError(null);
            setInfo(null);
          }}
          className="mb-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.otpBack}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-soft">
            <ShieldCheck className="h-10 w-10" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.otpTitle}</h1>
            <p className="mt-2 text-sm text-muted">
              {fmt(t.otpSubtitle, { email })}
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-5">
          <OtpInput value={otp} onChange={setOtp} disabled={loading} error={!!error} />

          {error && <p className="text-center text-sm font-medium text-danger">{error}</p>}
          {info && !error && <p className="text-center text-sm font-medium text-success">{info}</p>}

          <Button size="lg" className="w-full" onClick={() => void submitOtp()} disabled={loading || otp.length < 6}>
            {loading ? (
              <span className="animate-pulse">{t.otpChecking}</span>
            ) : (
              <>
                {t.otpVerify}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={resendIn > 0 || loading}
            className="text-center text-sm font-semibold text-primary disabled:text-muted"
          >
            {resendIn > 0 ? fmt(t.otpResendIn, { n: resendIn }) : t.otpResend}
          </button>

          <p className="text-center text-xs text-muted">{t.otpSpamHint}</p>
        </div>
      </div>
    );
  }

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

      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full flex gap-2"
          onClick={() => void handleGoogleLogin()}
          disabled={loading}
        >
          <GoogleMark size={20} />
          {t.googleLogin}
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-line"></div>
          <span className="text-xs text-muted">{t.orDivider}</span>
          <div className="h-px flex-1 bg-line"></div>
        </div>
      </div>

      <div className="mt-6 flex rounded-2xl border border-line bg-surface2 p-1">
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

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
          <Mail className="h-5 w-5 text-muted" aria-hidden />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
        </label>

        {mode === "register" && (
          <>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
              <User className="h-5 w-5 text-muted" aria-hidden />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.username}
                autoComplete="username"
                maxLength={20}
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
              <span className="w-5 text-center text-sm font-bold text-muted">Y</span>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
                aria-label={t.birthYear}
              >
                <option value="">{t.birthYear}</option>
                {Array.from({ length: thisYear - 10 - 1940 + 1 }, (_, i) => thisYear - 10 - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

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

        <Button size="lg" className="w-full" onClick={() => void submit()} disabled={loading}>
          {loading ? (
            <span className="animate-pulse">{t.pleaseWait}</span>
          ) : (
            <>
              {mode === "register" ? t.registerBtn : t.loginBtn}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted">
          {mode === "register" ? t.haveAccount : t.noAccount}
        </p>
      </form>
    </div>
  );
}
