import type { ChatMessage, RetrievedKnowledge, TutorMemory } from "./types";

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function requireConfig() {
  if (!url || !serviceKey) throw new Error("TUTOR_DATABASE_NOT_CONFIGURED");
}

async function rest(path: string, init: RequestInit = {}) {
  requireConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: serviceKey!, Authorization: `Bearer ${serviceKey!}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`TUTOR_DATABASE_HTTP_${response.status}`);
  return response.status === 204 ? null : response.json();
}

export async function authenticateAccessToken(token: string): Promise<{ id: string; email?: string } | null> {
  if (!url || !anonKey) return null;
  const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string; email?: string };
  return user.id ? { id: user.id, email: user.email } : null;
}

export class AnatomyRetriever {
  async search(query: string, limit = 5): Promise<RetrievedKnowledge[]> {
    if (!url || !serviceKey || !query.trim()) return [];
    const terms = query.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").split(/\s+/).filter((term) => term.length > 3).slice(0, 4);
    if (!terms.length) return [];
    const filter = terms.map((term) => `content.ilike.*${encodeURIComponent(term)}*`).join(",");
    const rows = await rest(`anatomy_chunks?or=(${filter})&select=id,chapter,section,content,page_number&limit=${limit}`) as Array<{ id: string; chapter?: string; section?: string; content: string; page_number?: number }>;
    return rows.map((row) => ({ id: row.id, chapter: row.chapter, section: row.section, content: row.content, pageNumber: row.page_number }));
  }
}

export class StudentMemoryService {
  async relevant(userId: string, query: string): Promise<TutorMemory[]> {
    const rows = await rest(`tutor_memory?user_id=eq.${encodeURIComponent(userId)}&content=ilike.*${encodeURIComponent(query.split(/\s+/).slice(0, 2).join(" "))}*&select=id,memory_type,content,importance&order=importance.desc&limit=6`) as Array<{ id: string; memory_type: string; content: string; importance: number }>;
    return rows.map((row) => ({ id: row.id, memoryType: row.memory_type, content: row.content, importance: row.importance }));
  }

  async saveMemory(userId: string, memory: { memoryType: string; content: string; importance: number }) {
    if (memory.content.trim().length < 12) return;
    await rest("tutor_memory", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify({ user_id: userId, memory_type: memory.memoryType, content: memory.content.trim(), importance: memory.importance }) });
  }
}

export class TutorSessionService {
  async create(userId: string) {
    const rows = await rest("tutor_sessions", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ user_id: userId, topics: [], mistakes: [], strengths: [], understanding_score: null }) }) as Array<{ id: string; created_at: string }>;
    return rows[0];
  }

  async messages(sessionId: string, userId: string): Promise<ChatMessage[]> {
    const rows = await rest(`tutor_messages?session_id=eq.${encodeURIComponent(sessionId)}&user_id=eq.${encodeURIComponent(userId)}&select=role,content&order=created_at.asc&limit=20`) as Array<{ role: "user" | "assistant"; content: string }>;
    return rows.map((row) => ({ role: row.role, content: row.content }));
  }

  async saveMessage(sessionId: string, userId: string, role: "user" | "assistant", content: string) {
    await rest("tutor_messages", { method: "POST", body: JSON.stringify({ session_id: sessionId, user_id: userId, role, content }) });
  }

  async update(sessionId: string, userId: string, result: { topics: string[]; mistakes?: string[]; strengths?: string[]; suggestedNextTopic?: string }) {
    await rest(`tutor_sessions?id=eq.${encodeURIComponent(sessionId)}&user_id=eq.${encodeURIComponent(userId)}`, { method: "PATCH", body: JSON.stringify({ topics: result.topics, mistakes: result.mistakes || [], strengths: result.strengths || [], recommended_next_topic: result.suggestedNextTopic || null }) });
  }
}
