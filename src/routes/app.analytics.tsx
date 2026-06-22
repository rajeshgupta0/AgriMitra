import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LineChart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Farm Analytics — AgriMitra AI" }] }),
  component: Analytics,
});

const KPIS = [
  { label: "Yield (q)", value: "19.6", delta: "+12%", up: true },
  { label: "Revenue", value: "₹44.1k", delta: "+18%", up: true },
  { label: "Water (kL)", value: "82", delta: "-9%", up: true },
  { label: "Disease events", value: "3", delta: "-2", up: true },
];

const SERIES = [12, 15, 14, 18, 22, 19, 24, 28, 26, 30, 33, 36];
const REV = [22, 24, 28, 26, 32, 35, 30, 38, 40, 42, 44, 44];

function Analytics() {
  return (
    <div className="animate-fade-up pb-8">
      <header className="px-5 pt-8 pb-3">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <LineChart className="size-5 text-primary" />
          <h1 className="text-2xl font-extrabold">Farm Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">Business intelligence for your farm.</p>
      </header>

      <section className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{k.value}</p>
              <p className={`text-xs font-semibold ${k.up ? "text-emerald-600" : "text-rose-600"}`}>{k.delta} vs last season</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <ChartCard title="Yield trend (q/acre)" series={SERIES} color="emerald" />
      </section>
      <section className="mt-3 px-5">
        <ChartCard title="Revenue trend (₹k)" series={REV} color="amber" />
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Crop success rate</h2>
        <div className="mt-2 space-y-2">
          {[["Wheat", 92], ["Soybean", 74], ["Cotton", 58]].map(([c, v]) => (
            <div key={c as string} className="rounded-2xl bg-card p-3 shadow-soft">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{c}</span><span className="font-bold">{v}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Disease occurrences (12 mo)</h2>
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-soft">
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 * 4 }, (_, i) => {
              const v = (Math.sin(i / 3) * 50 + 50) | 0;
              return (
                <div key={i} className="aspect-square rounded" style={{ background: `hsl(${(1 - v / 100) * 120}, 80%, ${78 - v / 5}%)` }} />
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI observations</h2>
        <div className="mt-2 space-y-2">
          {[
            "Your wheat farm has shown a 12% increase in productivity vs last season.",
            "Water efficiency improved 9% — drip on plot A is paying off.",
            "Disease events down by 2 — early scanning is working.",
            "Switch one acre to chickpea next Rabi to boost nitrogen and net ₹6,200 more.",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 rounded-2xl bg-primary/5 p-3">
              <Sparkles className="mt-0.5 size-4 text-primary" />
              <p className="text-sm">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChartCard({ title, series, color }: { title: string; series: number[]; color: "emerald" | "amber" }) {
  const max = Math.max(...series);
  const points = series.map((v, i) => `${(i / (series.length - 1)) * 100},${100 - (v / max) * 90}`).join(" ");
  const stroke = color === "emerald" ? "stroke-emerald-500" : "stroke-amber-500";
  const fill = color === "emerald" ? "fill-emerald-500/15" : "fill-amber-500/15";
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <svg viewBox="0 0 100 100" className="mt-2 h-32 w-full" preserveAspectRatio="none">
        <polygon points={`0,100 ${points} 100,100`} className={fill} />
        <polyline fill="none" points={points} className={stroke} strokeWidth="1.5" />
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
      </div>
    </div>
  );
}
