import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/free")({
  head: () => ({
    meta: [
      { title: "Produtos Gratuitos · VOX Creator Shop" },
      { name: "description", content: "Amostras liberadas por marcas para creators do VOX Creator Shop." },
      { property: "og:title", content: "Produtos Gratuitos · VOX Creator Shop" },
      { property: "og:description", content: "Amostras liberadas pra creators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Mercado", muted: true }, { label: "Produtos Gratuitos" }]}>
      <PagePlaceholder
        eyebrow="Amostras"
        title="Produtos gratuitos disponíveis"
        description="Marcas parceiras liberam amostras exclusivas para creators VOX. Solicite, receba e transforme em live."
        icon={Gift}
        accent="orange"
        bullets={["Marcas verificadas", "Envio grátis", "Sem contrapartida", "Reposição semanal"]}
        actions={[{ label: "Ver amostras", primary: true }]}
      />
    </DashboardShell>
  ),
});
