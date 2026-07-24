import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Criador de Conteúdo IA · VOX Creator Shop" },
      { name: "description", content: "Gere roteiros, ganchos e CTAs otimizados para live commerce com IA." },
      { property: "og:title", content: "Criador de Conteúdo IA · VOX Creator Shop" },
      { property: "og:description", content: "Roteiros e criativos gerados por IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Conteúdo", muted: true }, { label: "Criador IA" }]}>
      <PagePlaceholder
        eyebrow="Criador IA"
        title="Gere conteúdo que vende"
        description="Roteiros, ganchos, CTAs e quebras de objeção prontos em segundos, calibrados pra sua audiência."
        icon={Sparkles}
        accent="amber"
        bullets={["Roteiros por bloco", "Ganchos virais", "CTAs testados", "Quebra de objeção"]}
        actions={[{ label: "Criar roteiro", primary: true }, { label: "Templates" }]}
      />
    </DashboardShell>
  ),
});
