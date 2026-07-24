import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Avançado · VOX Creator Shop" },
      { name: "description", content: "Métricas completas das suas lives, produtos e conversão no VOX Creator Shop." },
      { property: "og:title", content: "Analytics Avançado · VOX Creator Shop" },
      { property: "og:description", content: "Analytics de live commerce com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Cockpit", muted: true }, { label: "Analytics" }]}>
      <PagePlaceholder
        eyebrow="Analytics"
        title="Métricas completas da sua operação"
        description="Acompanhe conversão, engajamento, receita e retenção por live, por produto e por bloco de roteiro."
        icon={BarChart3}
        accent="violet"
        bullets={["Conversão por bloco", "Retenção por minuto", "Receita por produto", "Funil ao vivo"]}
        actions={[{ label: "Ver relatórios", primary: true }, { label: "Exportar CSV" }]}
      />
    </DashboardShell>
  ),
});
