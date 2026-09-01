/**
 * Talab/taklif va savol xatoliklari — Supabase inbox + mahalliy zaxira.
 * Admin: profiles.is_admin, VITE_ADMIN_EMAILS, VITE_ADMIN_USERNAMES,
 * va "behruz" / "behruzake77" username'lar avtomatik admin hisoblanadi.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";

export type ReportKind = "error" | "suggest" | "other";
export type ReportStatus = "open" | "done";

export interface QuestionReport {
  id: string;
  user_id: string;
  user_name: string;
  kind: ReportKind;
  status: ReportStatus;
  lesson_id: string | null;
  lesson_title: string | null;
  q_index: number | null;
  q_type: string | null;
  prompt: string | null;
  source: string | null;
  message: string;
  admin_note: string;
  created_at: string;
  updated_at: string;
}

export interface ReportDraft {
  kind: ReportKind;
  message: string;
  lessonId?: string | null;
  lessonTitle?: string | null;
  qIndex?: number | null;
  qType?: string | null;
  prompt?: string | null;
  source?: string | null;
}

const LOCAL_KEY = "corpus-question-reports";

function splitEnv(raw?: string): string[] {
  return (raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function adminEmails(): string[] {
  const env = import.meta.env as Record<string, string | undefined>;
  return splitEnv(env.VITE_ADMIN_EMAILS);
}

function adminUsernames(): string[] {
  const env = import.meta.env as Record<string, string | undefined>;
  const fromEnv = splitEnv(env.VITE_ADMIN_USERNAMES);
  return [...new Set([...fromEnv, "behruzake77", "behruz"])];
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function isAdminAccount(user?: { email?: string | null; username?: string | null } | null): boolean {
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;
  const name = (user.username || "").trim().toLowerCase();
  return Boolean(name) && adminUsernames().includes(name);
}

function asKind(raw: unknown): ReportKind {
  if (raw === "suggest" || raw === "other" || raw === "error") return raw;
  return "error";
}

function asStatus(raw: unknown): ReportStatus {
  return raw === "done" ? "done" : "open";
}

function asReport(row: Record<string, unknown>): QuestionReport {
  return {
    id: String(row.id),
    user_id: String(row.user_id ?? ""),
    user_name: String(row.user_name ?? ""),
    kind: asKind(row.kind),
    status: asStatus(row.status),
    lesson_id: (row.lesson_id as string | null) ?? null,
    lesson_title: (row.lesson_title as string | null) ?? null,
    q_index: row.q_index == null ? null : Number(row.q_index),
    q_type: (row.q_type as string | null) ?? null,
    prompt: (row.prompt as string | null) ?? null,
    source: (row.source as string | null) ?? null,
    message: String(row.message ?? ""),
    admin_note: String(row.admin_note ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function readLocal(): QuestionReport[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => asReport(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

function writeLocal(rows: QuestionReport[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 200)));
  } catch {
    /* no-op */
  }
}

function mergeReports(remote: QuestionReport[], local: QuestionReport[]): QuestionReport[] {
  const seen = new Set(remote.map((r) => r.id));
  const extra = local.filter((r) => !seen.has(r.id));
  return [...remote, ...extra].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { data } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return Boolean((data as { is_admin?: boolean } | null)?.is_admin);
}

function localFromDraft(user: AuthUser, draft: ReportDraft): QuestionReport {
  const now = new Date().toISOString();
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: user.id,
    user_name: user.username,
    kind: draft.kind,
    status: "open",
    lesson_id: draft.lessonId ?? null,
    lesson_title: draft.lessonTitle ?? null,
    q_index: draft.qIndex ?? null,
    q_type: draft.qType ?? null,
    prompt: draft.prompt ?? null,
    source: draft.source ?? null,
    message: draft.message.trim(),
    admin_note: "",
    created_at: now,
    updated_at: now,
  };
}

export async function submitReport(user: AuthUser, draft: ReportDraft): Promise<QuestionReport | null> {
  const message = draft.message.trim();
  if (!message) return null;
  const payload = {
    user_id: user.id,
    user_name: user.username,
    kind: draft.kind,
    status: "open" as const,
    lesson_id: draft.lessonId ?? null,
    lesson_title: draft.lessonTitle ?? null,
    q_index: draft.qIndex ?? null,
    q_type: draft.qType ?? null,
    prompt: draft.prompt ?? null,
    source: draft.source ?? null,
    message,
  };
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("question_reports").insert(payload).select("*").maybeSingle();
    if (!error && data) return asReport(data as Record<string, unknown>);
  }
  const row = localFromDraft(user, draft);
  writeLocal([row, ...readLocal()]);
  return row;
}

export async function listReports(opts?: { mine?: boolean; userId?: string }): Promise<QuestionReport[]> {
  let remote: QuestionReport[] = [];
  if (isSupabaseConfigured) {
    let q = supabase.from("question_reports").select("*").order("created_at", { ascending: false }).limit(200);
    if (opts?.mine && opts.userId) q = q.eq("user_id", opts.userId);
    const { data, error } = await q;
    if (!error && data) remote = data.map((r) => asReport(r as Record<string, unknown>));
  }
  let local = readLocal();
  if (opts?.mine && opts.userId) local = local.filter((r) => r.user_id === opts.userId);
  return mergeReports(remote, local);
}

export async function countOpenReports(): Promise<number> {
  const list = await listReports();
  return list.filter((r) => r.status === "open").length;
}

export async function patchReport(
  id: string,
  patch: Partial<Pick<QuestionReport, "status" | "admin_note">>,
): Promise<QuestionReport | null> {
  const next = { ...patch, updated_at: new Date().toISOString() };
  if (isSupabaseConfigured && !id.startsWith("local-")) {
    const { data, error } = await supabase.from("question_reports").update(next).eq("id", id).select("*").maybeSingle();
    if (!error && data) return asReport(data as Record<string, unknown>);
  }
  const rows = readLocal();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const updated = { ...rows[idx], ...next };
  rows[idx] = updated;
  writeLocal(rows);
  return updated;
}
