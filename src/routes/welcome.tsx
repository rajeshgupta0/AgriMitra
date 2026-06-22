import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mic, CloudSun, LineChart, Leaf } from "lucide-react";
import heroImg from "@/assets/farmer-hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — AgriMitra AI" }] }),
  component: Welcome,
});

const SLIDES = [
  {
    icon: Mic,
    title: "Bas boliye, jawab paaiye",
    subtitle: "Ask anything in your language",
    desc: "Voice-first AI assistant trained for Indian farms. No typing, no menus.",
    accent: "bg-primary text-primary-foreground",
  },
  {
    icon: Leaf,
    title: "Crop doctor in your pocket",
    subtitle: "Snap a leaf, get a diagnosis",
    desc: "Detect pests and diseases instantly with computer vision and expert advice.",
    accent: "gradient-field text-primary-foreground",
  },
  {
    icon: CloudSun,
    title: "Hyperlocal weather",
    subtitle: "Village-level forecasts",
    desc: "Know when to sow, spray, and harvest with precise rainfall and temperature alerts.",
    accent: "bg-sky text-sky-foreground",
  },
  {
    icon: LineChart,
    title: "Mandi prices & schemes",
    subtitle: "Sell smart, earn more",
    desc: "Live market rates and personalized government scheme recommendations.",
    accent: "gradient-harvest text-harvest-foreground",
  },
];

function Welcome() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[idx];
  const Icon = slide.icon;
  const isLast = idx === SLIDES.length - 1;

  const next = () => (isLast ? navigate({ to: "/language" }) : setIdx(idx + 1));

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2 font-bold text-primary">
          <Leaf className="size-5" />
          AgriMitra
        </div>
        <Link
          to="/language"
          className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Skip
        </Link>
      </header>

      <section className="flex flex-1 flex-col px-5 pt-4">
        <div className={`relative grid aspect-square w-full max-w-md mx-auto place-items-center overflow-hidden rounded-4xl ${slide.accent} shadow-float`}>
          {idx === 0 ? (
            <img
              src={heroImg}
              alt="Farmer using AgriMitra AI"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon className="size-32 opacity-90" strokeWidth={1.4} />
          )}
        </div>

        <div className="mt-8 flex flex-1 flex-col text-balance">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {slide.subtitle}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground">
            {slide.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {slide.desc}
          </p>
        </div>
      </section>

      <footer className="safe-bottom flex items-center justify-between gap-4 px-5 pt-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={next}
          size="lg"
          className="tap-target rounded-full gradient-field px-6 text-base font-semibold shadow-float"
        >
          {isLast ? "Get started" : "Next"}
          <ArrowRight className="size-5" />
        </Button>
      </footer>
    </main>
  );
}
