import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, CloudRain, Droplet, MapPin, Megaphone, Send, Users } from "lucide-react";

export const Route = createFileRoute("/officer")({
  head: () => ({ meta: [{ title: "District Officer — AgriMitra AI" }] }),
  component: Officer,
});

const VILLAGES = [
  { name: "Wagholi", farmers: 1240, risk: 72 },
  { name: "Lohegaon", farmers: 980, risk: 58 },
  { name: "Khed", farmers: 1450, risk: 41 },
  { name: "Shirur", farmers: 1820, risk: 84 },
  { name: "Junnar", farmers: 1100, risk: 33 },
  { name: "Manchar", farmers: 760, risk: 64 },
];

function Officer() {
  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/app/more" className="tap-target inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <ArrowLeft className="size-4" /> Exit
          </Link>
          <div>
            <p className="text-sm font-bold leading-none">District Agriculture Officer · Pune</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Govt Intelligence Console</p>
          </div>
          <div className="ml-auto grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">DO</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Farmers tracked", v: "7,350", i: Users },
            { l: "Villages", v: "126", i: MapPin },
            { l: "Active alerts", v: "14", i: AlertTriangle },
            { l: "Rainfall (7d)", v: "42 mm", i: CloudRain },
          ].map((k) => {
            const Icon = k.i;
            return (
              <div key={k.l} className="rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {k.l}<Icon className="size-4" />
                </div>
                <p className="mt-2 text-2xl font-bold">{k.v}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider">Village risk heatmap</h2>
              <span className="text-xs text-muted-foreground">Updated 12 min ago</span>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {Array.from({ length: 49 }, (_, i) => {
                const v = (Math.sin(i / 2) * 50 + 50 + i) % 100;
                return <div key={i} className="aspect-square rounded" style={{ background: `hsl(${(1 - v / 100) * 120}, 80%, ${78 - v / 5}%)` }} />;
              })}
            </div>
          </div>
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Disease hotspots</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["Shirur — Yellow rust", "84"],
                ["Wagholi — Aphids", "72"],
                ["Manchar — Blast", "64"],
              ].map(([t, v]) => (
                <li key={t} className="flex items-center justify-between"><span>{t}</span><span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-bold text-rose-700">{v}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Village data</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Village</th><th>Farmers</th><th>Risk score</th><th>Status</th></tr>
              </thead>
              <tbody>
                {VILLAGES.map((v) => (
                  <tr key={v.name} className="border-t">
                    <td className="py-2.5 font-semibold">{v.name}</td>
                    <td>{v.farmers.toLocaleString("en-IN")}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${v.risk > 70 ? "bg-rose-500" : v.risk > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${v.risk}%` }} />
                        </div>
                        <span className="text-xs font-bold">{v.risk}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${v.risk > 70 ? "bg-rose-500/15 text-rose-700" : v.risk > 50 ? "bg-amber-500/15 text-amber-700" : "bg-emerald-500/15 text-emerald-700"}`}>
                        {v.risk > 70 ? "Critical" : v.risk > 50 ? "Watch" : "Stable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Publish advisory</h2>
            <textarea rows={4} className="mt-3 w-full resize-none rounded-xl border bg-background p-3 text-sm" placeholder="Write advisory to all wheat farmers in Pune…" defaultValue="Heavy rain forecast Thu evening. Defer urea top-dressing by 72 hours." />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Will reach ~12,400 farmers · Voice + SMS + In-app</span>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><Send className="size-3.5" /> Publish</button>
            </div>
          </div>
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Quick actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {[
                ["Emergency alert", Megaphone],
                ["Launch campaign", Megaphone],
                ["Water stress map", Droplet],
                ["Weekly report", AlertTriangle],
              ].map(([t, I]: any) => (
                <button key={t} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-left hover:bg-muted">
                  <I className="size-4 text-primary" /> {t}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
