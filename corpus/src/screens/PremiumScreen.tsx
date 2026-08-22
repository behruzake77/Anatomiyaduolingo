"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, KeyRound, Crown, X } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { PREMIUM_BENEFITS, PREMIUM_PLANS, demoPremiumCode } from "@/data/premium";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

export function PremiumScreen() {
  const t = useStrings();
  const isPremium = useAppStore((s) => s.isPremium);
  const activatePremium = useAppStore((s) => s.activatePremium);
  const deactivatePremium = useAppStore((s) => s.deactivatePremium);
  const [plan, setPlan] = useState("yearly");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitCode = () => {
    setError(null);
    if (activatePremium(code)) {
      setCode("");
    } else {
      setError(t.premiumBadCode);
    }
  };

  return (
    <Screen padded={false}>
      <TopBar title={t.premium} />

      <div className="px-5 pb-28">
        {/* hero */}
        <div className="relative mt-2 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1230] via-[#2d1f4e] to-[#4a2d7a] p-6 text-white shadow-pop">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#F5C04E]/30 blur-2xl" />
            <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-primary/40 blur-2xl" />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5C04E] to-[#E0A030] shadow-pop"
          >
            <Crown className="h-9 w-9 text-white" aria-hidden />
          </motion.div>

          <h1 className="relative mt-4 text-2xl font-bold">{t.premiumTitle}</h1>
          <p className="relative mt-1 text-sm text-white/80">{t.premiumTagline}</p>

          {isPremium && (
            <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5C04E] px-3 py-1 text-xs font-bold text-[#1a1230]">
              <Check className="h-3.5 w-3.5" aria-hidden /> {t.premiumActive}
            </span>
          )}
        </div>

        {/* imtiyozlar */}
        <h2 className="mt-6 text-lg font-semibold">{t.premiumBenefits}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {PREMIUM_BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-line bg-surface p-3 shadow-card">
              <span className="text-2xl">{b.icon}</span>
              <p className="mt-1.5 break-words text-sm font-semibold leading-tight">{b.title}</p>
              <p className="mt-0.5 break-words text-xs text-muted">{b.text}</p>
            </div>
          ))}
        </div>

        {!isPremium && (
          <>
            {/* tariflar */}
            <h2 className="mt-6 text-lg font-semibold">{t.premiumPlans}</h2>
            <div className="mt-3 flex flex-col gap-3">
              {PREMIUM_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left shadow-card transition",
                    plan === p.id
                      ? "border-[#F5C04E] bg-[#F5C04E]/10 ring-1 ring-[#F5C04E]"
                      : "border-line bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                      plan === p.id ? "border-[#E0A030] bg-[#F5C04E] text-white" : "border-line",
                    )}
                  >
                    {plan === p.id && <Check className="h-4 w-4" aria-hidden />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {p.name}
                      {p.best && (
                        <span className="rounded-full bg-[#F5C04E] px-2 py-0.5 text-[10px] font-bold text-[#1a1230]">
                          {t.premiumBest}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">{p.period}</p>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-[#E0A030]">{p.price}</span>
                </button>
              ))}
            </div>

            {/* faollashtirish kodi */}
            <div className="mt-6 rounded-2xl border border-line bg-surface2 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <KeyRound className="h-4 w-4 text-primary" aria-hidden /> {t.premiumCode}
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CORPUS-XXXX-YYYY"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium uppercase outline-none placeholder:text-muted"
                />
                <Button onClick={submitCode}>{t.premiumActivate}</Button>
              </div>
              {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
              <p className="mt-2 break-words text-[11px] text-muted">
                {t.premiumDemoHint}: {demoPremiumCode()}
              </p>
            </div>
          </>
        )}

        {isPremium && (
          <button
            onClick={deactivatePremium}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-danger/10 py-3 text-sm font-semibold text-danger"
          >
            <X className="h-4 w-4" aria-hidden /> {t.premiumDeactivate}
          </button>
        )}
      </div>
    </Screen>
  );
}
