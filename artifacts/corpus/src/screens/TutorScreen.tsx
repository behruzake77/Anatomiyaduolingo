"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Brain, Send, Sparkles } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

interface Message { role: "user" | "assistant"; content: string; sources?: Array<{ title: string; chapter?: string; pageNumber?: number; sourceType?: string }> }
interface ChatResponse { response?: string; sessionId?: string; sources?: Array<{ title: string; chapter?: string; section?: string; pageNumber?: number; sourceType?: "textbook" | "atlas" }> }

const API_BASE = import.meta.env.VITE_API_URL || "";

export function TutorScreen() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Salom! Men CORPUS Tutoriman. Bugun anatomiyaning qaysi qismini birga tushunamiz? Men javobni shunchaki aytib bermayman — fikrlashingga yordam beraman." }]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || loading) return;
    setInput(""); setError("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Tizimga kirish kerak.");
      const response = await fetch(`${API_BASE}/api/ai/chat`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, sessionId }) });
      const raw = await response.text();
      let json: ChatResponse & { error?: string };
      try {
        json = raw ? JSON.parse(raw) as ChatResponse & { error?: string } : {};
      } catch {
        throw new Error(`AI server JSON javob qaytarmadi (${response.status}). VITE_API_URL va API serverni tekshiring.`);
      }
      if (!response.ok) throw new Error(json.error || "Tutor javob bera olmadi.");
      setSessionId(json.sessionId);
      setMessages((current) => [...current, { role: "assistant", content: json.response || "Savolni boshqacha ifodalab ko‘ramizmi?", sources: json.sources?.map((source) => ({ title: source.chapter ? `${source.title} — ${source.chapter}` : source.title, chapter: source.section, pageNumber: source.pageNumber, sourceType: source.sourceType })) }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Tutor bilan ulanishda xatolik."); }
    finally { setLoading(false); }
  }

  return <Screen className="bg-bg px-4 pb-5 sm:px-8">
    <TopBar title="AI Tutor" showBack={false} right={<span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-success" /> BETA</span>} />
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-[#18244a] to-[#31236a] p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#35D0BA]/15 text-[#35D0BA]"><Sparkles className="h-6 w-6" /></div><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#35D0BA]">CORPUS AI ANATOMY TUTOR</p><h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Bilimni suhbat orqali mustahkamlang.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">Tutor sizning xatolaringizni payqab, savollar bilan fikrlashga undaydi. Realtime ovozli rejim keyingi bosqichda qo‘shiladi.</p></div></div>
      </div>
      <div className="flex flex-1 flex-col gap-3 rounded-3xl border border-line bg-surface p-3 shadow-card sm:p-5">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-surface2 text-ink"}`}>{message.role === "assistant" && <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary"><Bot className="h-3 w-3" /> CORPUS Tutor</div>}{message.content}{message.sources?.length ? <div className="mt-3 border-t border-line/60 pt-2 text-[10px] text-muted"><span className="font-bold">Manbalar:</span> {message.sources.slice(0, 3).map((source, sourceIndex) => <span key={`${source.title}-${sourceIndex}`}>{sourceIndex ? " · " : " "}{source.sourceType === "atlas" ? "Atlas" : "Darslik"} — {source.title}{source.pageNumber ? `, p.${source.pageNumber}` : ""}</span>)}</div> : null}</div></div>)}
          {loading && <div className="flex items-center gap-2 text-sm text-muted"><Brain className="h-4 w-4 animate-pulse text-primary" /> Tutor o‘ylayapti…</div>}
          <div ref={endRef} />
        </div>
        {error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">{error}</p>}
        <div className="flex items-end gap-2 border-t border-line pt-3"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Masalan: Mitral klapan qayerda joylashgan?" rows={2} className="min-h-12 flex-1 resize-none rounded-2xl border border-line bg-surface2 px-4 py-3 text-sm outline-none transition focus:border-primary" disabled={loading} /><Button onClick={() => void sendMessage()} disabled={!input.trim() || loading} className="h-12 w-12 shrink-0 rounded-2xl p-0"><Send className="h-4 w-4" /></Button></div>
        <p className="text-center text-[10px] text-muted">Tutor xatolarni eslab qolishi mumkin. Muhim tibbiy qarorlar uchun mutaxassisga murojaat qiling.</p>
      </div>
    </div>
  </Screen>;
}
