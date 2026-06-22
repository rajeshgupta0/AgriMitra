import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Droplets, Sprout, Wheat, FlaskConical, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/planner")({
  head: () => ({ meta: [{ title: "Smart Planner — AgriMitra AI" }] }),
  component: Planner,
});

const TABS = ["Yield", "Crop", "Sowing", "Harvest", "Fertilizer"] as const;

function Planner() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Yield");
  return (
    <div className="animate-fade-up pb-8">
      <header className="px-5 pt-8 pb-3">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold">Smart Planner</h1>
        <p className="text-sm text-muted-foreground">Decision support powered by AI.</p>
      </header>

      <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto px-5 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t ? "bg-foreground text-background" : "bg-card text-muted-foreground"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === "Yield" && <Yield />}
      {tab === "Crop" && <Crop />}
      {tab === "Sowing" && <Sowing />}
      {tab === "Harvest" && <Harvest />}
      {tab === "Fertilizer" && <Fert />}
    </div>
  );
}

function Yield() {
  return (
    <div className="space-y-3 px-5">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-float">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
          <TrendingUp className="size-4" /> Predicted yield · Rabi 2026
        </div>
        <p className="mt-1 text-5xl font-black">19.6 <span className="text-xl opacity-80">q/acre</span></p>
        <p className="text-xs opacity-90">+8% vs last season · 92% confidence</p>
        <div className="mt-4 grid h-16 grid-cols-12 items-end gap-1">
          {[40, 55, 48, 62, 70, 65, 78, 82, 88, 84, 92, 96].map((v, i) => (
            <div key={i} className="rounded bg-white/70" style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
      <Card title="Inputs used" rows={[["Soil type", "Clay loam"], ["Avg rainfall", "640 mm"], ["Last yield", "18.2 q"], ["Variety", "HD-2967"]]} />
      <Card title="Revenue estimate" rows={[["Yield", "19.6 q × ₹2,250"], ["Gross", "₹44,100"], ["Input cost", "-₹13,400"], ["Net", "₹30,700"]]} highlight="Net" />
    </div>
  );
}

function Crop() {
  const recs = [
    { crop: "Wheat HD-2967", fit: 94, why: "Best match for soil + weather + market", emoji: "🌾" },
    { crop: "Chickpea JG-11", fit: 86, why: "Excellent for rotation + N-fixation", emoji: "🫛" },
    { crop: "Mustard RH-749", fit: 78, why: "Drought tolerant, good mandi price", emoji: "🌼" },
  ];
  return (
    <div className="space-y-2 px-5">
      {recs.map((r) => (
        <div key={r.crop} className="rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-2xl">{r.emoji}</div>
            <div className="flex-1">
              <p className="font-bold">{r.crop}</p>
              <p className="text-xs text-muted-foreground">{r.why}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-emerald-600">{r.fit}%</p>
              <p className="text-[10px] uppercase text-muted-foreground">fit</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Sowing() {
  return (
    <div className="space-y-3 px-5">
      <div className="rounded-3xl bg-card p-4 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Optimal sowing window</p>
        <p className="mt-1 text-lg font-extrabold">Nov 12 – Nov 22, 2026</p>
        <p className="text-xs text-muted-foreground">Based on soil moisture, temp, & 14-day forecast</p>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px]">
          {["8", "9", "10", "11", "12", "13", "14"].map((d, i) => (
            <div key={d} className={`rounded-lg py-2 ${i >= 4 ? "bg-emerald-500/20 font-bold text-emerald-700" : "bg-muted text-muted-foreground"}`}>{d}</div>
          ))}
        </div>
      </div>
      <Card title="Resource checklist" rows={[["Seeds", "40 kg/acre"], ["Seed treatment", "Carbendazim 2g/kg"], ["Pre-sowing irrigation", "Yes"], ["Spacing", "22 cm row"]]} />
    </div>
  );
}

function Harvest() {
  return (
    <div className="space-y-3 px-5">
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-float">
        <CalendarDays className="size-5 opacity-90" />
        <p className="mt-2 text-xs font-bold uppercase tracking-wider opacity-90">Harvest window</p>
        <p className="text-2xl font-extrabold">Mar 28 – Apr 6, 2027</p>
        <p className="text-xs opacity-90">Grain moisture forecast: 14% · Dry spell confirmed</p>
      </div>
      <Card title="Logistics" rows={[["Combine harvester", "Book by Mar 15"], ["Storage", "8 q × jute bags"], ["Mandi", "Pune APMC · ₹2,310"], ["Transport", "₹1,200 (one trip)"]]} />
    </div>
  );
}

function Fert() {
  return (
    <div className="space-y-3 px-5">
      <div className="rounded-3xl bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2"><FlaskConical className="size-4 text-primary" /><p className="text-xs font-bold uppercase tracking-wider">Recommended schedule</p></div>
        <ol className="mt-3 space-y-2 text-sm">
          {[
            ["Basal (0 DAS)", "DAP 50 kg + MOP 25 kg/acre"],
            ["Tillering (25 DAS)", "Urea 30 kg/acre"],
            ["Booting (55 DAS)", "Urea 25 kg/acre + foliar Zn"],
            ["Grain fill (85 DAS)", "Foliar 19:19:19 @ 0.5%"],
          ].map(([k, v]) => (
            <li key={k} className="flex gap-3 rounded-xl bg-muted/40 p-2.5">
              <Sprout className="mt-0.5 size-4 text-primary" />
              <div><p className="font-semibold">{k}</p><p className="text-xs text-muted-foreground">{v}</p></div>
            </li>
          ))}
        </ol>
      </div>
      <Card title="Estimated cost" rows={[["DAP", "₹1,350"], ["MOP", "₹450"], ["Urea (2 splits)", "₹730"], ["Foliar", "₹240"]]} highlight="Total" />
    </div>
  );
}

function Card({ title, rows, highlight }: { title: string; rows: string[][]; highlight?: string }) {
  const total = rows.reduce((s, [, v]) => s + (parseInt(String(v).replace(/[^\d]/g, "")) || 0), 0);
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2 divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
        {highlight && (
          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="font-bold">{highlight}</span>
            <span className="font-extrabold text-primary">₹{total.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
