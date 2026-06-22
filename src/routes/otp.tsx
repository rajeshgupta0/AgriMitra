import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { loadProfile } from "@/lib/agri-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/otp")({
  head: () => ({ meta: [{ title: "Verify OTP — AgriMitra AI" }] }),
  component: Otp,
});

function Otp() {
  const navigate = useNavigate();
  const profile = typeof window !== "undefined" ? loadProfile() : {};
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const set = (i: number, v: string) => {
    const c = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = c;
    setDigits(next);
    setError(null);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Demo: any 6-digit code works
      navigate({ to: "/register" });
    }, 700);
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-2 px-4 pt-5">
        <button
          onClick={() => navigate({ to: "/login" })}
          className="tap-target grid place-items-center rounded-full hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold text-muted-foreground">Step 3 of 4</span>
      </header>

      <section className="px-5 pt-8">
        <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft">
          <MessageSquare className="size-7 text-primary" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-balance">Verify OTP</h1>
        <p className="mt-2 text-base text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-foreground">+91 {profile.mobile}</span>
        </p>
      </section>

      <form onSubmit={verify} className="mt-8 flex flex-1 flex-col px-5">
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className={`h-14 w-12 rounded-2xl border-2 bg-card text-center text-2xl font-bold outline-none transition ${
                error ? "border-destructive" : d ? "border-primary" : "border-input"
              } focus:border-primary`}
            />
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {seconds > 0 ? (
            <>Resend OTP in <span className="font-semibold text-foreground">{seconds}s</span></>
          ) : (
            <button
              type="button"
              onClick={() => setSeconds(30)}
              className="font-semibold text-primary hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="flex-1" />

        <Button
          type="submit"
          size="lg"
          disabled={digits.join("").length !== 6 || loading}
          className="safe-bottom tap-target mt-6 w-full rounded-full gradient-field text-base font-semibold shadow-float"
        >
          {loading ? "Verifying…" : "Verify & Continue"}
        </Button>
      </form>
    </main>
  );
}
