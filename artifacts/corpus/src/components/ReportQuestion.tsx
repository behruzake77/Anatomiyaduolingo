"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";
import { submitReport, type ReportDraft, type ReportKind } from "@/lib/reports";
import { parseKey } from "@/utils/srs";
import type { Question } from "@/data/content";

export interface ReportContext {
  lessonId?: string | null;
  lessonTitle?: string | null;
  qIndex?: number | null;
  qType?: string | null;
  prompt?: string | null;
  source?: string | null;
  qKey?: string;
}

export function ReportFlagButton(props: { q?: Question; ctx?: ReportContext; className?: string }) {
  const t = useStrings();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.reportFlag}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:border-warning hover:text-warning",
          props.className,
        )}
      >
        <Flag className="h-4 w-4" aria-hidden />
      </button>
      {open && <ReportModal q={props.q} ctx={props.ctx} onClose={() => setOpen(false)} />}
    </>
  );
}

export function ReportModal(props: { q?: Question; ctx?: ReportContext; onClose: () => void }) {
  const t = useStrings();
  const currentUser = useAppStore((s) => s.currentUser);
  const navigate = useAppStore((s) => s.navigate);
  const parsed = props.ctx?.qKey ? parseKey(props.ctx.qKey) : null;
  const lessonId = props.ctx?.lessonId ?? parsed?.lessonId ?? null;
  const qIndex = props.ctx?.qIndex ?? parsed?.index ?? null;
  const prompt = props.ctx?.prompt ?? props.q?.prompt ?? "";
  const qType = props.ctx?.qType ?? props.q?.type ?? null;

  const [kind, setKind] = useState<ReportKind>(prompt ? "error" : "suggest");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    if (!currentUser) {
      setError(t.reportNeedLogin);
      return;
    }
    if (!message.trim()) {
      setError(t.errEmpty);
      return;
    }
    setBusy(true);
    const draft: ReportDraft = {
      kind,
      message,
      lessonId,
      lessonTitle: props.ctx?.lessonTitle ?? null,
      qIndex,
      qType,
      prompt: prompt || null,
      source: props.ctx?.source ?? (prompt ? "lesson" : "general"),
    };
    const saved = await submitReport(currentUser, draft);
    setBusy(false);
    if (!saved) {
      setError(t.reportFail);
      return;
    }
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal>
      <div className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-line bg-bg p-5 shadow-pop">
        <div className="flex items-start gap-3">
          <h2 className="min-w-0 flex-1 text-lg font-semibold">{prompt ? t.reportTitle : t.feedbackTitle}</h2>
          <button
            type="button"
            onClick={props.onClose}
            aria-label={t.zoomClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {prompt && (
          <p className="mt-3 rounded-2xl border border-line bg-surface2 p-3 text-sm leading-snug text-ink">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{t.reportQuestion}</span>
            <span className="mt-1 block">{prompt}</span>
            {props.ctx?.lessonTitle && (
              <span className="mt-1 block text-xs text-muted">
                {t.reportLesson}: {props.ctx.lessonTitle}
                {qIndex != null ? ` · #${qIndex + 1}` : ""}
              </span>
            )}
          </p>
        )}

        {done ? (
          <p className="mt-5 rounded-2xl bg-success/15 px-4 py-3 text-sm font-medium text-success">{t.reportSent}</p>
        ) : (
          <>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">{t.reportKind}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["error", t.reportError],
                  ["suggest", t.reportSuggest],
                  ["other", t.reportOther],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKind(id)}
                  className={cn(
                    "rounded-xl border-2 px-2 py-2 text-xs font-semibold",
                    kind === id ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="report-msg">
              {t.reportMessage}
            </label>
            <textarea
              id="report-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 800))}
              rows={4}
              placeholder={t.reportPlaceholder}
              className="mt-2 w-full resize-none rounded-2xl border-2 border-line bg-surface px-3 py-3 text-sm outline-none focus:border-primary"
            />
            {!currentUser && (
              <p className="mt-3 text-sm text-danger">
                {t.reportNeedLogin}{" "}
                <button type="button" className="font-semibold underline" onClick={() => navigate("login")}>
                  {t.loginBtn}
                </button>
              </p>
            )}
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            <Button className="mt-4 w-full" size="lg" loading={busy} onClick={() => void send()}>
              {t.reportSend}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
