import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Headphones, PlayCircle, Search, Sparkles, FileText, Landmark, CalendarDays } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Hub — AgriMitra AI" }] }),
  component: Knowledge,
});

const TABS = ["For you", "Videos", "Audio", "Guides", "Govt", "Seasonal"] as const;

const VIDEOS = [
  { title: "Yellow rust in wheat — early detection", dur: "4:21", lang: "Hindi", views: "12.4k", thumb: "from-amber-400 to-orange-600" },
  { title: "Drip irrigation setup in 1 acre", dur: "6:08", lang: "Marathi", views: "8.2k", thumb: "from-sky-400 to-indigo-600" },
  { title: "Soil testing without a lab", dur: "3:45", lang: "Tamil", views: "5.7k", thumb: "from-emerald-400 to-teal-600" },
  { title: "Mandi price reading guide", dur: "2:58", lang: "Telugu", views: "9.1k", thumb: "from-rose-400 to-fuchsia-600" },
];

const AUDIO = [
  { title: "Weekly weather briefing — Maharashtra", dur: "1:42", host: "Krishi Vaani" },
  { title: "PM Kisan — how to apply step by step", dur: "3:10", host: "Yojana Mitra" },
  { title: "Cotton pest control basics", dur: "5:24", host: "Dr. Anita Rao" },
];

const GUIDES = [
  { title: "Wheat — complete sowing-to-harvest playbook", read: "12 min" },
  { title: "Organic fertilizers from kitchen waste", read: "6 min" },
  { title: "Crop insurance: claim in 7 steps", read: "8 min" },
];

const SCHEMES = [
  { title: "PM-KISAN", desc: "₹6,000/year direct benefit", status: "Eligible" },
  { title: "PMFBY Crop Insurance", desc: "Premium subsidy up to 90%", status: "Apply now" },
  { title: "Soil Health Card", desc: "Free soil testing", status: "Active" },
];

function Knowledge() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("For you");
  return (
    <div className="animate-fade-up pb-8">
      <header className="px-5 pt-8 pb-3">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Knowledge Hub</h1>
        <p className="text-sm text-muted-foreground">Learn in your language, at your pace.</p>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-card px-3 py-2.5 shadow-soft">
          <Search className="size-4 text-muted-foreground" />
          <input placeholder="Search videos, guides, schemes…" className="flex-1 bg-transparent text-sm outline-none" />
          <button aria-label="Voice search" className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
            🎙
          </button>
        </label>
      </header>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t ? "bg-foreground text-background" : "bg-card text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "For you" && (
        <>
          <Section icon={Sparkles} title="Recommended for you" subtitle="Based on your wheat crop and Maharashtra weather">
            <div className="hide-scrollbar flex gap-3 overflow-x-auto px-5">
              {VIDEOS.slice(0, 3).map((v) => <VideoCard key={v.title} v={v} />)}
            </div>
          </Section>
          <Section icon={Headphones} title="Audio lessons" subtitle="Listen while you work">
            <div className="space-y-2 px-5">{AUDIO.map((a) => <AudioRow key={a.title} a={a} />)}</div>
          </Section>
          <Section icon={CalendarDays} title="Seasonal — Rabi 2026" subtitle="What to do this week">
            <div className="mx-5 rounded-3xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold">🌾 Top up nitrogen this week</p>
              <p className="mt-1 text-xs text-muted-foreground">Your wheat is at 42 DAS. Apply 30 kg urea/acre before forecasted rain on Thursday.</p>
              <button className="mt-3 text-xs font-bold text-primary">Open playbook →</button>
            </div>
          </Section>
        </>
      )}

      {tab === "Videos" && (
        <div className="grid grid-cols-2 gap-3 px-5">
          {VIDEOS.map((v) => <VideoCard key={v.title} v={v} grid />)}
        </div>
      )}
      {tab === "Audio" && <div className="space-y-2 px-5">{AUDIO.map((a) => <AudioRow key={a.title} a={a} />)}</div>}
      {tab === "Guides" && (
        <div className="space-y-2 px-5">
          {GUIDES.map((g) => (
            <div key={g.title} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
              <div className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-600"><FileText className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.read} read</p>
              </div>
              <BookOpen className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
      {tab === "Govt" && (
        <div className="space-y-2 px-5">
          {SCHEMES.map((s) => (
            <div key={s.title} className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <Landmark className="size-4 text-primary" />
                <p className="flex-1 font-semibold">{s.title}</p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{s.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "Seasonal" && (
        <div className="space-y-2 px-5">
          {["This week", "This month", "Next 90 days"].map((t, i) => (
            <div key={t} className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{t}</p>
              <p className="mt-1 text-sm">{["Top-dress nitrogen, scout for aphids", "Begin irrigation cycle 4, monitor yellow rust", "Plan harvest logistics & storage"][i]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, children }: { icon: any; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="px-5 mb-3 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
      </div>
      {subtitle && <p className="px-5 -mt-2 mb-3 text-xs text-muted-foreground">{subtitle}</p>}
      {children}
    </section>
  );
}

function VideoCard({ v, grid }: { v: any; grid?: boolean }) {
  return (
    <div className={`${grid ? "" : "min-w-[68%]"} overflow-hidden rounded-2xl bg-card shadow-soft`}>
      <div className={`relative aspect-video bg-gradient-to-br ${v.thumb}`}>
        <PlayCircle className="absolute inset-0 m-auto size-10 text-white drop-shadow" />
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">{v.dur}</span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{v.title}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{v.lang} · {v.views} views</p>
      </div>
    </div>
  );
}

function AudioRow({ a }: { a: any }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <button className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><PlayCircle className="size-6" /></button>
      <div className="flex-1 min-w-0">
        <p className="truncate font-semibold">{a.title}</p>
        <p className="text-xs text-muted-foreground">{a.host} · {a.dur}</p>
      </div>
    </div>
  );
}
