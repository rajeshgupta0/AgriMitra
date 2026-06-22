import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bug, CloudRain, Droplet, ShieldAlert, Sprout, TrendingDown, Bell } from "lucide-react";

export const Route = createFileRoute("/app/risk")({
  head: () => ({ meta: [{ title: "Risk Engine — AgriMitra AI" }] }),
  component: Risk,
});

const RISKS = [
  { id: "disease", label: "Disease", prob: 72, sev: "High", icon: Sprout, tint: "from-rose-500 to-red-600", note: "Yellow rust in wheat — humid days ahead" },
  { id: "pest", label: "Pest", prob: 48, sev: "Medium", icon: Bug, tint: "from-orange-500 to-amber-600", note: "Aphid pressure rising 5 km radius" },
  { id: "weather", label: "Weather", prob: 35, sev: "Low", icon: CloudRain, tint: "from-sky-500 to-indigo-600", note: "Heavy rain possible Thu evening" },
  { id: "water", label: "Water stress", prob: 22, sev: "Low", icon: Droplet, tint: "from-cyan-500 to-teal-600", note: "Reservoir at 64% — adequate" },
  { id: "yield", label: "Yield", prob: 41, sev: "Medium", icon: TrendingDown, tint: "from-violet-500 to-purple-600", note: "Forecast 8% below last Rabi" },
];

const HEAT = Array.from({ length: 35 }, (_, i) => (i * 13 + 17) % 100);

function Risk() {
  const overall = 64;
  return (
    <div className="animate-fade-up pb-8">
      <header className="px-5 pt-8 pb-3">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <ShieldAlert className="size-5 text-rose-600" />
          <h1 className="text-2xl font-extrabold">Risk Engine</h1>
        </div>
        <p className="text-sm text-muted-foreground">Predicted threats over the next 14 days.</p>
      </header>

      <section className="px-5">
        <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 p-5 text-white shadow-float">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">Overall farm risk</p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">Updated 12m ago</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-6xl font-black leading-none">{overall}</p>
              <p className="text-xs opacity-90">High alert · take action within 48h</p>
            </div>
            <Ring value={overall} />
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Risk breakdown</h2>
        <div className="mt-2 space-y-2">
          {RISKS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${r.tint} text-white`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.note}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    r.sev === "High" ? "bg-rose-500/15 text-rose-700" :
                    r.sev === "Medium" ? "bg-amber-500/15 text-amber-700" : "bg-emerald-500/15 text-emerald-700"
                  }`}>{r.sev}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full bg-gradient-to-r ${r.tint}`} style={{ width: `${r.prob}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Probability {r.prob}%</span>
                  <span>Impact: ₹{(r.prob * 240).toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Disease heatmap · 5 km</h2>
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-soft">
          <div className="grid grid-cols-7 gap-1">
            {HEAT.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded"
                style={{
                  background: `hsl(${(1 - v / 100) * 120}, 80%, ${75 - v / 4}%)`,
                }}
                title={`${v}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Low</span>
            <div className="h-1.5 flex-1 mx-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
            <span>High</span>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Early warning center</h2>
        <div className="mt-2 space-y-2">
          {[
            { t: "Yellow rust outbreak in 3 km", time: "2h ago", urgent: true },
            { t: "Heavy rain alert — Thu 6-9pm", time: "1h ago", urgent: false },
            { t: "Aphid sightings reported by 4 farmers", time: "Today", urgent: false },
          ].map((a) => (
            <div key={a.t} className={`flex items-center gap-3 rounded-2xl p-3 shadow-soft ${a.urgent ? "bg-rose-500/10" : "bg-card"}`}>
              <Bell className={`size-4 ${a.urgent ? "text-rose-600" : "text-muted-foreground"}`} />
              <p className="flex-1 text-sm font-semibold">{a.t}</p>
              <span className="text-[11px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recommended actions</h2>
        <div className="mt-2 space-y-2">
          {[
            { t: "Spray Propiconazole 25 EC", d: "1 ml/L · before rain on Thu", btn: "Mark done" },
            { t: "Set yellow sticky traps", d: "10 traps/acre against aphids", btn: "Order kit" },
            { t: "Cover stored grain", d: "Move bags above pallet level", btn: "Got it" },
          ].map((a) => (
            <div key={a.t} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
              <div className="flex-1">
                <p className="font-semibold">{a.t}</p>
                <p className="text-xs text-muted-foreground">{a.d}</p>
              </div>
              <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{a.btn}</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const c = 2 * Math.PI * 28;
  const off = c - (value / 100) * c;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="28" className="fill-none stroke-white/30" strokeWidth="7" />
      <circle cx="40" cy="40" r="28" className="fill-none stroke-white" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 40 40)" />
    </svg>
  );
}
