import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp, TrendingDown, CloudRain, Sun, Droplets, Wind, Thermometer,
  IndianRupee, FileText, ChevronRight, AlertTriangle, Calendar, MapPin, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/app/insights")({
  head: () => ({ meta: [{ title: "Intelligence Hub — AgriMitra AI" }] }),
  component: Insights,
});

const PRICES = [
  { crop: "Onion", emoji: "🧅", price: 2450, unit: "/qtl", change: 8.2, mandi: "Lasalgaon", signal: "Sell" as const, trend: [38, 42, 41, 45, 48, 46, 51] },
  { crop: "Wheat", emoji: "🌾", price: 2275, unit: "/qtl", change: -1.4, mandi: "Karnal", signal: "Hold" as const, trend: [50, 49, 48, 48, 47, 46, 46] },
  { crop: "Tomato", emoji: "🍅", price: 1850, unit: "/qtl", change: 12.6, mandi: "Kolar", signal: "Sell" as const, trend: [30, 32, 35, 38, 41, 44, 49] },
  { crop: "Soybean", emoji: "🫘", price: 4620, unit: "/qtl", change: 3.1, mandi: "Indore", signal: "Wait" as const, trend: [42, 43, 44, 43, 45, 46, 47] },
];

const SCHEMES = [
  { id: "pmkisan", title: "PM-KISAN Samman Nidhi", amount: "₹6,000/yr", badge: "Eligible", badgeClass: "bg-success/20 text-success", desc: "Direct income support, paid in 3 instalments. Next instalment in 14 days.", docs: ["Aadhaar", "Land record", "Bank account"] },
  { id: "pmfby", title: "Pradhan Mantri Fasal Bima Yojana", amount: "@ 2% premium", badge: "Apply by 31 Jul", badgeClass: "bg-harvest/20 text-harvest", desc: "Crop insurance covering drought, flood, hail and pests. Government pays 95% of premium.", docs: ["Aadhaar", "Sowing certificate", "Bank passbook"] },
  { id: "kcc", title: "Kisan Credit Card (KCC)", amount: "Up to ₹75,000", badge: "Pre-approved", badgeClass: "bg-primary-soft text-primary", desc: "Short-term credit @ 4% interest with subsidy. Use for inputs, equipment, household needs.", docs: ["Aadhaar", "Land record", "Photo"] },
];

const MINI_TONES: Record<string, string> = {
  sky: "text-sky", success: "text-success", harvest: "text-harvest", primary: "text-primary",
};

const SIGNAL_TONES: Record<string, string> = {
  Sell: "bg-success/15 text-success",
  Hold: "bg-harvest/20 text-harvest",
  Wait: "bg-muted text-muted-foreground",
};


function Insights() {
  const [tab, setTab] = useState<"overview" | "weather" | "market" | "schemes">("overview");

  return (
    <div className="animate-fade-up pb-6">
      <header className="px-5 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Intelligence Hub</p>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">Today's actions for you</h1>
        <p className="text-sm text-muted-foreground"><MapPin className="mr-1 inline size-3" /> Khargone, Madhya Pradesh</p>
      </header>

      {/* Tabs */}
      <div className="mt-4 overflow-x-auto px-5">
        <div className="inline-flex gap-1.5 rounded-full bg-muted p-1">
          {(["overview", "weather", "market", "schemes"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${tab === t ? "bg-card shadow-soft" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && <Overview />}
      {tab === "weather" && <WeatherTab />}
      {tab === "market" && <MarketTab />}
      {tab === "schemes" && <SchemesTab />}
    </div>
  );
}

function Overview() {
  return (
    <div className="mt-4 space-y-4 px-5">
      {/* Top alert */}
      <div className="flex items-start gap-3 rounded-3xl bg-harvest/15 p-4">
        <AlertTriangle className="size-5 shrink-0 text-harvest" />
        <div>
          <p className="text-sm font-bold">Heavy rain expected Wed 3 PM</p>
          <p className="text-xs text-muted-foreground">Skip Wednesday irrigation. Cover harvested onion. Tomato spray after rain stops.</p>
        </div>
      </div>

      {/* 3 quick cards */}
      <div className="grid grid-cols-3 gap-2">
        <MiniCard tint="sky" icon={CloudRain} label="Rain in" value="32h" sub="78% chance" />
        <MiniCard tint="success" icon={TrendingUp} label="Onion" value="+8.2%" sub="Sell signal" />
        <MiniCard tint="harvest" icon={FileText} label="Schemes" value="3" sub="Eligible" />
      </div>

      {/* Today summary */}
      <article className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="text-sm font-bold">📋 Do this today</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <Action emoji="💧" text="Skip irrigation — rain expected Wed" />
          <Action emoji="🚜" text="Sell 2 quintals onion at Lasalgaon" />
          <Action emoji="🩺" text="Inspect wheat field for yellow rust" />
          <Action emoji="📝" text="Submit PMFBY application by 31 July" />
        </ul>
      </article>

      <Link to="/app/assistant" className="flex items-center justify-between rounded-3xl gradient-field p-4 text-primary-foreground shadow-float">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Ask AgriMitra</p>
          <p className="text-base font-bold">Get personalised advice in your language</p>
        </div>
        <ChevronRight className="size-5" />
      </Link>
    </div>
  );
}

function WeatherTab() {
  const hours = [
    { t: "Now", c: 28, i: "⛅" }, { t: "12 PM", c: 30, i: "☀️" }, { t: "3 PM", c: 27, i: "🌧️" },
    { t: "6 PM", c: 25, i: "🌧️" }, { t: "9 PM", c: 24, i: "⛅" }, { t: "12 AM", c: 23, i: "🌙" },
  ];
  const week = [
    { d: "Mon", i: "☀️", h: 31, l: 22 }, { d: "Tue", i: "🌤️", h: 30, l: 22 },
    { d: "Wed", i: "🌧️", h: 27, l: 21 }, { d: "Thu", i: "🌧️", h: 26, l: 20 },
    { d: "Fri", i: "⛅", h: 28, l: 21 }, { d: "Sat", i: "☀️", h: 30, l: 22 }, { d: "Sun", i: "☀️", h: 31, l: 22 },
  ];
  return (
    <div className="mt-4 space-y-4 px-5">
      <div className="rounded-3xl bg-sky/15 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Khargone, MP · Now</p>
            <p className="mt-1 text-5xl font-extrabold">28°</p>
            <p className="text-sm text-muted-foreground">Partly cloudy · feels 31°</p>
          </div>
          <span className="text-7xl">⛅</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <Metric icon={Droplets} label="Humidity" v="68%" />
          <Metric icon={Wind} label="Wind" v="12 km/h" />
          <Metric icon={Sun} label="UV" v="6 High" />
        </div>
      </div>

      <Card title="Next 12 hours">
        <div className="flex justify-between overflow-x-auto">
          {hours.map((h) => (
            <div key={h.t} className="flex shrink-0 flex-col items-center gap-1 px-2">
              <span className="text-[11px] font-semibold text-muted-foreground">{h.t}</span>
              <span className="text-xl">{h.i}</span>
              <span className="text-xs font-bold">{h.c}°</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="7-day forecast">
        <div className="space-y-1.5">
          {week.map((d) => (
            <div key={d.d} className="flex items-center justify-between text-sm">
              <span className="w-12 font-semibold">{d.d}</span>
              <span className="text-lg">{d.i}</span>
              <div className="flex-1 mx-3 h-1 rounded-full bg-muted">
                <div className="h-1 rounded-full bg-harvest" style={{ width: `${(d.h - 18) * 6}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{d.l}°</span>
              <span className="ml-2 w-6 text-right font-bold">{d.h}°</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="rounded-3xl bg-success/10 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-success"><Thermometer className="size-4" /> Irrigation advice</p>
        <p className="mt-1 text-xs text-foreground/90">Heavy rain Wed-Thu (28mm). Skip Wed irrigation; resume Friday evening 45 min/zone via drip.</p>
      </div>
    </div>
  );
}

function MarketTab() {
  return (
    <div className="mt-4 space-y-3 px-5">
      <div className="rounded-3xl bg-card p-4 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Best opportunity now</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-3xl">🍅</span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">Tomato @ Kolar · ₹1,850/qtl</p>
            <p className="text-xs text-success">+12.6% this week · Sell within 3 days for max profit</p>
          </div>
        </div>
      </div>

      {PRICES.map((p) => {
        const up = p.change >= 0;
        return (
          <article key={p.crop} className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="font-bold">{p.crop}</p>
                  <p className="text-[11px] text-muted-foreground">{p.mandi}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end font-extrabold">
                  <IndianRupee className="size-4" />{p.price.toLocaleString("en-IN")}
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">{p.unit}</span>
                </p>
                <p className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${up ? "text-success" : "text-destructive"}`}>
                  {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {Math.abs(p.change)}%
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Sparkline points={p.trend} positive={up} />
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${SIGNAL_TONES[p.signal]}`}>{p.signal}</span>
            </div>
          </article>
        );
      })}

    </div>
  );
}

function SchemesTab() {
  return (
    <div className="mt-4 space-y-3 px-5">
      <p className="text-xs text-muted-foreground">Based on your profile, land size & crops, you are eligible for {SCHEMES.length} schemes.</p>
      {SCHEMES.map((s) => (
        <article key={s.id} className="rounded-3xl bg-card p-4 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold leading-tight">{s.title}</h3>
              <p className="text-sm font-bold text-primary">{s.amount}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${s.badgeClass}`}>{s.badge}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.docs.map((d) => (
              <span key={d} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{d}</span>
            ))}
          </div>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
            <Calendar className="size-3.5" /> Apply now
          </button>
        </article>
      ))}
    </div>
  );
}

function MiniCard({ tint, icon: Icon, label, value, sub }: { tint: string; icon: typeof Sun; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
      <Icon className={`mx-auto size-4 ${MINI_TONES[tint] || "text-primary"}`} />
      <p className="mt-1 text-lg font-extrabold leading-none">{value}</p>
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, v }: { icon: typeof Sun; label: string; v: string }) {
  return (
    <div className="rounded-2xl bg-card/70 p-2.5">
      <Icon className="mx-auto size-4 text-sky" />
      <p className="mt-1 text-sm font-bold">{v}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Action({ emoji, text }: { emoji: string; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="text-lg">{emoji}</span>
      <span className="flex-1 text-foreground/90">{text}</span>
    </li>
  );
}

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const max = Math.max(...points), min = Math.min(...points), r = max - min || 1;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 100},${30 - ((p - min) / r) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-7 flex-1" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={positive ? "text-success" : "text-destructive"} />
    </svg>
  );
}
