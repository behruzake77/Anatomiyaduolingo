"use client";

import { useEffect, useMemo, useState } from "react";
import { Flag, Shield } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import { listReports, patchReport, type QuestionReport, type ReportKind, type ReportStatus } from "@/lib/reports";
import { lessonById } from "@/data/content";

function kindLabel(kind: ReportKind, t: Record<string, string>): string {
  if (kind === "suggest") return t.reportSuggest;
  if (kind === "other") return t.reportOther;
  return t.reportError;
}

function when(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AdminScreen() {
  const t = useStrings();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const navigate = useAppStore((s) => s.navigate);
  const [tab, setTab] = useState<ReportStatus>("open");
  const [rows, setRows] = useState<QuestionReport[]>([]);
  const [busy, setBusy] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = async () => {
    setBusy(true);
    const list = await listReports();
    setRows(list);
    setBusy(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin]);

  const shown = useMemo(() => rows.filter((r) => r.status === tab), [rows, tab]);
  const openN = rows.filter((r) => r.status === "open").length;

  if (!isAdmin) {
    return (
      <Screen padded={false}>
        <TopBar title={t.adminTitle} />
        <div className="px-5 pb-28">
          <p className="mt-6 text-sm text-muted">{t.adminDenied}</p>
          <Button className="mt-4" onClick={() => navigate("profile")}>
            {t.profile}
          </Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <TopBar title={t.adminTitle} />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">{t.adminInbox}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTab("open")}
            className={cn(
              "rounded-2xl border-2 py-2.5 text-sm font-semibold",
              tab === "open" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
            )}
          >
            {t.adminOpen}
            {openN > 0 ? ` · ${openN}` : ""}
          </button>
          <button
            type="button"
            onClick={() => setTab("done")}
            className={cn(
              "rounded-2xl border-2 py-2.5 text-sm font-semibold",
              tab === "done" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
            )}
          >
            {t.adminDone}
          </button>
        </div>

        {busy && <p className="mt-6 text-center text-sm text-muted">{t.pleaseWait}</p>}
        {!busy && shown.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-7 w-7" aria-hidden />
            </span>
            <p className="text-sm text-muted">{t.adminEmpty}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {shown.map((r) => {
            const lesson = r.lesson_id ? lessonById(r.lesson_id) : undefined;
            const title = r.lesson_title || lesson?.title || "";
            const expanded = openId === r.id;
            return (
              <Card key={r.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(expanded ? null : r.id);
                    setNote(r.admin_note);
                  }}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      r.kind === "error" ? "bg-danger/10 text-danger" : r.kind === "suggest" ? "bg-primary/10 text-primary" : "bg-surface2 text-muted",
                    )}
                  >
                    <Flag className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">{kindLabel(r.kind, t)}</span>
                      <span className="text-[11px] text-muted">{when(r.created_at)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug">
                      {r.prompt || r.message.slice(0, 80)}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {t.adminFrom}: {r.user_name || "—"}
                      {title ? ` · ${title}` : ""}
                      {r.q_index != null ? ` · #${r.q_index + 1}` : ""}
                    </span>
                  </span>
                </button>
                {expanded && (
                  <div className="border-t border-line px-4 pb-4 pt-3">
                    {r.prompt && (
                      <p className="rounded-xl bg-surface2 p-3 text-sm leading-snug">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{t.reportQuestion}</span>
                        <span className="mt-1 block">{r.prompt}</span>
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed">{r.message}</p>
                    <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted">
                      {t.adminNote}
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value.slice(0, 500))}
                      rows={2}
                      className="mt-2 w-full resize-none rounded-2xl border-2 border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        size="sm"
                        onClick={() => {
                          void patchReport(r.id, { admin_note: note }).then((saved) => {
                            if (saved) setRows((cur) => cur.map((x) => (x.id === saved.id ? saved : x)));
                          });
                        }}
                      >
                        {t.adminSave}
                      </Button>
                      <Button
                        className="flex-1"
                        size="sm"
                        variant={r.status === "open" ? "primary" : "outline"}
                        onClick={() => {
                          const next: ReportStatus = r.status === "open" ? "done" : "open";
                          void patchReport(r.id, { status: next, admin_note: note }).then((saved) => {
                            if (saved) {
                              setRows((cur) => cur.map((x) => (x.id === saved.id ? saved : x)));
                              setOpenId(null);
                            }
                          });
                        }}
                      >
                        {r.status === "open" ? t.adminMarkDone : t.adminReopen}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        {openN > 0 && tab === "done" && (
          <p className="mt-4 text-center text-xs text-muted">{fmt(t.reportCount, { n: openN })}</p>
        )}
      </div>
    </Screen>
  );
}
