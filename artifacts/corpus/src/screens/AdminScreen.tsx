"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Flag,
  Megaphone,
  Shield,
  Users,
  Lock,
  Send,
  ChevronLeft,
  Search,
  Eye,
} from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import { listReports, patchReport, type QuestionReport, type ReportKind, type ReportStatus } from "@/lib/reports";
import { lessonById } from "@/data/content";
import {
  ADMIN_PIN,
  isAdminUnlocked,
  lockAdmin,
  listMessages,
  listUsers,
  sendMessage,
  subscribeMessages,
  unlockAdmin,
  type AdminMessage,
  type AdminUser,
} from "@/lib/admin";

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

type AdminTab = "reports" | "users";

export function AdminScreen() {
  const t = useStrings();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const navigate = useAppStore((s) => s.navigate);

  // Admin PIN (qulf) — 1030 ni kiritish kerak.
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const [tab, setTab] = useState<AdminTab>("reports");

  // Xabarlar (reports)
  const [rows, setRows] = useState<QuestionReport[]>([]);
  const [busy, setBusy] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ReportStatus>("open");

  // Foydalanuvchilar + chat
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userBusy, setUserBusy] = useState(false);
  const [q, setQ] = useState("");
  const [chatUser, setChatUser] = useState<AdminUser | null>(null);
  const openUserProfile = useAppStore((s) => s.openUserProfile);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnlocked(isAdminUnlocked());
  }, []);

  const loadReports = async () => {
    setBusy(true);
    const list = await listReports();
    setRows(list);
    setBusy(false);
  };

  const loadUsers = async () => {
    setUserBusy(true);
    const list = await listUsers();
    setUsers(list);
    setUserBusy(false);
  };

  useEffect(() => {
    if (!isAdmin || !unlocked) return;
    void loadReports();
    void loadUsers();
  }, [isAdmin, unlocked]);

  const confirmPin = () => {
    if (unlockAdmin(pin)) {
      setPin("");
      setPinErr(null);
      setUnlocked(true);
    } else {
      setPinErr(t.adminPinWrong);
      setPin("");
    }
  };

  const openChat = async (u: AdminUser) => {
    setChatUser(u);
    setDraft("");
    setMessages([]);
    setChatBusy(true);
    setMessages(await listMessages(u.id));
    setChatBusy(false);
  };

  useEffect(() => {
    if (!chatUser) return () => {};
    const unsub = subscribeMessages(chatUser.id, (list) => setMessages(list));
    return () => {
      unsub();
    };
  }, [chatUser]);

  useEffect(() => {
    if (!chatUser) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, chatUser]);

  const submitChat = async () => {
    const body = draft.trim();
    if (!body || !chatUser || chatSending) return;
    setChatSending(true);
    const m = await sendMessage(chatUser.id, body, { fromAdmin: true, authorName: "Admin" });
    if (m) setMessages((cur) => [...cur, m]);
    setDraft("");
    setChatSending(false);
  };

  const shownReports = useMemo(() => rows.filter((r) => r.status === status), [rows, status]);
  const openN = rows.filter((r) => r.status === "open").length;
  const shownUsers = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.username.toLowerCase().includes(term) || (u.email || "").toLowerCase().includes(term));
  }, [users, q]);

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

  // --- Birinchi kirishda: admin PIN qulfi ---
  if (!unlocked) {
    return (
      <Screen padded={false}>
        <TopBar title={t.adminTitle} />
        <div className="flex flex-1 flex-col justify-center px-6 py-8">
          <div className="mx-auto flex flex-col items-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Lock className="h-8 w-8" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold">{t.adminPinTitle}</h1>
              <p className="mt-2 max-w-xs text-sm text-muted">{t.adminPinHint}</p>
            </div>
          </div>

          <label className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
            <Lock className="h-5 w-5 text-muted" aria-hidden />
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmPin();
              }}
              placeholder={t.adminPinPlaceholder}
              autoFocus
              className="w-full bg-transparent text-base tracking-[0.3em] outline-none placeholder:text-muted"
            />
          </label>
          {pinErr && <p className="mt-3 text-sm font-medium text-danger">{pinErr}</p>}

          <Button size="lg" className="mt-5 w-full" onClick={confirmPin} disabled={pin.length === 0}>
            {t.adminPinUnlock}
          </Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <TopBar title={t.adminTitle} />
      <div className="px-5 pb-28">
        {/* tablar */}
        <div className="mt-1 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface2 p-1">
          {(
            [
              ["reports", t.adminTabReports],
              ["users", t.adminTabUsers],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold",
                tab === id ? "bg-surface text-ink shadow-soft" : "text-muted",
              )}
            >
              {id === "users" ? <Users className="h-4 w-4" aria-hidden /> : <Flag className="h-4 w-4" aria-hidden />}
              {label}
              {id === "reports" && openN > 0 ? ` · ${openN}` : ""}
            </button>
          ))}
        </div>

        {/* Admin PIN qulfini yopish (logout) */}
        <button
          onClick={() => {
            lockAdmin();
            setUnlocked(false);
            setChatUser(null);
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface2 px-3 py-1.5 text-xs font-semibold text-muted"
        >
          <Lock className="h-3.5 w-3.5" aria-hidden /> {t.adminPinTitle}
        </button>

        {tab === "reports" ? (
          <ReportsTab
            t={t}
            status={status}
            setStatus={setStatus}
            shown={shownReports}
            busy={busy}
            openN={openN}
            openId={openId}
            setOpenId={setOpenId}
            note={note}
            setNote={setNote}
            rows={rows}
            setRows={setRows}
          />
        ) : (
          <UsersTab
            t={t}
            q={q}
            setQ={setQ}
            shown={shownUsers}
            busy={userBusy}
            openChat={openChat}
            openUserProfile={openUserProfile}
          />
        )}
      </div>

      {/* Chat oynasi */}
      {chatUser && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg">
          <TopBar
            title={chatUser.username}
            onBack={() => setChatUser(null)}
          />
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <UsersChip user={chatUser} t={t} />
            <button onClick={() => setChatUser(null)} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-muted">
              <ChevronLeft className="h-4 w-4" aria-hidden /> {t.adminChatBack}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {chatBusy ? (
              <p className="text-center text-sm text-muted">{t.pleaseWait}</p>
            ) : messages.length === 0 ? (
              <p className="mt-10 text-center text-sm text-muted">{t.adminMessagesEmpty}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug",
                      m.from_admin
                        ? "self-end rounded-br-md bg-primary text-white"
                        : "self-start rounded-bl-md bg-surface2 text-ink",
                    )}
                  >
                    {!m.from_admin && (
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{m.author_name}</p>
                    )}
                    <p className="break-words whitespace-pre-wrap">{m.body}</p>
                    <p className={cn("mt-1 text-right text-[10px]", m.from_admin ? "text-white/70" : "text-muted")}>
                      {when(m.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-line bg-surface px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.adminChatPlaceholder}
                rows={1}
                maxLength={1000}
                className="max-h-28 flex-1 resize-none rounded-2xl border border-line bg-surface2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={() => void submitChat()}
                disabled={!draft.trim() || chatSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-soft active:scale-95 disabled:opacity-40"
                aria-label={t.adminSend}
              >
                {chatSending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Send className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}

/* ---------- Reports tab ---------- */

function ReportsTab({
  t,
  status,
  setStatus,
  shown,
  busy,
  openN,
  openId,
  setOpenId,
  note,
  setNote,
  rows,
  setRows,
}: {
  t: Record<string, string>;
  status: ReportStatus;
  setStatus: (s: ReportStatus) => void;
  shown: QuestionReport[];
  busy: boolean;
  openN: number;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  note: string;
  setNote: (n: string) => void;
  rows: QuestionReport[];
  setRows: (fn: (cur: QuestionReport[]) => QuestionReport[]) => void;
}) {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <>
      <button
        type="button"
        onClick={() => navigate("inbox")}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-transform active:scale-[.98]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Megaphone className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{t.adminBroadcast}</span>
          <span className="mt-0.5 block text-xs text-muted">{t.inboxComposeHint}</span>
        </span>
      </button>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setStatus("open")}
          className={cn(
            "rounded-2xl border-2 py-2.5 text-sm font-semibold",
            status === "open" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
          )}
        >
          {t.adminOpen}
          {openN > 0 ? ` · ${openN}` : ""}
        </button>
        <button
          type="button"
          onClick={() => setStatus("done")}
          className={cn(
            "rounded-2xl border-2 py-2.5 text-sm font-semibold",
            status === "done" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
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
      {openN > 0 && status === "done" && (
        <p className="mt-4 text-center text-xs text-muted">{fmt(t.reportCount, { n: openN })}</p>
      )}
    </>
  );
}

/* ---------- Users tab ---------- */

function UsersTab({
  t,
  q,
  setQ,
  shown,
  busy,
  openChat,
  openUserProfile,
}: {
  t: Record<string, string>;
  q: string;
  setQ: (s: string) => void;
  shown: AdminUser[];
  busy: boolean;
  openChat: (u: AdminUser) => void;
  openUserProfile: (u: { id: string; username: string }) => void;
}) {
  return (
    <>
      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5">
        <Search className="h-4 w-4 text-muted" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.adminUserSearch}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>

      {busy ? (
        <p className="mt-6 text-center text-sm text-muted">{t.pleaseWait}</p>
      ) : shown.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-7 w-7" aria-hidden />
          </span>
          <p className="text-sm text-muted">{t.adminUsersEmpty}</p>
        </div>
      ) : (
        <Card className="mt-4 overflow-hidden">
          {shown.map((u, i) => (
            <div key={u.id} className={i > 0 ? "flex items-center border-t border-line" : "flex items-center"}>
              <button
                onClick={() => openChat(u)}
                className={
                  "flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition hover:bg-surface2"
                }
              >
                <UsersChip user={u} t={t} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 break-words text-base font-medium">
                    {u.username}
                    {u.is_admin && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                        ADMIN
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-muted">
                    {u.xp} XP · {u.streak} {t.days} · {t.level} {u.level}
                  </span>
                </span>
              </button>
              <button
                onClick={() => openUserProfile(u)}
                aria-label={t.profile}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-surface2 hover:text-primary"
              >
                <Eye className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

/* ---------- User avatar ---------- */

function UsersChip({ user, t }: { user: AdminUser; t: Record<string, string> }) {
  const a = user.avatar;
  const px = { width: 40, height: 40, fontSize: 16 };
  if (a) {
    if (a.startsWith("emoji:")) {
      return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface2">
          <span style={{ fontSize: 20 }}>{a.slice(6)}</span>
        </span>
      );
    }
    if (a.startsWith("color:")) {
      return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ backgroundColor: a.slice(6) }}>
          {user.username.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface2">
        <img src={a} alt={user.username} className="h-full w-full object-cover" loading="lazy" />
      </span>
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary" style={px}>
      {user.username.slice(0, 1).toUpperCase()}
    </span>
  );
}
