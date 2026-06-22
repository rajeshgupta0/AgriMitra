import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, Brain, Calendar, GraduationCap, LineChart, Library,
  ShieldAlert, Sparkles, Tractor, Trophy, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/app/more")({
  head: () => ({ meta: [{ title: "Pro Tools — AgriMitra AI" }] }),
  component: More,
});

const TOOLS = [
  { to: "/app/twin", label: "Digital Twin", desc: "Your farm's AI replica", icon: Brain, tint: "from-emerald-500 to-teal-600" },
  { to: "/app/risk", label: "Risk Engine", desc: "Predict before it happens", icon: ShieldAlert, tint: "from-rose-500 to-orange-500" },
  { to: "/app/planner", label: "Smart Planner", desc: "Yield • Sowing • Harvest", icon: Calendar, tint: "from-sky-500 to-indigo-600" },
  { to: "/app/analytics", label: "Farm Analytics", desc: "BI for your farm", icon: LineChart, tint: "from-violet-500 to-fuchsia-600" },
  { to: "/app/knowledge", label: "Knowledge Hub", desc: "Videos • Audio • Guides", icon: Library, tint: "from-amber-500 to-orange-600" },
  { to: "/app/learn", label: "Learn & Earn", desc: "Badges • Streaks • XP", icon: Trophy, tint: "from-lime-500 to-emerald-600" },
] as const;

const PORTALS = [
  { to: "/officer", label: "District Officer Portal", desc: "Govt intelligence dashboard", icon: Activity },
  { to: "/ngo", label: "NGO / FPO Workspace", desc: "Farmer groups & impact", icon: Tractor },
  { to: "/admin", label: "Super Admin Console", desc: "Platform-wide control", icon: GraduationCap },
] as const;

function More() {
  return (
    <div className="animate-fade-up">
      <header className="px-5 pt-8 pb-4">
        <Link to="/app/profile" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Pro Tools</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Sparkles className="size-3.5 text-primary" /> AI modules tailored to your farm
        </p>
      </header>

      <section className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${t.tint} p-4 text-white shadow-float`}
              >
                <Icon className="size-7 opacity-90" strokeWidth={2.2} />
                <p className="mt-6 text-base font-extrabold leading-tight">{t.label}</p>
                <p className="text-[11px] font-medium opacity-85">{t.desc}</p>
                <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stakeholder portals</h2>
        <div className="mt-2 space-y-2">
          {PORTALS.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.to} to={p.to} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          For demonstration • Role-based access enforced in production
        </p>
      </section>
    </div>
  );
}
