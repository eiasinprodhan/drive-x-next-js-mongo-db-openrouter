"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageSquareText, Send, Sparkles, Trash2 } from "lucide-react";
import { api, useFetch } from "@/lib/api";

interface Msg {
  id: string;
  session: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
}

export default function AssistantPage() {
  const [session, setSession] = useState<string>("");
  const { data, loading, setData } = useFetch<{ sessions: { id: string; count: number }[]; messages: Msg[] }>(
    session ? `/api/admin/messages?session=${session}` : "/api/admin/messages"
  );
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<{ text: string; model: string; source: string } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [data?.messages.length, reply]);

  async function testChat(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setBusy(true);
    setReply(null);
    try {
      const sessionId = session || `admin-${Date.now()}`;
      if (!session) setSession(sessionId);
      const res = await api<any>("/api/ai/chat", { method: "POST", body: JSON.stringify({ session: sessionId, message: input }) });
      setReply({ text: res.text, model: res.model, source: res.source });
      setInput("");
      const fresh = await api<any>(`/api/admin/messages?session=${sessionId}`);
      setData(fresh);
      // also refresh sessions list
    } finally {
      setBusy(false);
    }
  }

  const msgs = data?.messages || [];
  const sessions = data?.sessions || [];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
      {/* Left: sessions + log */}
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">AI Assistant Console</h1>
          <p className="mt-0.5 text-xs font-semibold text-navy-400">
            Every chat happens against the live fleet · LLM (OpenRouter) with offline rule-engine fallback
          </p>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <MessageSquareText size={15} className="text-brand-500" /> Chat sessions
            <span className="chip bg-navy-50 text-navy-500">{sessions.length}</span>
          </p>
          <div className="mt-3 space-y-1.5">
            <button onClick={() => setSession("")} className={`w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition ${!session ? "bg-brand-50 text-brand-600" : "text-navy-500 hover:bg-navy-50"}`}>
              All sessions · {msgs.length} messages
            </button>
            {sessions.map((s) => (
              <button key={s.id} onClick={() => setSession(s.id)} className={`w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition ${session === s.id ? "bg-brand-50 text-brand-600" : "text-navy-500 hover:bg-navy-50"}`}>
                <span className="font-mono">{s.id}</span>
                <span className="ml-2 chip bg-navy-50 text-navy-400">{s.count} msgs</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Sparkles size={15} className="text-brand-500" /> Live test — chat as a customer
          </p>
          <p className="mt-1 text-[11px] font-semibold text-navy-400">
            Try: “recommend a luxury SUV under $300” or “my email is jane@mail.com, call me back” (triggers AI lead capture).
          </p>
          <form onSubmit={testChat} className="mt-3 flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message to Rex…" className="input !py-2.5 text-xs" />
            <button disabled={busy} className="btn-primary !px-3.5" aria-label="Send">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
          {reply && (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-relaxed text-navy-700 animate-fade-up">
              <p className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-600">
                <Bot size={11} /> {reply.model} · {reply.source}
              </p>
              <p className="whitespace-pre-wrap">{reply.text}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: message log */}
      <div className="card flex max-h-[78vh] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-navy-100 p-5">
          <h3 className="text-sm font-extrabold text-navy-900">Message log {session && <span className="text-navy-300">· {session}</span>}</h3>
          <button onClick={() => setData((prev: any) => ({ ...prev, messages: [] }))} className="text-[11px] font-bold text-navy-400 hover:text-red-500">
            Clear view
          </button>
        </div>
        <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto bg-[#FAF7F2] p-5">
          {loading && <p className="py-10 text-center text-xs font-bold text-navy-400">Loading logs…</p>}
          {!loading && msgs.length === 0 && (
            <p className="py-10 text-center text-xs font-bold text-navy-400">
              No chat history yet — start a conversation with Rex on the customer site.
            </p>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${m.role === "user" ? "rounded-br-md bg-navy-950 text-white" : "rounded-bl-md border border-navy-100 bg-white text-navy-800"}`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p className="mt-1 text-right text-[9px] font-bold opacity-50">{new Date(m.ts).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
