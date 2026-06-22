import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, IndianRupee, ArrowUpRight, ArrowDownRight, Search, TrendingUp, Sparkles,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/market")({
  head: () => ({ meta: [{ title: "Market — AgriMitra AI" }] }),
  component: MarketIntel,
});

type Row = { crop: string; emoji: string; mandi: string; price: number; delta: number; tip: string };

const MARKET: Row[] = [
  { crop: "Onion", emoji: "🧅", mandi: "Lasalgaon", price: 2450, delta: 8.2, tip: "Hold 3–4 days" },
  { crop: "Wheat", emoji: "🌾", mandi: "Indore", price: 2380, delta: 1.4, tip: "Sell now" },
  { crop: "Tomato", emoji: "🍅", mandi: "Kolar", price: 1820, delta: -3.6, tip: "Wait" },
  { crop: "Soybean", emoji: "🫘", mandi: "Latur", price: 4720, delta: 2.1, tip: "Sell now" },
  { crop: "Cotton", emoji: "🧶", mandi: "Rajkot", price: 7250, delta: 0.4, tip: "Hold" },
  { crop: "Potato", emoji: "🥔", mandi: "Agra", price: 1240, delta: -1.8, tip: "Wait" },
  { crop: "Maize", emoji: "🌽", mandi: "Davangere", price: 2090, delta: 3.2, tip: "Sell now" },
  { crop: "Chilli", emoji: "🌶️", mandi: "Guntur", price: 16200, delta: 5.6, tip: "Sell now" },
];

function MarketIntel() {
  const [q, setQ] = useState("");
  const rows = MARKET.filter(
    (r) => r.crop.toLowerCase().includes(q.toLowerCase()) || r.mandi.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="animate-fade-up">
      <header className="gradient-harvest text-harvest-foreground px-5 pt-6 pb-16 rounded-b-4xl">
        <div className="flex items-center gap-3">
          <Link to="/app" className="tap-target grid place-items-center rounded-2xl bg-harvest-foreground/15">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <p className="text-xs opacity-80">Mandi intelligence</p>
            <h1 className="text-lg font-extrabold">Today's prices</h1>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
          <Kpi v="₹2,450" l="Top mover" sub="Onion +8.2%" />
          <Kpi v="86" l="Mandis tracked" sub="across 12 states" />
          <Kpi v="3" l="Sell signals" sub="for your crops" />
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-harvest-foreground/15 px-3 py-2 backdrop-blur">
          <Search className="size-4 opacity-80" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search crop or mandi"
            className="w-full bg-transparent text-sm placeholder:text-harvest-foreground/60 focus:outline-none"
          />
        </label>
      </header>

      {/* AI tip */}
      <section className="-mt-10 px-5">
        <article className="rounded-3xl bg-card p-4 shadow-float ring-1 ring-border">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary">AI market tip</p>
              <p className="mt-0.5 text-sm font-bold">Onion likely to peak by Friday at ~₹2,650/qtl.</p>
              <p className="text-xs text-muted-foreground">Based on arrivals trend in Lasalgaon and weather pattern.</p>
            </div>
          </div>
        </article>
      </section>

      {/* List */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Live prices</h2>
        <div className="mt-3 space-y-2">
          {rows.map((r) => <MarketCard key={r.crop} {...r} />)}
          {rows.length === 0 && (
            <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
              No matches. Try another crop or mandi.
            </p>
          )}
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function Kpi({ v, l, sub }: { v: string; l: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-harvest-foreground/15 p-3 backdrop-blur">
      <p className="text-base font-extrabold leading-tight">{v}</p>
      <p className="text-[10px] uppercase font-bold opacity-80">{l}</p>
      <p className="mt-0.5 text-[10px] opacity-80">{sub}</p>
    </div>
  );
}

function MarketCard({ crop, emoji, mandi, price, delta, tip }: Row) {
  const up = delta >= 0;
  const tipTone =
    tip === "Sell now" ? "bg-success/15 text-success"
      : tip === "Wait" ? "bg-destructive/15 text-destructive"
      : "bg-warning/20 text-warning";
  return (
    <article className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{crop}</p>
        <p className="text-[11px] text-muted-foreground truncate">{mandi} mandi · /qtl</p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${tipTone}`}>
          {tip}
        </span>
      </div>
      <div className="text-right">
        <p className="flex items-center justify-end text-base font-extrabold">
          <IndianRupee className="size-4" />{price.toLocaleString("en-IN")}
        </p>
        <p className={`flex items-center justify-end gap-0.5 text-xs font-bold ${up ? "text-success" : "text-destructive"}`}>
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta).toFixed(1)}%
        </p>
        <TrendingUp className={`mt-0.5 ml-auto size-3 ${up ? "text-success" : "text-destructive rotate-180"}`} />
      </div>
    </article>
  );
}
