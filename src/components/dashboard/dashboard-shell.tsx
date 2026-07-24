import type { ReactNode } from "react";
import { Bell, Search, Sparkles } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

type Crumb = { label: string; muted?: boolean };

export function DashboardShell({
  crumbs,
  children,
}: {
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <nav className="flex items-center gap-2 text-sm">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground/50">/</span>}
                  <span className={c.muted ? "text-muted-foreground" : "font-semibold"}>
                    {c.label}
                  </span>
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produtos, scripts, lives..."
                  className="h-9 w-72 rounded-lg border border-border bg-surface/60 pl-8 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-neon/50 focus:ring-2 focus:ring-neon/20"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg"
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_oklch(0.88_0.24_138/0.8)]" />
              </Button>
              <Button
                size="sm"
                className="hidden sm:inline-flex h-9 gap-1.5 bg-gradient-to-r from-neon to-amber text-neon-foreground font-bold hover:opacity-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Iniciar live
              </Button>
            </div>
          </header>
          <main className="pb-16">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
