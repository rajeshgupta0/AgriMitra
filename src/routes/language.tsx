import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Languages } from "lucide-react";
import { LANGUAGES, saveProfile, loadProfile } from "@/lib/agri-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/language")({
  head: () => ({ meta: [{ title: "Choose language — AgriMitra AI" }] }),
  component: LanguagePage,
});

function LanguagePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(loadProfile().language || "hi");

  const proceed = () => {
    saveProfile({ language: selected });
    navigate({ to: "/login" });
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-2 px-4 pt-5">
        <button
          onClick={() => navigate({ to: "/welcome" })}
          className="tap-target grid place-items-center rounded-full hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2 font-semibold text-muted-foreground">
          <Languages className="size-4" /> Step 1 of 4
        </div>
      </header>

      <section className="px-5 pt-6">
        <h1 className="text-3xl font-extrabold text-balance">अपनी भाषा चुनें</h1>
        <p className="mt-1 text-base text-muted-foreground">Choose your language</p>
      </section>

      <section className="mt-6 grid flex-1 grid-cols-2 gap-3 overflow-y-auto px-5 pb-32">
        {LANGUAGES.map((lang) => {
          const active = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`relative flex min-h-24 flex-col items-start justify-center rounded-2xl border-2 p-4 text-left transition-all ${
                active
                  ? "border-primary bg-primary-soft shadow-soft"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="text-xl font-bold">{lang.name}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {lang.english}
              </span>
              {active && (
                <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </section>

      <footer className="safe-bottom fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-5 pt-4 backdrop-blur">
        <Button
          onClick={proceed}
          size="lg"
          className="tap-target w-full rounded-full gradient-field text-base font-semibold shadow-float"
        >
          Continue / आगे बढ़ें
        </Button>
      </footer>
    </main>
  );
}
