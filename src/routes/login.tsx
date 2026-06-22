import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Phone, Shield } from "lucide-react";
import { saveProfile } from "@/lib/agri-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — AgriMitra AI" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = /^[6-9]\d{9}$/.test(mobile);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    saveProfile({ mobile });
    setTimeout(() => navigate({ to: "/otp" }), 600);
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-2 px-4 pt-5">
        <button
          onClick={() => navigate({ to: "/language" })}
          className="tap-target grid place-items-center rounded-full hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold text-muted-foreground">Step 2 of 4</span>
      </header>

      <section className="px-5 pt-8">
        <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft">
          <Phone className="size-7 text-primary" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-balance">
          Enter your mobile number
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          We'll send a 6-digit OTP to verify it's really you.
        </p>
      </section>

      <form onSubmit={submit} className="mt-8 flex flex-1 flex-col px-5">
        <label className="block text-sm font-semibold text-foreground">
          Mobile Number
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-input bg-card px-4 py-3 focus-within:border-primary">
          <span className="text-lg font-bold text-foreground">+91</span>
          <div className="h-6 w-px bg-border" />
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="98765 43210"
            className="flex-1 bg-transparent text-lg font-semibold tracking-wide outline-none placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>
        {mobile.length > 0 && !valid && (
          <p className="mt-2 text-sm text-destructive">
            Enter a valid 10-digit Indian mobile number
          </p>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
          <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Your number is safe. We use it only to send farming alerts and never
            share it with anyone.
          </p>
        </div>

        <div className="flex-1" />

        <Button
          type="submit"
          size="lg"
          disabled={!valid || loading}
          className="safe-bottom tap-target mt-6 w-full rounded-full gradient-field text-base font-semibold shadow-float"
        >
          {loading ? "Sending OTP…" : "Send OTP"}
        </Button>
      </form>
    </main>
  );
}
