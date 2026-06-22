import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Plus, Share2 } from "lucide-react";

export const Route = createFileRoute("/app/community")({
  head: () => ({ meta: [{ title: "Community — AgriMitra AI" }] }),
  component: Community,
});

const POSTS = [
  {
    name: "Suresh Patil",
    village: "Lasalgaon, Maharashtra",
    crop: "🧅 Onion",
    time: "2h",
    text: "This year mere onion ki yield 30% badhi! Drip irrigation aur AgriMitra ke spray advice ne kamal kar diya. Koi aur farmer use kar raha hai?",
    likes: 124, comments: 28,
  },
  {
    name: "Lakshmi Devi",
    village: "Warangal, Telangana",
    crop: "🌶️ Chilli",
    time: "5h",
    text: "Mere chilli ke patte curl ho rahe hain. AgriMitra ne thrips bataya. Koi organic upay suggest karein?",
    likes: 56, comments: 41,
  },
  {
    name: "Dr. Anjali Rao",
    village: "Verified Agri Expert",
    crop: "📘 Tip",
    time: "1d",
    text: "Monsoon ke baad nitrogen ki kami common hai. Urea ki jagah neem-coated urea use karein – nitrogen loss 25% kam hota hai.",
    likes: 412, comments: 67,
  },
];

function Community() {
  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-extrabold">Community</h1>
          <p className="text-xs text-muted-foreground">Farmers helping farmers</p>
        </div>
        <button className="tap-target grid place-items-center rounded-full gradient-field text-primary-foreground shadow-float" aria-label="New post">
          <Plus className="size-5" />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 py-3 -mx-0">
        {["All", "My state", "My crops", "Experts", "FPOs", "Pest help"].map((t, i) => (
          <button
            key={t}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pb-6">
        {POSTS.map((p, i) => (
          <article key={i} className="rounded-3xl bg-card p-4 shadow-soft">
            <header className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full gradient-harvest text-lg font-bold text-harvest-foreground">
                {p.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.village} · {p.time}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                {p.crop}
              </span>
            </header>
            <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
            <footer className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
              <button className="flex items-center gap-1.5 font-semibold hover:text-destructive">
                <Heart className="size-4" /> {p.likes}
              </button>
              <button className="flex items-center gap-1.5 font-semibold hover:text-primary">
                <MessageCircle className="size-4" /> {p.comments}
              </button>
              <button className="ml-auto flex items-center gap-1.5 font-semibold hover:text-primary">
                <Share2 className="size-4" />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
