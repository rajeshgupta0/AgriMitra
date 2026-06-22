import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Activity, ArrowLeft, BarChart3, Brain, FileLock, ShieldCheck, Users, Cog } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Super Admin — AgriMitra AI" }] }),
  component: AdminShell,
});

const NAV: { to: "/admin"; label: string; icon: typeof BarChart3; exact?: boolean }[] = [
  { to: "/admin", label: "Executive", icon: BarChart3, exact: true },
  { to: "/admin", label: "Users", icon: Users },
  { to: "/admin", label: "Roles", icon: ShieldCheck },
  { to: "/admin", label: "System", icon: Activity },
  { to: "/admin", label: "AI Ops", icon: Brain },
  { to: "/admin", label: "Audit", icon: FileLock },
  { to: "/admin", label: "Settings", icon: Cog },
];

function AdminShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/app/more" className="tap-target inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <ArrowLeft className="size-4" /> Exit
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-foreground text-background"><ShieldCheck className="size-4" /></div>
            <div>
              <p className="text-sm font-bold leading-none">AgriMitra Console</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Super Admin</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> All systems normal</span>
            <span className="hidden sm:inline">v1.0 · prod</span>
            <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">SA</div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 hide-scrollbar">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = n.exact && path === n.to;
            return (
              <Link key={n.label} to={n.to} className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
                <Icon className="size-3.5" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
