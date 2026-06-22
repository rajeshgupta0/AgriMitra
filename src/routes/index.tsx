import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sprout } from "lucide-react";
import { loadProfile } from "@/lib/agri-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriMitra AI — Voice-First Farming Companion" },
      { name: "description", content: "AI-powered farming companion for Indian farmers. Voice-first crop advice, weather, and market intelligence." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      const p = loadProfile();
      if (p.onboarded) navigate({ to: "/app" });
      else navigate({ to: "/welcome" });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden gradient-field">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-harvest blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-sky/60 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center gap-6 animate-fade-up">
        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-primary-foreground/95 shadow-float">
          <Sprout className="size-12 text-primary" strokeWidth={2.2} />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground">
            AgriMitra <span className="text-harvest">AI</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-primary-foreground/80">
            आपका डिजिटल कृषि साथी
          </p>
        </div>
        <div className="mt-8 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-primary-foreground/80"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
