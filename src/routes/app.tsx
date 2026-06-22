import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, MessageCircle, Users, BarChart3, User } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const TABS: { to: "/app" | "/app/assistant" | "/app/community" | "/app/insights" | "/app/profile"; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/assistant", label: "Assistant", icon: MessageCircle },
  { to: "/app/community", label: "Community", icon: Users },
  { to: "/app/insights", label: "Insights", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: User },
];

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 pt-2">
          {TABS.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="tap-target relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5"
              >
                <Icon
                  className={`size-6 transition ${active ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span
                  className={`text-[11px] font-semibold transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
                {active && (
                  <span className="absolute -top-0.5 h-1 w-8 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
