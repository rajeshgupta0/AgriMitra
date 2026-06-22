import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, User, Sprout, Droplets, PartyPopper } from "lucide-react";
import { CROPS, IRRIGATION, STATES, saveProfile, loadProfile, type FarmerProfile } from "@/lib/agri-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create profile — AgriMitra AI" }] }),
  component: Register,
});

const STEPS = ["You", "Farm", "Crops", "Water", "Done"] as const;

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FarmerProfile>(() => loadProfile());

  const update = (patch: Partial<FarmerProfile>) => setData((d) => ({ ...d, ...patch }));

  const canNext = (() => {
    if (step === 0) return !!data.name && data.name.trim().length >= 2;
    if (step === 1) return !!data.state && !!data.district && !!data.village && !!data.landSize;
    if (step === 2) return (data.crops?.length ?? 0) > 0;
    if (step === 3) return !!data.irrigation;
    return true;
  })();

  const next = () => {
    saveProfile(data);
    if (step < 4) setStep(step + 1);
  };

  const finish = () => {
    saveProfile({ ...data, onboarded: true });
    navigate({ to: "/app" });
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-3 px-4 pt-5">
        <button
          onClick={() => (step === 0 ? navigate({ to: "/otp" }) : setStep(step - 1))}
          className="tap-target grid place-items-center rounded-full hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      <section className="flex flex-1 flex-col px-5 pt-6 pb-28">
        {step === 0 && <StepYou data={data} update={update} />}
        {step === 1 && <StepFarm data={data} update={update} />}
        {step === 2 && <StepCrops data={data} update={update} />}
        {step === 3 && <StepWater data={data} update={update} />}
        {step === 4 && <StepDone data={data} />}
      </section>

      <footer className="safe-bottom fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-5 pt-4 backdrop-blur">
        {step < 4 ? (
          <Button
            onClick={next}
            disabled={!canNext}
            size="lg"
            className="tap-target w-full rounded-full gradient-field text-base font-semibold shadow-float"
          >
            Continue <ArrowRight className="size-5" />
          </Button>
        ) : (
          <Button
            onClick={finish}
            size="lg"
            className="tap-target w-full rounded-full gradient-field text-base font-semibold shadow-float"
          >
            Enter AgriMitra <ArrowRight className="size-5" />
          </Button>
        )}
      </footer>
    </main>
  );
}

function StepHeader({ icon: Icon, title, sub }: { icon: typeof User; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary-soft">
        <Icon className="size-6 text-primary" />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-balance">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border-2 border-input bg-card px-4 py-3 text-base font-medium outline-none transition focus:border-primary placeholder:text-muted-foreground/60";

function StepYou({ data, update }: { data: FarmerProfile; update: (p: Partial<FarmerProfile>) => void }) {
  return (
    <>
      <StepHeader icon={User} title="Tell us about you" sub="So we can personalize your advice" />
      <div className="space-y-4">
        <Field label="Full name">
          <input
            className={inputClass}
            value={data.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            autoFocus
          />
        </Field>
        <Field label="Mobile number">
          <input className={inputClass} value={`+91 ${data.mobile || ""}`} disabled />
        </Field>
      </div>
    </>
  );
}

function StepFarm({ data, update }: { data: FarmerProfile; update: (p: Partial<FarmerProfile>) => void }) {
  return (
    <>
      <StepHeader icon={MapPin} title="Where is your farm?" sub="We use this for hyperlocal weather and mandi prices" />
      <div className="space-y-4">
        <Field label="State">
          <select
            className={inputClass}
            value={data.state || ""}
            onChange={(e) => update({ state: e.target.value })}
          >
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="District">
            <input
              className={inputClass}
              value={data.district || ""}
              onChange={(e) => update({ district: e.target.value })}
              placeholder="District"
            />
          </Field>
          <Field label="Village">
            <input
              className={inputClass}
              value={data.village || ""}
              onChange={(e) => update({ village: e.target.value })}
              placeholder="Village"
            />
          </Field>
        </div>
        <Field label="Land size">
          <div className="flex gap-2">
            <input
              className={inputClass}
              inputMode="decimal"
              value={data.landSize || ""}
              onChange={(e) => update({ landSize: e.target.value.replace(/[^0-9.]/g, "") })}
              placeholder="e.g. 2.5"
            />
            <select
              className={inputClass + " w-32"}
              value={data.landUnit || "acre"}
              onChange={(e) => update({ landUnit: e.target.value as FarmerProfile["landUnit"] })}
            >
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
              <option value="bigha">Bigha</option>
            </select>
          </div>
        </Field>
      </div>
    </>
  );
}

function StepCrops({ data, update }: { data: FarmerProfile; update: (p: Partial<FarmerProfile>) => void }) {
  const toggle = (id: string) => {
    const cur = new Set(data.crops || []);
    cur.has(id) ? cur.delete(id) : cur.add(id);
    update({ crops: Array.from(cur) });
  };
  return (
    <>
      <StepHeader icon={Sprout} title="What do you grow?" sub="Choose all that apply" />
      <div className="grid grid-cols-3 gap-2.5">
        {CROPS.map((c) => {
          const active = data.crops?.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 transition ${
                active ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-xs font-semibold">{c.name}</span>
              {active && (
                <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepWater({ data, update }: { data: FarmerProfile; update: (p: Partial<FarmerProfile>) => void }) {
  return (
    <>
      <StepHeader icon={Droplets} title="Irrigation type" sub="How do you water your fields?" />
      <div className="grid grid-cols-2 gap-3">
        {IRRIGATION.map((i) => {
          const active = data.irrigation === i.id;
          return (
            <button
              key={i.id}
              onClick={() => update({ irrigation: i.id })}
              className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition ${
                active ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{i.emoji}</span>
              <span className="font-bold">{i.name}</span>
              <span className="text-xs text-muted-foreground">{i.desc}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepDone({ data }: { data: FarmerProfile }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-up">
      <div className="grid size-24 place-items-center rounded-3xl gradient-harvest shadow-float">
        <PartyPopper className="size-12 text-harvest-foreground" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-balance">
        Swagat hai, {data.name?.split(" ")[0]}!
      </h1>
      <p className="mt-3 max-w-xs text-base text-muted-foreground">
        Your AgriMitra profile is ready. We'll personalize crop advice for your{" "}
        <span className="font-semibold text-foreground">
          {data.landSize} {data.landUnit}
        </span>{" "}
        in <span className="font-semibold text-foreground">{data.village}</span>.
      </p>
      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
        {(data.crops || []).slice(0, 6).map((id) => {
          const c = CROPS.find((x) => x.id === id);
          if (!c) return null;
          return (
            <div key={id} className="flex flex-col items-center rounded-2xl bg-card p-3 shadow-soft">
              <span className="text-2xl">{c.emoji}</span>
              <span className="mt-1 text-xs font-semibold">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
