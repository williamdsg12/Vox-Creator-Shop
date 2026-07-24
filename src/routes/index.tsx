import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Radio, Plus, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { KpiGrid } from "@/components/dashboard/kpi-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cockpit Executivo · VOX Creator Shop" },
      {
        name: "description",
        content:
          "Visão geral das suas lives, produtos, conversão e recomendações da IA no VOX Creator Shop.",
      },
      { property: "og:title", content: "Cockpit Executivo · VOX Creator Shop" },
      {
        property: "og:description",
        content: "Visão geral das suas lives, produtos, conversão e recomendações da IA no VOX Creator Shop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function DashboardPage() {
  return (
    <DashboardShell crumbs={[{ label: "Cockpit", muted: true }, { label: "Executivo" }]}>
      {/* Greeting */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-neon shadow-[0_0_10px_oklch(0.88_0.24_138/0.9)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neon">
                Cockpit ao vivo
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {greeting()}, <span className="text-gradient-neon">William</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aqui está o resumo da sua operação em tempo real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" className="h-9 gap-1.5 rounded-lg">
              <Plus className="h-3.5 w-3.5" />
              Novo script
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-gradient-to-r from-neon to-amber text-neon-foreground font-bold hover:opacity-95"
            >
              <Radio className="h-3.5 w-3.5" />
              Iniciar live
            </Button>
          </div>
        </div>
      </section>

      {/* Live status banner */}
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-80"
            style={{
              background:
                "radial-gradient(600px 220px at 0% 0%, oklch(0.88 0.24 138 / 0.14), transparent 60%), radial-gradient(500px 220px at 100% 100%, oklch(0.72 0.19 45 / 0.10), transparent 60%)",
            }}
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-neon/15 text-neon ring-1 ring-neon/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge className="border-0 bg-neon/15 text-neon text-[10px] font-bold tracking-wide">
                  IA ATIVA
                </Badge>
                <span className="text-xs text-muted-foreground">atualizado agora</span>
              </div>
              <p className="mt-1 text-base font-bold sm:text-lg">
                Sua próxima live está pronta pra começar.
              </p>
              <p className="text-sm text-muted-foreground">
                12 produtos carregados · roteiro sincronizado · teleprompter armado.
              </p>
            </div>
            <Button size="sm" variant="secondary" className="h-9 gap-1.5 rounded-lg">
              Abrir cockpit da live
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <KpiGrid />

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <AiRecommendations />
        </div>
      </section>

      <QuickActions />
    </DashboardShell>
  );
}
