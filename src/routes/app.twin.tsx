import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Droplets, Leaf, Sparkles, TrendingUp, AlertTriangle, Wallet } from "lucide-react";

export const Route = createFileRoute("/app/twin")({
  head: () => ({ meta: [{ title: "Digital Twin — AgriMitra AI" }] }),
  component: Twin,
});

const SCORES = [
  { label: "Farm Health", value: 82, color: "text-emerald-500", ring: "stroke-emerald-500", icon: Leaf },
  { label: "Productivity", value: 74, color: "text-sky-500", ring: "stroke-sky-500", icon: TrendingUp },
  { label: "Water Efficiency", value: 68, color: "text-cyan-500", ring: "stroke-cyan-500", icon: Droplets },
  { label: "Profitability", value: 71, color: "text-amber-500", ring: "stroke-amber-500", icon: Wallet },
];

const HISTORY = [
  { season: "Rabi 24", crop: "Wheat", yield: 18.2, rev: 42000, status: "good" },
  { season: "Kharif 24", crop: "Soybean", yield: 9.1, rev: 31000, status: "avg" },
  { season: "Rabi 23", crop: "Wheat", yield: 16.0, rev: 36000, status: "good" },
  { season: "Kharif 23", crop: "Cotton", yield: 6.4, rev: 28000, status: "low" },
];

const INSIGHTS = [
  { t: "Yield up 12% vs last Rabi", s: "Better N-management is paying off." , tone: "good" },
  { t: "Water use 18% above peers", s: "Switch to drip on plot B to save ~15,000 L/week.", tone: "warn" },
  { t: "Pest pressure rising in 5 km", s: "Scout for aphids in next 48h.", tone: "alert" },
];

function Twin() {
  return (
    <div className="animate-fade-up pb-8">
      <header className="gradient-field rounded-b-4xl px-5 pt-8 pb-12 text-primary-foreground">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold opacity-90">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Brain className="size-5" />
          <p className="text-xs font-bold uppercase tracking-wider opacity-90">Digital Twin</p>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">Your farm, mirrored by AI</h1>
        <p className="text-sm opacity-90">2.4 acre · Wheat + Soybean · Pune, MH</p>

        <div className="mt-5 rounded-3xl bg-primary-foreground/10 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">Overall AI score</p>
            <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold">Live</span>
          </div>
          <p className="mt-1 text-5xl font-black">74<span className="text-2xl opacity-70">/100</span></p>
          <p className="text-xs opacity-90">Healthy · Outperforming 62% of similar farms nearby</p>
        </div>
      </header>

      <section className="-mt-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          {SCORES.map((s) => <ScoreCard key={s.label} {...s} />)}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI insights</h2>
        <div className="mt-2 space-y-2">
          {INSIGHTS.map((i) => (
            <div key={i.t} className={`rounded-2xl p-4 shadow-soft ${i.tone === "good" ? "bg-emerald-500/10" : i.tone === "warn" ? "bg-amber-500/10" : "bg-rose-500/10"}`}>
              <div className="flex items-start gap-2">
                {i.tone === "good" ? <Sparkles className="size-4 text-emerald-600" /> : <AlertTriangle className={`size-4 ${i.tone === "warn" ? "text-amber-600" : "text-rose-600"}`} />}
                <div className="flex-1">
                  <p className="font-bold">{i.t}</p>
                  <p className="text-xs text-muted-foreground">{i.s}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Historical performance</h2>
        <div className="mt-2 overflow-hidden rounded-2xl bg-card shadow-soft">
          {HISTORY.map((h, idx) => (
            <div key={idx} className="flex items-center gap-3 border-b border-border p-3 last:border-0">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-lg">
                {h.crop === "Wheat" ? "🌾" : h.crop === "Soybean" ? "🫘" : "🧶"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{h.crop} <span className="text-xs font-normal text-muted-foreground">· {h.season}</span></p>
                <p className="text-xs text-muted-foreground">{h.yield} q · ₹{h.rev.toLocaleString("en-IN")}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                h.status === "good" ? "bg-emerald-500/15 text-emerald-700" :
                h.status === "avg" ? "bg-amber-500/15 text-amber-700" : "bg-rose-500/15 text-rose-700"
              }`}>{h.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personalized recommendations</h2>
        <ol className="mt-2 space-y-2">
          {[
            "Apply 30 kg urea/acre before Thursday's rain.",
            "Test soil pH for plot B before next sowing.",
            "Consider switching plot A to drip irrigation.",
            "Enroll in PMFBY by Oct 30 — eligible.",
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-soft">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
              <p className="flex-1 text-sm">{r}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, color, ring, icon: Icon }: any) {
  const c = 2 * Math.PI * 26;
  const off = c - (value / 100) * c;
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className={`size-4 ${color}`} /> {label}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" className="fill-none stroke-muted" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="26"
            className={`fill-none ${ring}`}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off}
            transform="rotate(-90 32 32)"
          />
          <text x="32" y="37" textAnchor="middle" className="fill-foreground text-base font-extrabold">{value}</text>
        </svg>
        <div className="text-[11px] text-muted-foreground">vs peers<br /><span className="font-bold text-foreground">+{Math.round(value / 10)}%</span></div>
      </div>
    </div>
  );
}
