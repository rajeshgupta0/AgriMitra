import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell, CloudSun, Mic, Camera, TrendingUp, FileText, Sprout, Droplets,
  ArrowRight, ShieldAlert, Activity, Leaf, MessageSquare, Users, IndianRupee,
  AlertTriangle, CheckCircle2, Sparkles, MapPin, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { loadProfile, CROPS } from "@/lib/agri-store";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Home — AgriMitra AI" }] }),
  component: Home,
});

function Home() {
  const p = typeof window !== "undefined" ? loadProfile() : {};
  const firstName = p.name?.split(" ")[0] || "Kisan";
  const userCrops = (p.crops || []).map((id) => CROPS.find((c) => c.id === id)).filter(Boolean);
  const place = [p.village, p.district].filter(Boolean).join(", ") || "Set your village";

  // Demo AI risk score (0-100, lower = safer)
  const riskScore = 32;
  const riskLabel = riskScore < 33 ? "Low risk" : riskScore < 66 ? "Watch out" : "High risk";
  const riskTone = riskScore < 33 ? "success" : riskScore < 66 ? "warning" : "destructive";
  const greeting = greetingFor(new Date().getHours());

  return (
    <div className="animate-fade-up">
      {/* ===== Hero greeting + weather ===== */}
      <header className="gradient-field px-5 pt-6 pb-24 text-primary-foreground rounded-b-4xl">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm opacity-80">{greeting} 🙏</p>
            <h1 className="text-2xl font-extrabold truncate">{firstName}</h1>
            <p className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
              <MapPin className="size-3" /> {place}
            </p>
          </div>
          <button
            className="tap-target relative grid place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-harvest" />
          </button>
        </div>

        <Link
          to="/app/weather"
          className="mt-5 flex items-center justify-between rounded-3xl bg-primary-foreground/10 p-4 backdrop-blur active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3">
            <CloudSun className="size-12" strokeWidth={1.6} />
            <div>
              <p className="text-3xl font-extrabold leading-none">28°</p>
              <p className="mt-1 text-xs opacity-90">Partly cloudy · Rain in 2h</p>
            </div>
          </div>
          <div className="text-right text-[11px] opacity-90 leading-relaxed">
            <p>💧 72%</p>
            <p>🌬 12 km/h</p>
            <p>☀️ UV 5</p>
          </div>
        </Link>
      </header>

      {/* ===== AI Risk score card (floating) ===== */}
      <section className="-mt-16 px-5">
        <div className="rounded-3xl bg-card p-4 shadow-float ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  AI Crop Risk Score
                </p>
                <p className="text-sm font-bold">Today · {place.split(",")[0]}</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${toneBg(riskTone)}`}>
              {riskLabel}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <RiskRing value={riskScore} />
            <ul className="flex-1 space-y-1.5 text-xs">
              <RiskRow icon={<Leaf className="size-3.5 text-success" />} label="Soil moisture" value="Good" />
              <RiskRow icon={<CloudSun className="size-3.5 text-sky" />} label="Weather window" value="Caution" tone="warning" />
              <RiskRow icon={<ShieldAlert className="size-3.5 text-warning" />} label="Pest pressure" value="Low" />
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Voice assistant CTA ===== */}
      <section className="mt-4 px-5">
        <Link
          to="/app/assistant"
          className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border"
        >
          <div className="relative grid size-14 place-items-center rounded-2xl gradient-harvest animate-voice-pulse">
            <Mic className="size-6 text-harvest-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold">Ask AgriMitra anything</p>
            <p className="truncate text-xs text-muted-foreground">
              "Mere tamatar ke patte peele kyun ho rahe hain?"
            </p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground" />
        </Link>
      </section>

      {/* ===== Quick actions ===== */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Quick actions</h2>
        <div className="mt-3 grid grid-cols-5 gap-2">
          <QuickAction to="/app/assistant" icon={Mic} label="Talk" color="bg-primary-soft text-primary" />
          <QuickAction to="/app/assistant" icon={Camera} label="Scan" color="bg-success/15 text-success" />
          <QuickAction to="/app/market" icon={TrendingUp} label="Market" color="bg-harvest/20 text-harvest" />
          <QuickAction to="/app/weather" icon={CloudSun} label="Weather" color="bg-sky/20 text-sky" />
          <QuickAction to="/app/community" icon={MessageSquare} label="Expert" color="bg-accent text-accent-foreground" />
        </div>
      </section>

      {/* ===== Disease alert ===== */}
      <section className="mt-6 px-5">
        <article className="overflow-hidden rounded-3xl ring-1 ring-warning/30 bg-warning/10 p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-warning/25 text-warning">
              <AlertTriangle className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-warning">Disease alert · nearby</p>
              <h3 className="mt-0.5 font-bold text-balance">
                Yellow rust spotted in 3 wheat farms within 5 km
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Inspect your wheat today. Tap to scan a leaf and get a free AI diagnosis.
              </p>
              <Link
                to="/app/assistant"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-warning"
              >
                Scan now <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* ===== Your crops health ===== */}
      {userCrops.length > 0 && (
        <section className="mt-6 px-5">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-bold">Crop health</h2>
            <span className="text-xs text-muted-foreground">Updated now</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {userCrops.slice(0, 4).map((c, i) => (
              <CropHealthCard key={c!.id} emoji={c!.emoji} name={c!.name} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Recommended actions ===== */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Do this today</h2>
        <ol className="mt-3 space-y-2">
          <ActionItem
            n={1}
            title="Hold pesticide spray"
            desc="Rain expected by 3 PM — wash-off risk high."
            tone="warning"
          />
          <ActionItem
            n={2}
            title="Inspect wheat for yellow rust"
            desc="Look under leaves. Tap Scan if you see yellow streaks."
            tone="primary"
          />
          <ActionItem
            n={3}
            title="Irrigate tomato by evening"
            desc="Soil moisture below 35%. ~25 mins drip recommended."
            tone="sky"
          />
        </ol>
      </section>

      {/* ===== Market opportunities ===== */}
      <section className="mt-6 px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">Nearby mandi prices</h2>
          <Link to="/app/market" className="text-xs font-bold text-primary">See all</Link>
        </div>
        <div className="mt-3 space-y-2">
          <MandiRow crop="🧅 Onion" mandi="Lasalgaon" price={2450} delta={+8.2} />
          <MandiRow crop="🌾 Wheat" mandi="Indore" price={2380} delta={+1.4} />
          <MandiRow crop="🍅 Tomato" mandi="Kolar" price={1820} delta={-3.6} />
        </div>
      </section>

      {/* ===== Govt schemes ===== */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold">Schemes you qualify for</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 snap-x">
          <SchemeCard
            tag="PM-KISAN"
            title="₹6,000/year direct income support"
            subtitle="Next installment in 18 days"
            cta="Check status"
          />
          <SchemeCard
            tag="PMFBY"
            title="Crop insurance for Kharif 2026"
            subtitle="Enroll before 31 July"
            cta="Apply now"
          />
          <SchemeCard
            tag="Soil card"
            title="Free soil health card renewal"
            subtitle="Last test: 2 years ago"
            cta="Book test"
          />
        </div>
      </section>

      {/* ===== Community pulse ===== */}
      <section className="mt-6 px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">From the community</h2>
          <Link to="/app/community" className="text-xs font-bold text-primary">Open</Link>
        </div>
        <div className="mt-3 space-y-2">
          <CommunityRow
            who="Dr. Anita · Agronomist"
            when="2h"
            text="Yellow rust outbreak across north MP — scout fields every 3 days."
          />
          <CommunityRow
            who="Ramesh · Lasalgaon"
            when="5h"
            text="Onion fetched ₹2,500 today. Holding for weekend."
          />
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

/* ============ pieces ============ */

function greetingFor(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function toneBg(tone: "success" | "warning" | "destructive") {
  if (tone === "success") return "bg-success/15 text-success";
  if (tone === "warning") return "bg-warning/20 text-warning";
  return "bg-destructive/15 text-destructive";
}

function RiskRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value < 33 ? "var(--success)" : value < 66 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="relative grid size-20 place-items-center">
      <svg viewBox="0 0 64 64" className="size-20 -rotate-90">
        <circle cx="32" cy="32" r={r} stroke="var(--muted)" strokeWidth="7" fill="none" />
        <circle
          cx="32" cy="32" r={r} stroke={color} strokeWidth="7" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-extrabold leading-none">{value}</p>
        <p className="text-[9px] uppercase font-bold text-muted-foreground">risk</p>
      </div>
    </div>
  );
}

function RiskRow({
  icon, label, value, tone = "success",
}: { icon: React.ReactNode; label: string; value: string; tone?: "success" | "warning" }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className={`font-semibold ${tone === "warning" ? "text-warning" : "text-success"}`}>{value}</span>
    </li>
  );
}

function QuickAction({
  to, icon: Icon, label, color,
}: { to: string; icon: typeof Mic; label: string; color: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5">
      <span className={`tap-target grid size-12 place-items-center rounded-2xl ${color}`}>
        <Icon className="size-5" />
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </Link>
  );
}

function CropHealthCard({ emoji, name, index }: { emoji: string; name: string; index: number }) {
  const states = [
    { label: "Healthy", tone: "text-success", bar: "bg-success", pct: 88 },
    { label: "Monitor", tone: "text-warning", bar: "bg-warning", pct: 62 },
    { label: "Healthy", tone: "text-success", bar: "bg-success", pct: 79 },
    { label: "Action", tone: "text-destructive", bar: "bg-destructive", pct: 41 },
  ];
  const s = states[index % states.length];
  return (
    <article className="rounded-2xl bg-card p-3 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{name}</p>
          <p className={`text-[11px] font-bold ${s.tone}`}>{s.label}</p>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        {s.label === "Action" ? "Inspect today" : s.label === "Monitor" ? "Re-check tomorrow" : "Looking great"}
      </p>
    </article>
  );
}

function ActionItem({
  n, title, desc, tone,
}: { n: number; title: string; desc: string; tone: "primary" | "warning" | "sky" }) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    warning: "bg-warning text-warning-foreground",
    sky: "bg-sky text-sky-foreground",
  };
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${tones[tone]}`}>
        {n}
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <CheckCircle2 className="size-5 text-muted-foreground/60" />
    </li>
  );
}

function MandiRow({
  crop, mandi, price, delta,
}: { crop: string; mandi: string; price: number; delta: number }) {
  const up = delta >= 0;
  return (
    <Link
      to="/app/market"
      className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-soft"
    >
      <div>
        <p className="text-sm font-bold">{crop}</p>
        <p className="text-[11px] text-muted-foreground">{mandi} mandi</p>
      </div>
      <div className="text-right">
        <p className="flex items-center justify-end gap-0.5 text-sm font-extrabold">
          <IndianRupee className="size-3.5" />{price.toLocaleString("en-IN")}
          <span className="text-[10px] font-semibold text-muted-foreground">/qtl</span>
        </p>
        <p className={`flex items-center justify-end gap-0.5 text-[11px] font-bold ${up ? "text-success" : "text-destructive"}`}>
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta).toFixed(1)}%
        </p>
      </div>
    </Link>
  );
}

function SchemeCard({
  tag, title, subtitle, cta,
}: { tag: string; title: string; subtitle: string; cta: string }) {
  return (
    <article className="w-64 shrink-0 snap-start rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border">
      <span className="inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
        {tag}
      </span>
      <h3 className="mt-2 font-bold text-balance text-sm leading-snug">{title}</h3>
      <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
        {cta} <ArrowRight className="size-3.5" />
      </button>
    </article>
  );
}

function CommunityRow({ who, when, text }: { who: string; when: string; text: string }) {
  return (
    <article className="rounded-2xl bg-card p-3 shadow-soft">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1 font-semibold">
          <Users className="size-3" /> {who}
        </span>
        <span>{when}</span>
      </div>
      <p className="mt-1 text-sm">{text}</p>
    </article>
  );
}
