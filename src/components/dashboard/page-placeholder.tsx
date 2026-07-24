import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "neon",
  actions,
  bullets,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "neon" | "amber" | "orange" | "violet";
  actions?: { label: string; primary?: boolean }[];
  bullets?: string[];
}) {
  const accentMap = {
    neon: "text-neon bg-neon/10 ring-neon/30",
    amber: "text-amber bg-amber/10 ring-amber/30",
    orange: "text-orange bg-orange/10 ring-orange/30",
    violet: "text-chart-4 bg-chart-4/10 ring-chart-4/30",
  }[accent];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(600px 300px at 100% 0%, oklch(0.88 0.24 138 / 0.14), transparent 60%)",
          }}
        />
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "grid h-12 w-12 place-items-center rounded-xl ring-1",
                accentMap,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neon">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
          {bullets && bullets.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {bullets.map((b) => (
                <Badge
                  key={b}
                  className="border-0 bg-surface-elevated/80 text-foreground/90 font-medium"
                >
                  {b}
                </Badge>
              ))}
            </ul>
          )}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Button
                  key={a.label}
                  size="sm"
                  variant={a.primary ? "default" : "secondary"}
                  className={cn(
                    "h-9 rounded-lg",
                    a.primary &&
                      "bg-gradient-to-r from-neon to-amber text-neon-foreground font-bold hover:opacity-95",
                  )}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {["Em breve", "Beta interna", "Lançamento próximo"].map((s, i) => (
          <div key={s} className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Módulo {i + 1}
            </p>
            <p className="mt-2 text-sm font-semibold">{s}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Estamos preparando essa área com dados reais da sua operação.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
