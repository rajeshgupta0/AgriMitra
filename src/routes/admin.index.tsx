import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Brain, CheckCircle2, Database, Server, TrendingUp, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: ExecDashboard,
});

const KPIS = [
  { label: "Total farmers", value: "1,28,492", delta: "+4.2%", icon: Users },
  { label: "Active (30d)", value: "84,217", delta: "+6.1%", icon: TrendingUp },
  { label: "AI requests / day", value: "412k", delta: "+18%", icon: Brain },
  { label: "Disease reports", value: "1,842", delta: "+3.4%", icon: AlertTriangle },
];

const ROLES = [
  ["Farmers", "1,28,492"],
  ["Agriculture Experts", "342"],
  ["District Officers", "78"],
  ["NGO / FPO", "126"],
  ["Admins", "14"],
  ["Super Admins", "3"],
];

function ExecDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Executive dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide health and growth at a glance.</p>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">{k.value}</p>
              <p className="text-xs font-medium text-emerald-600">{k.delta} vs last period</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">User growth · 12 weeks</h2>
            <span className="text-xs text-muted-foreground">+14.8k this week</span>
          </div>
          <Spark />
        </div>
        <div className="rounded-2xl border bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Platform health</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <HealthRow icon={Server} label="API gateway" status="ok" detail="99.98% · 142ms p95" />
            <HealthRow icon={Database} label="Postgres" status="ok" detail="6 nodes · 41% CPU" />
            <HealthRow icon={Brain} label="AI Gateway" status="warn" detail="Whisper queue depth ↑" />
            <HealthRow icon={Zap} label="Edge cache" status="ok" detail="92.4% hit rate" />
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider">Roles & access</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {ROLES.map(([role, n]) => (
            <div key={role} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
              <span>{role}</span><span className="font-bold">{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Recent admin actions</h2>
          <ul className="mt-3 divide-y text-sm">
            {[
              ["Suspended user f-21804 — abuse flag", "12m ago"],
              ["Granted District Officer to o-44", "1h ago"],
              ["Published scheme: PM-AASHA refresh", "3h ago"],
              ["Rotated SUPABASE_SERVICE_KEY", "Yesterday"],
            ].map(([t, time]) => (
              <li key={t} className="flex items-center justify-between py-2.5">
                <span>{t}</span><span className="text-xs text-muted-foreground">{time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Security center</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between"><span>Failed logins (24h)</span><span className="font-bold">218</span></li>
            <li className="flex items-center justify-between"><span>RLS denials</span><span className="font-bold">12</span></li>
            <li className="flex items-center justify-between"><span>Open security findings</span><span className="font-bold text-amber-600">2 medium</span></li>
            <li className="flex items-center justify-between"><span>Last pentest</span><span className="font-bold">2026-05-12</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function HealthRow({ icon: Icon, label, status, detail }: any) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1 font-semibold">{label}</span>
      <span className={`flex items-center gap-1 text-xs ${status === "ok" ? "text-emerald-600" : "text-amber-600"}`}>
        {status === "ok" ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />} {detail}
      </span>
    </li>
  );
}

function Spark() {
  const pts = [10, 18, 22, 30, 26, 36, 42, 48, 52, 60, 66, 78];
  const max = Math.max(...pts);
  const path = pts.map((v, i) => `${(i / (pts.length - 1)) * 100},${100 - (v / max) * 85}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="mt-3 h-40 w-full" preserveAspectRatio="none">
      <polygon points={`0,100 ${path} 100,100`} className="fill-primary/15" />
      <polyline fill="none" points={path} className="stroke-primary" strokeWidth="1.5" />
    </svg>
  );
}
