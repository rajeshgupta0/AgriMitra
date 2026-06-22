import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, GraduationCap, Megaphone, HeartHandshake, Send } from "lucide-react";

export const Route = createFileRoute("/ngo")({
  head: () => ({ meta: [{ title: "NGO / FPO — AgriMitra AI" }] }),
  component: NGO,
});

function NGO() {
  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/app/more" className="tap-target inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <ArrowLeft className="size-4" /> Exit
          </Link>
          <div>
            <p className="text-sm font-bold leading-none">Sahyadri FPO · Workspace</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">NGO / FPO Console</p>
          </div>
          <div className="ml-auto grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">FP</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Farmers reached", v: "8,420", i: Users },
            { l: "Villages covered", v: "64", i: HeartHandshake },
            { l: "Trainings done", v: "142", i: GraduationCap },
            { l: "Adoption rate", v: "71%", i: Megaphone },
          ].map((k) => {
            const Icon = k.i;
            return (
              <div key={k.l} className="rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.l}<Icon className="size-4" /></div>
                <p className="mt-2 text-2xl font-bold">{k.v}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Farmer groups</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[["Wagholi Wheat", 142], ["Shirur Cotton", 218], ["Junnar Pulses", 96]].map(([g, n]) => (
                <li key={g as string} className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <span className="font-semibold">{g}</span><span className="text-xs text-muted-foreground">{n} farmers</span>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full rounded-xl border-2 border-dashed py-2 text-xs font-bold text-muted-foreground">+ Create new group</button>
          </div>

          <div className="rounded-2xl border bg-background p-5 md:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-wider">Upcoming programs</h2>
            <ul className="mt-3 divide-y text-sm">
              {[
                ["Soil testing camp · Wagholi", "Nov 24 · 09:00", "42 registered"],
                ["IPM workshop · Shirur", "Nov 28 · 11:00", "78 registered"],
                ["Drip subsidy clinic · Junnar", "Dec 02 · 10:30", "61 registered"],
              ].map(([t, when, reg]) => (
                <li key={t} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="font-semibold">{t}</span>
                  <span className="text-xs text-muted-foreground">{when} · {reg}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Broadcast</h2>
            <textarea rows={4} className="mt-3 w-full resize-none rounded-xl border bg-background p-3 text-sm" placeholder="Voice or text broadcast…" defaultValue="Free soil-testing camp this Sunday at Wagholi school, 9 AM." />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Voice + SMS + In-app to 3 groups</span>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><Send className="size-3.5" /> Send</button>
            </div>
          </div>
          <div className="rounded-2xl border bg-background p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Impact this quarter</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[["Avg yield uplift", "+14%"], ["Cost reduction", "₹3,420/acre"], ["Water saved", "1.8M L"], ["Insurance enrolled", "612 farmers"]].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between"><span>{k}</span><span className="font-bold">{v}</span></li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
