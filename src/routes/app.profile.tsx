import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogOut, Languages, Bell, Shield, HelpCircle, Award, MapPin, Edit3, Sparkles } from "lucide-react";
import { loadProfile, clearProfile, CROPS, LANGUAGES } from "@/lib/agri-store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — AgriMitra AI" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const p = typeof window !== "undefined" ? loadProfile() : {};
  const lang = LANGUAGES.find((l) => l.code === p.language);

  const logout = () => {
    clearProfile();
    navigate({ to: "/welcome" });
  };

  return (
    <div className="animate-fade-up">
      <header className="gradient-field rounded-b-4xl px-5 pt-8 pb-16 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-3xl bg-primary-foreground/15 text-3xl font-extrabold backdrop-blur">
            {p.name?.[0]?.toUpperCase() || "K"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-2xl font-extrabold">{p.name || "Farmer"}</h1>
            <p className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="size-3.5" />
              {p.village}, {p.state}
            </p>
            <p className="text-xs opacity-80">+91 {p.mobile}</p>
          </div>
          <button className="tap-target grid place-items-center rounded-full bg-primary-foreground/15 backdrop-blur" aria-label="Edit profile">
            <Edit3 className="size-4" />
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="-mt-10 px-5">
        <div className="grid grid-cols-3 gap-3 rounded-3xl bg-card p-4 shadow-float">
          <Mini value={`${p.landSize || 0}`} label={p.landUnit || "acre"} />
          <Mini value={`${p.crops?.length || 0}`} label="Crops" />
          <Mini value="4.8" label="Trust ★" />
        </div>
      </section>

      {/* Crops */}
      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">My crops</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(p.crops || []).map((id) => {
            const c = CROPS.find((x) => x.id === id);
            return c ? (
              <span key={id} className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-soft">
                <span>{c.emoji}</span> {c.name}
              </span>
            ) : null;
          })}
        </div>
      </section>

      {/* Pro Tools launcher */}
      <section className="mt-6 px-5">
        <Link
          to="/app/more"
          className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-float"
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Sparkles className="size-6" />
          </div>
          <div className="flex-1">
            <p className="text-base font-extrabold leading-tight">Pro Tools</p>
            <p className="text-xs opacity-90">Digital Twin · Risk Engine · Planner · Analytics · Knowledge · Learn</p>
          </div>
          <ChevronRight className="size-5" />
        </Link>
      </section>

      {/* Settings */}
      <section className="mt-6 px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Settings</h2>
        <div className="mt-2 overflow-hidden rounded-3xl bg-card shadow-soft">
          <Row icon={Languages} label="Language" value={lang?.name || "Hindi"} />
          <Row icon={Bell} label="Notifications" value="On" />
          <Row icon={Award} label="Schemes & subsidies" value="3 eligible" />
          <Row icon={Shield} label="Privacy & data" />
          <Row icon={HelpCircle} label="Help & support" />
        </div>
      </section>

      <section className="mt-6 px-5">
        <button
          onClick={logout}
          className="tap-target flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 font-semibold text-destructive"
        >
          <LogOut className="size-4" /> Log out
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          AgriMitra AI · v1.0 · Made with 🌾 for Bharat
        </p>
      </section>
    </div>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Languages; label: string; value?: string }) {
  return (
    <button className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0 hover:bg-muted/40">
      <Icon className="size-5 text-primary" />
      <span className="flex-1 font-semibold">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
