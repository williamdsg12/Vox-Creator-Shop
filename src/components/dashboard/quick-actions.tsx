import {
  Radio,
  FileText,
  Monitor,
  PackageSearch,
  BarChart3,
  Gift,
  Chrome,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "neon" | "amber" | "orange" | "violet";
  featured?: boolean;
};

const actions: Action[] = [
  { title: "Nova Live", description: "Configure e inicie em segundos", icon: Radio, accent: "neon", featured: true },
  { title: "Criar Script", description: "Gerador de roteiros com IA", icon: FileText, accent: "amber" },
  { title: "Abrir Teleprompter", description: "Rolagem inteligente na live", icon: Monitor, accent: "neon" },
  { title: "Radar de Produtos", description: "Descubra produtos em alta", icon: PackageSearch, accent: "orange" },
  { title: "Analytics", description: "Métricas da sua operação", icon: BarChart3, accent: "violet" },
  { title: "Produtos Gratuitos", description: "Amostras liberadas pra você", icon: Gift, accent: "orange" },
  { title: "Extensão Chrome", description: "Instale o VOX no navegador", icon: Chrome, accent: "neon" },
];

const accent = {
  neon: "text-neon bg-neon/10",
  amber: "text-amber bg-amber/10",
  orange: "text-orange bg-orange/10",
  violet: "text-chart-4 bg-chart-4/10",
} as const;

export function QuickActions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neon">
            Atalhos rápidos
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            O que você quer fazer agora?
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <button
            key={a.title}
            className={cn(
              "group relative overflow-hidden rounded-2xl glass-card p-5 text-left",
              "transition-all duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-neon/40",
              a.featured && "sm:col-span-2 lg:col-span-2 lg:row-span-1",
            )}
          >
            {a.featured && (
              <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-70"
                style={{
                  background:
                    "radial-gradient(600px 200px at 0% 0%, oklch(0.88 0.24 138 / 0.12), transparent 60%)",
                }}
              />
            )}
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-110",
                  accent[a.accent],
                )}
              >
                <a.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-neon group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-4 text-base font-bold">{a.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
