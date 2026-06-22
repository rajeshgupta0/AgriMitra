import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, CloudSun, CloudRain, Cloud, Sun, Wind, Droplets, Sunrise, Sunset,
  AlertTriangle, Sprout,
} from "lucide-react";
import { loadProfile } from "@/lib/agri-store";

export const Route = createFileRoute("/app/weather")({
  head: () => ({ meta: [{ title: "Weather — AgriMitra AI" }] }),
  component: WeatherCenter,
});

const HOURLY = [
  { t: "Now", temp: 28, icon: CloudSun, rain: 10 },
  { t: "1 PM", temp: 30, icon: Sun, rain: 0 },
  { t: "2 PM", temp: 31, icon: Sun, rain: 5 },
  { t: "3 PM", temp: 29, icon: CloudRain, rain: 70 },
  { t: "4 PM", temp: 27, icon: CloudRain, rain: 85 },
  { t: "5 PM", temp: 26, icon: Cloud, rain: 40 },
  { t: "6 PM", temp: 25, icon: Cloud, rain: 20 },
];

const DAILY = [
  { d: "Today", hi: 31, lo: 24, icon: CloudRain, rain: 80, label: "Rain" },
  { d: "Tue", hi: 30, lo: 23, icon: CloudSun, rain: 30, label: "Mixed" },
  { d: "Wed", hi: 32, lo: 24, icon: Sun, rain: 5, label: "Sunny" },
  { d: "Thu", hi: 33, lo: 25, icon: Sun, rain: 10, label: "Sunny" },
  { d: "Fri", hi: 31, lo: 24, icon: CloudSun, rain: 25, label: "Partly cloudy" },
  { d: "Sat", hi: 29, lo: 23, icon: CloudRain, rain: 60, label: "Showers" },
  { d: "Sun", hi: 28, lo: 22, icon: CloudRain, rain: 75, label: "Rain" },
];

function WeatherCenter() {
  const p = typeof window !== "undefined" ? loadProfile() : {};
  const place = [p.village, p.district, p.state].filter(Boolean).join(", ") || "Your farm";

  return (
    <div className="animate-fade-up">
      <header className="gradient-field text-primary-foreground px-5 pt-6 pb-20 rounded-b-4xl">
        <div className="flex items-center gap-3">
          <Link to="/app" className="tap-target grid place-items-center rounded-2xl bg-primary-foreground/15">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs opacity-80">Weather · hyperlocal</p>
            <h1 className="text-lg font-extrabold truncate">{place}</h1>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-6xl font-extrabold leading-none">28°</p>
            <p className="mt-1 text-sm opacity-90">Partly cloudy · feels 30°</p>
          </div>
          <CloudSun className="size-24 opacity-90" strokeWidth={1.4} />
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px]">
          <Stat icon={<Droplets className="size-4" />} v="72%" l="Humidity" />
          <Stat icon={<Wind className="size-4" />} v="12 km/h" l="Wind" />
          <Stat icon={<Sunrise className="size-4" />} v="5:48" l="Sunrise" />
          <Stat icon={<Sunset className="size-4" />} v="7:02" l="Sunset" />
        </div>
      </header>

      {/* Alerts */}
      <section className="-mt-12 px-5">
        <article className="rounded-3xl bg-card p-4 shadow-float ring-1 ring-warning/30">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-warning/20 text-warning">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-warning">Rain alert</p>
              <h3 className="font-bold">Heavy rain 3–5 PM today</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                ~22 mm expected. Postpone spraying, harvesting and irrigation today.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Hourly */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Next hours</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
          {HOURLY.map((h) => (
            <div key={h.t} className="flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl bg-card p-3 shadow-soft">
              <span className="text-[10px] font-bold text-muted-foreground">{h.t}</span>
              <h.icon className="size-5 text-primary" />
              <span className="text-sm font-extrabold">{h.temp}°</span>
              <span className="text-[10px] text-sky">{h.rain}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Daily */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">7-day forecast</h2>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft">
          {DAILY.map((d) => (
            <div key={d.d} className="flex items-center gap-3 p-3">
              <span className="w-12 text-sm font-bold">{d.d}</span>
              <d.icon className="size-5 text-primary" />
              <span className="flex-1 text-xs text-muted-foreground">{d.label} · {d.rain}%</span>
              <span className="text-sm font-bold">{d.hi}°<span className="text-muted-foreground"> / {d.lo}°</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Farm advisory */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Farm advisory</h2>
        <div className="mt-3 space-y-2">
          <Advisory icon={<Sprout className="size-4 text-success" />} title="Sowing window" body="Hold sowing till Thursday — heavy rain will wash out seeds." />
          <Advisory icon={<Droplets className="size-4 text-sky" />} title="Irrigation" body="Skip irrigation today and tomorrow." />
          <Advisory icon={<AlertTriangle className="size-4 text-warning" />} title="Spraying" body="No spraying till Wednesday morning." />
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function Stat({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <div className="rounded-2xl bg-primary-foreground/10 p-2 backdrop-blur">
      <div className="flex justify-center opacity-90">{icon}</div>
      <p className="mt-1 text-sm font-bold">{v}</p>
      <p className="opacity-80">{l}</p>
    </div>
  );
}

function Advisory({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-muted">{icon}</span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </article>
  );
}
