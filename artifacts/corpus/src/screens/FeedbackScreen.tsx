"use client";

import { useEffect, useState } from "react";
import { Flag, MessageSquarePlus } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { ReportModal } from "@/components/ReportQuestion";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { listReports, type QuestionReport } from "@/lib/reports";
import { cn } from "@/utils/cn";

function kindLabel(kind: QuestionReport["kind"], t: Record<string, string>): string {
  if (kind === "suggest") return t.reportSuggest;
  if (kind === "other") return t.reportOther;
  return t.reportError;
}

export function FeedbackScreen() {
  const t = useStrings();
  const currentUser = useAppStore((s) => s.currentUser);
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<QuestionReport[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    void listReports({ mine: true, userId: currentUser.id }).then(setMine);
  }, [currentUser, open]);

  return (
    <Screen padded={false}>
      <TopBar title={t.feedbackTitle} />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">{t.feedbackSubtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t.feedbackHint}</p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-transform active:scale-[.98]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquarePlus className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{t.reportSend}</span>
            <span className="mt-0.5 block text-xs text-muted">{t.reportPlaceholder}</span>
          </span>
        </button>

        {mine.length > 0 && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">{t.feedbackMine}</p>
            <div className="mt-2 flex flex-col gap-2">
              {mine.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted" aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">{kindLabel(r.kind, t)}</span>
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        r.status === "open" ? "bg-warning/15 text-warning" : "bg-success/15 text-success",
                      )}
                    >
                      {r.status === "open" ? t.adminOpen : t.adminDone}
                    </span>
                  </div>
                  {r.prompt && <p className="mt-2 text-sm font-medium leading-snug">{r.prompt}</p>}
                  <p className="mt-1 text-sm text-muted">{r.message}</p>
                  {r.admin_note && (
                    <p className="mt-2 rounded-xl bg-primary/10 px-3 py-2 text-xs text-ink">
                      {t.adminNote}: {r.admin_note}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      {open && (
        <ReportModal
          ctx={{ source: "general" }}
          onClose={() => setOpen(false)}
        />
      )}
    </Screen>
  );
}
