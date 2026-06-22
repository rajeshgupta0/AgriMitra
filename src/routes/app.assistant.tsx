import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic, Send, Sparkles, Camera, Languages, X, History, Plus, Star, Share2, Volume2, AlertTriangle, Copy, Check,
  CloudSun, Leaf, TrendingUp, FileText, Bug, Droplets, Tractor, IndianRupee, Square,
} from "lucide-react";
import {
  loadProfile, saveProfile, LANGUAGES,
  type ChatThread, type ChatMsg, loadChats, upsertThread,
} from "@/lib/agri-store";

export const Route = createFileRoute("/app/assistant")({
  head: () => ({ meta: [{ title: "Assistant — AgriMitra AI" }] }),
  component: Assistant,
});

const INTENTS = [
  { id: "weather", label: "Weather", icon: CloudSun, prompt: "Aaj aur kal ka weather forecast batao mere village ke liye." },
  { id: "disease", label: "Disease", icon: Bug, prompt: "Mere crop me yellow patte aur dhabbe ho rahe hain. Kya bimari ho sakti hai?" },
  { id: "fertilizer", label: "Fertilizer", icon: Leaf, prompt: "Iss week mujhe konsi khaad daalni chahiye aur kitni quantity?" },
  { id: "irrigation", label: "Irrigation", icon: Droplets, prompt: "Mere khet me agle 7 din me paani kab dena chahiye?" },
  { id: "mandi", label: "Mandi price", icon: TrendingUp, prompt: "Mere paas ka aaj ka mandi bhav kya hai?" },
  { id: "scheme", label: "Schemes", icon: FileText, prompt: "Kaunsi government scheme mere liye eligible hai aur kaise apply karu?" },
  { id: "machine", label: "Equipment", icon: Tractor, prompt: "Mere paas kya implement rent karna sahi rahega is hafte?" },
  { id: "loan", label: "Loan / KCC", icon: IndianRupee, prompt: "KCC ke through kitna loan mil sakta hai aur kaise apply karu?" },
];

const SUGGESTIONS = [
  "Mere wheat me yellow patte kyu ho rahe hain?",
  "Kal barish hogi ya nahi?",
  "Onion ka aaj ka best mandi rate kya hai?",
  "PM-KISAN ki agli kist kab aayegi?",
  "Drip irrigation lagane me kitna kharcha aata hai?",
  "Tomato me white powder kaise hataye?",
];

const FALLBACK_RESPONSES: Record<string, string> = {
  weather: "📍 Aapke gaon me agle 24 ghante: 28°C, 70% humidity, halki barish 3 PM ke baad. Kal: dhoop, 31°C. Spray aaj subah karein, baad me nahin.",
  disease: "🩺 Patte peele + dhabbe + humidity = **Yellow Rust / Leaf Spot** ho sakta hai. Affected patte tod kar jala dein, Mancozeb 75% WP @ 2g/litre paani ke saath spray karein subah-subah. 7 din baad dobara check karein.",
  fertilizer: "🌱 Aapke crop aur land size ke hisaab se is hafte: **Urea 25 kg/acre + DAP 10 kg/acre** broadcast karein, paani lagne se 1 din pehle. Neem-coated urea use karein — nitrogen loss 25% kam hota hai.",
  irrigation: "💧 Agle 7 din me 2 baar paani dena hoga: Wednesday subah aur Saturday shaam. Drip use karein toh 45 min/zone. Barish 3 PM ke baad expected hai, isliye Saturday morning shift kar sakte hain.",
  mandi: "📈 Aaj ka rate: **Onion ₹2,450/qtl** (Lasalgaon, +8%), **Wheat ₹2,275/qtl** (Karnal, -1%), **Tomato ₹1,850/qtl** (Kolar, +12%). Onion 3-4 din aur hold karna profitable lag raha hai.",
  scheme: "🏛️ Aap **PM-KISAN (₹6,000/year)** aur **PMFBY (crop insurance @ 2% premium)** ke liye eligible hain. KCC bhi le sakte hain. Apply karne ke liye nazdeeki CSC center ya pmkisan.gov.in par jaayein.",
  machine: "🚜 Is week aap CHC (Custom Hiring Center) se **Rotavator ₹600/hr** ya **Sprayer ₹150/day** rent kar sakte hain. Aas-paas 3 centers available hain.",
  loan: "💰 Aapke 2.5 acre par KCC ke through **₹75,000 tak** ka loan mil sakta hai @ 4% interest (with subsidy). Documents: Aadhaar, land record, passport photo. SBI/Cooperative bank me apply karein.",
  emergency: "🚨 Emergency Help activated. Nearest Krishi Vigyan Kendra: KVK Khargone (2.1 km). Helpline: **Kisan Call Centre 1800-180-1551** (free, 6am–10pm). Bata sakte hain kya problem hai — main turant guide karunga.",
  default: "Aapke sawaal ke liye dhanyavaad! 🌾 Aapke location, crops aur season ke hisaab se advice de raha hoon. Aur detail ke liye mic dabakar bolein ya intent button choose karein.",
};

function pickResponse(text: string, intent?: string): string {
  if (intent && FALLBACK_RESPONSES[intent]) return FALLBACK_RESPONSES[intent];
  const t = text.toLowerCase();
  if (/emergency|urgent|madad|help/.test(t)) return FALLBACK_RESPONSES.emergency;
  if (/weather|baris|mausam|rain|forecast/.test(t)) return FALLBACK_RESPONSES.weather;
  if (/bimari|disease|patte|pest|kira|leaf|spot|white|yellow/.test(t)) return FALLBACK_RESPONSES.disease;
  if (/khaad|fertilizer|urea|dap|nutrient/.test(t)) return FALLBACK_RESPONSES.fertilizer;
  if (/paani|irrigat|water|drip/.test(t)) return FALLBACK_RESPONSES.irrigation;
  if (/mandi|bhav|price|rate|market/.test(t)) return FALLBACK_RESPONSES.mandi;
  if (/scheme|sarkar|subsidy|pm-?kisan|insurance|kist/.test(t)) return FALLBACK_RESPONSES.scheme;
  if (/loan|kcc|credit/.test(t)) return FALLBACK_RESPONSES.loan;
  if (/tractor|rotavator|rent|machine/.test(t)) return FALLBACK_RESPONSES.machine;
  return FALLBACK_RESPONSES.default;
}

function newThread(name?: string): ChatThread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [{
      id: crypto.randomUUID(),
      role: "ai",
      ts: Date.now(),
      text: `Namaste ${name?.split(" ")[0] || "Kisan"} 🙏! Main AgriMitra hoon. Mic dabakar boliye ya niche se quick intent choose kariye.`,
    }],
  };
}

function Assistant() {
  const profile = typeof window !== "undefined" ? loadProfile() : {};
  const [lang, setLang] = useState(profile.language || "hi");
  const langObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const [thread, setThread] = useState<ChatThread>(() => {
    if (typeof window === "undefined") return newThread();
    const all = loadChats();
    return all[0] || newThread(profile.name);
  });
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [partial, setPartial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [thread.id]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.messages, partial, thinking]);

  const persist = (next: ChatThread) => {
    setThread(next);
    upsertThread(next);
  };

  const respond = (text: string, intent?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", text: trimmed, ts: Date.now(), intent };
    const next: ChatThread = {
      ...thread,
      title: thread.messages.length <= 1 ? trimmed.slice(0, 40) : thread.title,
      updatedAt: Date.now(),
      messages: [...thread.messages, userMsg],
    };
    persist(next);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const aiMsg: ChatMsg = { id: crypto.randomUUID(), role: "ai", text: pickResponse(trimmed, intent), ts: Date.now() };
      const updated = { ...next, updatedAt: Date.now(), messages: [...next.messages, aiMsg] };
      persist(updated);
      setThinking(false);
    }, 900);
  };

  const newConversation = () => {
    const t = newThread(profile.name);
    persist(t);
    setShowHistory(false);
  };

  const toggleFavorite = (id: string) => {
    const next = {
      ...thread,
      messages: thread.messages.map((m) => m.id === id ? { ...m, favorite: !m.favorite } : m),
    };
    persist(next);
  };

  const copyMsg = async (m: ChatMsg) => {
    try { await navigator.clipboard.writeText(m.text); setCopiedId(m.id); setTimeout(() => setCopiedId(null), 1500); } catch { /* */ }
  };

  const shareMsg = async (m: ChatMsg) => {
    const data = { title: "AgriMitra advice", text: m.text };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(m.text);
    } catch { /* user cancelled */ }
  };

  const speak = (m: ChatMsg) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === m.id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(m.text.replace(/[*_#`]/g, ""));
    u.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
    u.rate = 0.95;
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    setSpeakingId(m.id);
    window.speechSynthesis.speak(u);
  };

  const triggerEmergency = () => {
    setEmergency(true);
    respond("🚨 Emergency help", "emergency");
    setTimeout(() => setEmergency(false), 2200);
  };

  // ---- Recording ----
  const startRecording = async () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone not supported on this device."); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm", "audio/mp4"].find((t) =>
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t),
      );
      if (!mime) {
        stream.getTracks().forEach((t) => t.stop());
        setError("Audio recording not supported in this browser."); return;
      }
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      recorder.onstop = () => transcribe(new Blob(chunksRef.current, { type: mime }));
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone permission denied. Please enable it in browser settings.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recorderRef.current = null;
    streamRef.current = null;
  };

  const transcribe = async (blob: Blob) => {
    if (blob.size < 1024) { setError("Recording was too short. Hold the mic and speak."); return; }
    setTranscribing(true); setPartial("");
    try {
      const form = new FormData();
      form.append("file", blob, `recording.${blob.type.includes("mp4") ? "mp4" : "webm"}`);
      if (lang) form.append("language", lang);
      const res = await fetch("/api/public/transcribe", { method: "POST", body: form });
      if (!res.ok || !res.body) {
        let msg = "Could not transcribe. Please try again.";
        if (!navigator.onLine) msg = "You're offline. Voice transcription needs internet.";
        setError(msg); return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "transcript.text.delta" && evt.delta) { full += evt.delta; setPartial(full); }
            else if (evt.type === "transcript.text.done" && evt.text) { full = evt.text; }
          } catch { /* */ }
        }
      }
      setPartial("");
      if (full.trim()) respond(full.trim());
      else setError("Didn't catch that. Please try again.");
    } catch {
      setError("Network problem. Check your connection.");
    } finally { setTranscribing(false); }
  };

  const showSuggestions = thread.messages.length <= 1 && !thinking;

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <button onClick={() => setShowHistory(true)} className="tap-target grid place-items-center rounded-full hover:bg-muted" aria-label="History">
          <History className="size-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid size-9 place-items-center rounded-2xl gradient-field">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold leading-tight">AgriMitra</h1>
            <p className="text-[10px] text-success">● {langObj.english}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowLang(true)} className="tap-target grid place-items-center rounded-full hover:bg-muted" aria-label="Language">
            <Languages className="size-5" />
          </button>
          <button onClick={newConversation} className="tap-target grid place-items-center rounded-full hover:bg-muted" aria-label="New chat">
            <Plus className="size-5" />
          </button>
        </div>
      </header>

      {/* Intents */}
      <div className="border-b border-border bg-card/40 px-3 py-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {INTENTS.map((it) => (
            <button key={it.id} onClick={() => respond(it.prompt, it.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:bg-primary-soft">
              <it.icon className="size-3.5 text-primary" />{it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {thread.messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[86%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
              m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-card"
            }`}>{m.text}</div>
            {m.role === "ai" && (
              <div className="mt-1 flex gap-1 text-muted-foreground">
                <IconBtn onClick={() => speak(m)} label="Play"><Volume2 className={`size-3.5 ${speakingId === m.id ? "text-primary" : ""}`} /></IconBtn>
                <IconBtn onClick={() => toggleFavorite(m.id)} label="Favorite"><Star className={`size-3.5 ${m.favorite ? "fill-harvest text-harvest" : ""}`} /></IconBtn>
                <IconBtn onClick={() => copyMsg(m)} label="Copy">{copiedId === m.id ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}</IconBtn>
                <IconBtn onClick={() => shareMsg(m)} label="Share"><Share2 className="size-3.5" /></IconBtn>
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <span className="flex gap-0.5">
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary" />
            </span>
            AgriMitra is thinking…
          </div>
        )}

        {(transcribing || partial) && (
          <div className="flex justify-end">
            <div className="max-w-[86%] rounded-3xl rounded-br-md bg-primary/70 px-4 py-3 text-sm text-primary-foreground shadow-soft">
              {partial || "Listening…"}
              <span className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-primary-foreground/80" />
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto flex max-w-sm items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss"><X className="size-3.5" /></button>
          </div>
        )}

        {showSuggestions && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">💡 Try asking</p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => respond(s)}
                  className="rounded-2xl border border-dashed border-border bg-card/60 px-3 py-2 text-left text-xs text-foreground hover:border-primary hover:bg-primary-soft">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listening overlay */}
      {recording && (
        <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center bg-background/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="grid size-32 place-items-center rounded-full gradient-field animate-voice-pulse">
              <Mic className="size-12 text-primary-foreground" />
            </div>
            <p className="text-base font-bold">Listening…</p>
            <p className="text-xs text-muted-foreground">Release mic to send</p>
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-border bg-card px-3 py-3 safe-bottom">
        <div className="flex items-center gap-2">
          <Link to="/app/scan" className="tap-target grid place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Scan crop">
            <Camera className="size-5" />
          </Link>
          <button onClick={triggerEmergency}
            className={`tap-target grid place-items-center rounded-full transition ${emergency ? "bg-destructive text-destructive-foreground animate-voice-pulse" : "text-destructive hover:bg-destructive/10"}`}
            aria-label="Emergency help">
            <AlertTriangle className="size-5" />
          </button>
          <div className="flex flex-1 items-center rounded-full bg-muted px-4">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && respond(input)}
              placeholder={recording ? "Listening…" : "Ask or hold mic to speak"}
              className="flex-1 bg-transparent py-2.5 text-sm outline-none"
              disabled={recording || transcribing} />
          </div>
          {input.trim() ? (
            <button onClick={() => respond(input)} className="tap-target grid place-items-center rounded-full bg-primary text-primary-foreground shadow-float" aria-label="Send">
              <Send className="size-5" />
            </button>
          ) : recording ? (
            <button onClick={stopRecording} className="tap-target grid place-items-center rounded-full bg-destructive text-destructive-foreground shadow-float" aria-label="Stop">
              <Square className="size-5 fill-current" />
            </button>
          ) : (
            <button
              onPointerDown={(e) => { e.preventDefault(); startRecording(); }}
              onPointerUp={(e) => { e.preventDefault(); if (recording) stopRecording(); }}
              onPointerLeave={() => { if (recording) stopRecording(); }}
              disabled={transcribing}
              className="tap-target grid place-items-center rounded-full gradient-harvest text-harvest-foreground shadow-float"
              aria-label="Hold to speak">
              <Mic className="size-5" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          {recording ? "🎙️ Release to send" : transcribing ? "Transcribing…" : "Hold mic · tap 🚨 for emergency"}
        </p>
      </div>

      {/* History drawer */}
      {showHistory && (
        <Sheet onClose={() => setShowHistory(false)} title="Conversations">
          <button onClick={newConversation} className="mb-3 flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft p-3 text-sm font-bold text-primary">
            <Plus className="size-4" /> New conversation
          </button>
          <HistoryList currentId={thread.id} onSelect={(t) => { setThread(t); setShowHistory(false); }} />
          <div className="mt-4">
            <Link to="/app/history" onClick={() => setShowHistory(false)} className="block rounded-2xl bg-card p-3 text-center text-sm font-semibold text-primary">
              View full history & favorites →
            </Link>
          </div>
        </Sheet>
      )}

      {/* Language picker */}
      {showLang && (
        <Sheet onClose={() => setShowLang(false)} title="Choose language">
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.slice(0, 8).map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); saveProfile({ language: l.code }); setShowLang(false); }}
                className={`rounded-2xl border p-3 text-left ${lang === l.code ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                <p className="text-base font-bold">{l.name}</p>
                <p className="text-[11px] text-muted-foreground">{l.english}</p>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label}
      className="grid size-7 place-items-center rounded-full hover:bg-muted">
      {children}
    </button>
  );
}

function HistoryList({ currentId, onSelect }: { currentId: string; onSelect: (t: ChatThread) => void }) {
  const threads = useMemo(() => loadChats(), []);
  if (threads.length === 0) return <p className="text-center text-sm text-muted-foreground">No conversations yet.</p>;
  return (
    <div className="space-y-1.5">
      {threads.map((t) => (
        <button key={t.id} onClick={() => onSelect(t)}
          className={`w-full rounded-2xl border p-3 text-left ${t.id === currentId ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted"}`}>
          <p className="truncate text-sm font-semibold">{t.title}</p>
          <p className="text-[11px] text-muted-foreground">{new Date(t.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {t.messages.length} msgs</p>
        </button>
      ))}
    </div>
  );
}

function Sheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background p-5 shadow-float safe-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="tap-target grid place-items-center rounded-full hover:bg-muted"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
