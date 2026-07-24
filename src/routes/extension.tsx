import { createFileRoute } from "@tanstack/react-router";
import { Chrome } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const Route = createFileRoute("/extension")({
  head: () => ({
    meta: [
      { title: "Extensão Chrome · VOX Creator Shop" },
      { name: "description", content: "Instale a extensão VOX no Chrome e leve a IA pra dentro do TikTok Shop." },
      { property: "og:title", content: "Extensão Chrome · VOX Creator Shop" },
      { property: "og:description", content: "Extensão VOX para o Chrome." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell crumbs={[{ label: "Automação", muted: true }, { label: "Extensão Chrome" }]}>
      <PagePlaceholder
        eyebrow="Chrome OS"
        title="Extensão VOX para o Chrome"
        description="Sincroniza automaticamente com o TikTok Shop, fixa produtos e ativa o teleprompter direto do navegador."
        icon={Chrome}
        accent="neon"
        bullets={["Sincronização instantânea", "Fixação automática", "Teleprompter no navegador", "Atalhos rápidos"]}
        actions={[{ label: "Instalar extensão", primary: true }, { label: "Ver guia" }]}
      />
    </DashboardShell>
  ),
});
