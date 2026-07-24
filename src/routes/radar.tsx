import { createFileRoute } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar de Produtos · VOX Creator Shop" },
      { name: "description", content: "Descubra produtos em alta no TikTok Shop com dados de vendas e engajamento." },
      { property: "og:title", content: "Radar de Produtos · VOX Creator Shop" },
      { property: "og:description", content: "Produtos em alta com dados em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Mercado", muted: true }, { label: "Radar de Produtos" }]}>
      <PagePlaceholder
        eyebrow="Radar"
        title="Produtos em alta no TikTok Shop"
        description="Descubra o que está vendendo agora, com dados de conversão, comissão e engajamento em tempo real."
        icon={PackageSearch}
        accent="orange"
        bullets={["Tendências ao vivo", "Comissão", "Concorrência", "Ticket médio"]}
        actions={[{ label: "Explorar radar", primary: true }, { label: "Filtros" }]}
      />
    </DashboardShell>
  ),
});
