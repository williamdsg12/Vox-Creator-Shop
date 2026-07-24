import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/lives")({
  head: () => ({
    meta: [
      { title: "Central de Lives & IA · VOX Creator Shop" },
      { name: "description", content: "Gerencie suas lives com IA, teleprompter e sincronização automática com o TikTok Shop." },
      { property: "og:title", content: "Central de Lives & IA · VOX Creator Shop" },
      { property: "og:description", content: "Cockpit de lives com IA para o TikTok Shop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Lives", muted: true }, { label: "Central de Lives" }]}>
      <PagePlaceholder
        eyebrow="Lives & IA"
        title="Central de Lives Inteligentes"
        description="Configure, inicie e acompanhe suas lives com IA em tempo real. Teleprompter, fixação e troca automática integradas."
        icon={Radio}
        accent="neon"
        bullets={["Teleprompter IA", "Fixação automática", "Roteiro sincronizado", "Chat ao vivo"]}
        actions={[{ label: "Nova live", primary: true }, { label: "Ver histórico" }]}
      />
    </DashboardShell>
  ),
});
