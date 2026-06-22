import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, Lock, Star, Trophy, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/learn")({
  head: () => ({ meta: [{ title: "Learn & Earn — AgriMitra AI" }] }),
  component: Learn,
});

const BADGES = [
  { name: "Scanner Pro", desc: "10 disease scans", got: true, emoji: "🔬" },
  { name: "Weather Watcher", desc: "7-day streak", got: true, emoji: "🌦️" },
  { name: "Market Maven", desc: "Check 5 mandis", got: true, emoji: "📈" },
  { name: "Scheme Master", desc: "Apply 3 schemes", got: false, emoji: "🏛️" },
  { name: "Community Voice", desc: "10 posts", got: false, emoji: "💬" },
  { name: "Water Wizard", desc: "Save 20% water", got: false, emoji: "💧" },
];

const LESSONS = [
  { name: "Soil 101", lvl: 1, done: true },
  { name: "Crop Rotation", lvl: 1, done: true },
  { name: "IPM Basics", lvl: 2, done: true },
  { name: "Drip Irrigation", lvl: 2, done: false, current: true },
  { name: "Market Reading", lvl: 3, done: false },
  { name: "Climate Smart Farming", lvl: 4, done: false, locked: true },
];

function Learn() {
  return (
    <div className="animate-fade-up pb-8">
      <header className="gradient-field rounded-b-4xl px-5 pt-8 pb-10 text-primary-foreground">
        <Link to="/app/more" className="tap-target -ml-2 inline-flex items-center gap-1 text-sm font-semibold opacity-90">
          <ArrowLeft className="size-4" /> Pro Tools
        </Link>
        <div className="mt-2 flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-3xl bg-primary-foreground/15 text-4xl backdrop-blur">🌱</div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Level 7 · Sprout</p>
            <p className="text-2xl font-extrabold">1,248 XP</p>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20">
              <div className="h-full w-[68%] rounded-full bg-primary-foreground" />
            </div>
            <p className="mt-1 text-[11px] opacity-90">252 XP to Level 8 · Seedling</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-around rounded-2xl bg-primary-foreground/10 p-3 backdrop-blur">
          <Stat icon={Flame} value="12" label="Day streak" />
          <div className="h-8 w-px bg-primary-foreground/20" />
          <Stat icon={Trophy} value="3/6" label="Badges" />
          <div className="h-8 w-px bg-primary-foreground/20" />
          <Stat icon={Star} value="4.8" label="Trust" />
        </div>
      </header>

      <section className="-mt-6 px-5">
        <div className="rounded-3xl bg-card p-4 shadow-float">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Daily quest</p>
          <p className="mt-1 font-bold">Watch "Yellow rust early detection"</p>
          <p className="text-xs text-muted-foreground">+50 XP · Resets in 8h 22m</p>
          <button className="mt-3 w-full rounded-2xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">Start quest</button>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Learning path</h2>
        <ol className="mt-3 space-y-2">
          {LESSONS.map((l, i) => (
            <li
              key={l.name}
              className={`flex items-center gap-3 rounded-2xl p-3 shadow-soft ${
                l.current ? "border border-primary bg-primary/5" : "bg-card"
              } ${l.locked ? "opacity-50" : ""}`}
            >
              <div className={`grid size-10 place-items-center rounded-full ${l.done ? "bg-emerald-500 text-white" : l.locked ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                {l.done ? <CheckCircle2 className="size-5" /> : l.locked ? <Lock className="size-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{l.name}</p>
                <p className="text-xs text-muted-foreground">Lesson {i + 1} · Level {l.lvl}</p>
              </div>
              {l.current && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground">Continue</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Badges</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {BADGES.map((b) => (
            <div key={b.name} className={`rounded-2xl bg-card p-3 text-center shadow-soft ${b.got ? "" : "opacity-40 grayscale"}`}>
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-amber-500 text-2xl">{b.emoji}</div>
              <p className="mt-2 text-[12px] font-bold leading-tight">{b.name}</p>
              <p className="text-[10px] text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 p-5 text-white shadow-float">
          <p className="text-xs font-bold uppercase tracking-wider opacity-90">Weekly leaderboard</p>
          <p className="mt-1 text-lg font-extrabold">You're #4 in your village</p>
          <p className="text-xs opacity-90">240 XP to overtake Suresh K. → Top 3 unlocks "Village Champion" badge</p>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="size-4 opacity-90" />
      <p className="mt-1 text-lg font-extrabold leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}
