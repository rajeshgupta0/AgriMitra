import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X, Star, Trash2, MessageCircle, Camera, Search } from "lucide-react";
import { loadChats, deleteThread, getFavorites, loadScans, deleteScan } from "@/lib/agri-store";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "History — AgriMitra AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"chats" | "favorites" | "scans">("chats");
  const [q, setQ] = useState("");
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  const chats = useMemo(() => loadChats().filter((t) => t.title.toLowerCase().includes(q.toLowerCase())), [q, tab]);
  const favs = useMemo(() => getFavorites().filter((m) => m.text.toLowerCase().includes(q.toLowerCase())), [q, tab]);
  const scans = useMemo(() => loadScans().filter((s) => s.disease.toLowerCase().includes(q.toLowerCase())), [q, tab]);

  return (
    <div className="animate-fade-up pb-6">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 pb-3 pt-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <button onClick={() => nav({ to: "/app/assistant" })} className="tap-target grid place-items-center rounded-full hover:bg-muted" aria-label="Back">
            <X className="size-5" />
          </button>
          <h1 className="text-base font-bold">History</h1>
          <span className="size-10" />
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-full bg-muted px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <div className="mt-3 flex gap-1.5 rounded-full bg-muted p-1">
          {(["chats", "favorites", "scans"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${tab === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4">
        {tab === "chats" && (chats.length ? chats.map((t) => (
          <div key={t.id} className="mb-2 flex items-center gap-2 rounded-2xl bg-card p-3 shadow-soft">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><MessageCircle className="size-5" /></div>
            <Link to="/app/assistant" className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{t.title}</p>
              <p className="text-[11px] text-muted-foreground">{new Date(t.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {t.messages.length} msgs</p>
            </Link>
            <button onClick={() => { deleteThread(t.id); refresh(); }} aria-label="Delete" className="tap-target grid place-items-center text-muted-foreground hover:text-destructive">
              <Trash2 className="size-4" />
            </button>
          </div>
        )) : <Empty label="No conversations yet" />)}

        {tab === "favorites" && (favs.length ? favs.map((m) => (
          <article key={m.id} className="mb-2 rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex items-center gap-1.5 text-xs text-harvest">
              <Star className="size-3.5 fill-current" /> Favorite · {new Date(m.ts).toLocaleDateString("en-IN")}
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
          </article>
        )) : <Empty label="Star an AgriMitra reply to save it here" />)}

        {tab === "scans" && (scans.length ? scans.map((s) => (
          <div key={s.id} className="mb-2 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
            {s.imageDataUrl ? <img src={s.imageDataUrl} alt="" className="size-12 rounded-xl object-cover" /> :
              <div className="grid size-12 place-items-center rounded-xl bg-muted"><Camera className="size-5 text-muted-foreground" /></div>}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{s.disease}</p>
              <p className="text-[11px] text-muted-foreground">{new Date(s.ts).toLocaleDateString("en-IN")} · {s.severity} · {Math.round(s.confidence * 100)}%</p>
            </div>
            <button onClick={() => { deleteScan(s.id); refresh(); }} aria-label="Delete" className="tap-target grid place-items-center text-muted-foreground hover:text-destructive">
              <Trash2 className="size-4" />
            </button>
          </div>
        )) : <Empty label="No crop scans yet" />)}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="mt-10 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-muted"><Star className="size-7 text-muted-foreground" /></div>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
