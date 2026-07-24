import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "IA Estratégica & Feed · VOX Creator Shop" },
      { name: "description", content: "Insights estratégicos gerados por IA para sua operação de live commerce." },
      { property: "og:title", content: "IA Estratégica & Feed · VOX Creator Shop" },
      { property: "og:description", content: "Insights estratégicos por IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Automação", muted: true }, { label: "IA Estratégica" }]}>
      <PagePlaceholder
        eyebrow="IA Estratégica"
        title="Feed inteligente da sua operação"
        description="A IA lê suas lives, produtos e concorrentes pra sugerir o próximo passo com maior probabilidade de venda."
        icon={Brain}
        accent="violet"
        bullets={["Radar de perguntas", "Gatilhos mentais", "Quebra de objeção", "Resposta automática"]}
        actions={[{ label: "Abrir feed", primary: true }]}
      />
    </DashboardShell>
  ),
});
