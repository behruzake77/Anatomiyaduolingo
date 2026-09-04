"use client";

import { useEffect, useState } from "react";
import { Bell, Megaphone, Trash2 } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";
import {
  createBroadcast,
  deleteBroadcast,
  listBroadcasts,
  markBroadcastsSeen,
  readSeenIds,
  subscribeBroadcasts,
  type Broadcast,
} from "@/lib/broadcasts";

function when(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function InboxScreen() {
  const t = useStrings();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const currentUser = useAppStore((s) => s.currentUser);
  const [rows, setRows] = useState<Broadcast[]>([]);
  const [seen, setSeen] = useState<Set<string>>(() => readSeenIds());
  const [busy, setBusy] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [fail, setFail] = useState(false);

  const load = async () => {
    setBusy(true);
    const prev = readSeenIds();
    const list = await listBroadcasts();
    setRows(list);
    setSeen(prev);
    markBroadcastsSeen(list.map((b) => b.id));
    setBusy(false);
  };

  useEffect(() => {
    void load();
    return subscribeBroadcasts(() => {
      void listBroadcasts().then((list) => {
        setRows(list);
        markBroadcastsSeen(list.map((b) => b.id));
      });
    });
  }, []);

  const send = async () => {
    if (!currentUser || !body.trim()) return;
    setSending(true);
    setFail(false);
    const row = await createBroadcast(currentUser, { title, body });
    setSending(false);
    if (!row) {
      setFail(true);
      return;
    }
    setTitle("");
    setBody("");
    setSentOk(true);
    setRows((cur) => [row, ...cur.filter((x) => x.id !== row.id)]);
    markBroadcastsSeen([row.id]);
    setTimeout(() => setSentOk(false), 2200);
  };

  return (
    <Screen padded={false}>
      <TopBar title={t.inboxTitle} />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">{t.inboxSubtitle}</p>

        {isAdmin && currentUser && (
          <Card className="mt-5 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">{t.inboxCompose}</p>
                <p className="text-xs text-muted">{t.inboxComposeHint}</p>
              </div>
            </div>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted">
              {t.inboxTitleField}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              placeholder={t.inboxTitlePh}
              className="mt-2 w-full rounded-2xl border-2 border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <label className="mt-3 block text-xs font-semibold uppercase tracking-widest text-muted">
              {t.inboxBodyField}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 800))}
              placeholder={t.inboxBodyPh}
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border-2 border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <Button className="mt-3 w-full" disabled={!body.trim() || sending} onClick={() => void send()}>
              {sending ? t.pleaseWait : t.reportSend}
            </Button>
            {sentOk && <p className="mt-2 text-center text-sm font-medium text-success">{t.inboxSent}</p>}
            {fail && <p className="mt-2 text-center text-sm font-medium text-danger">{t.reportFail}</p>}
          </Card>
        )}

        {busy && <p className="mt-6 text-center text-sm text-muted">{t.pleaseWait}</p>}
        {!busy && rows.length === 0 && (
          <div className="mt-8">
            <EmptyState
              illustration="/img/3d/empty-inbox.png"
              title={t.inboxEmpty}
              description={t.inboxEmptyHint}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {rows.map((b) => {
            const unread = !seen.has(b.id);
            const expanded = openId === b.id;
            return (
              <Card key={b.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : b.id)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      unread ? "bg-primary text-white" : "bg-primary/10 text-primary",
                    )}
                  >
                    <Bell className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] text-muted">{when(b.created_at)}</span>
                      {unread && (
                        <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          {t.inboxNew}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug">
                      {b.title || t.inboxFrom}
                    </span>
                    <span className={cn("mt-0.5 block text-sm text-muted", !expanded && "line-clamp-2")}>
                      {b.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted">
                      {t.inboxFrom}: {b.author_name || t.adminTitle}
                    </span>
                  </span>
                </button>
                {expanded && isAdmin && (
                  <div className="border-t border-line px-4 pb-4 pt-3">
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        void deleteBroadcast(b.id).then((ok) => {
                          if (ok) setRows((cur) => cur.filter((x) => x.id !== b.id));
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {t.inboxDelete}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
