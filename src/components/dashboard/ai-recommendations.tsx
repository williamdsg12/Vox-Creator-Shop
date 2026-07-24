import { useQuery } from "@tanstack/react-query";
import { Sparkles, Clock, TrendingUp, FileText, MousePointerClick, Lightbulb, ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type RecItem = {
  label: string;
  value: string;
  note: string;
  icon?: LucideIcon;
};

const defaultItems: RecItem[] = [
  { icon: Clock, label: "Melhor horário", value: "20h — 22h", note: "Pico de audiência às terças" },
  { icon: TrendingUp, label: "Produtos em alta", value: "Beleza · Casa · Tech", note: "+34% nas últimas 24h" },
  { icon: FileText, label: "Scripts sugeridos", value: "Quebra de objeção rápida", note: "Ideal para produto novo" },
  { icon: MousePointerClick, label: "Melhor CTA", value: '"Últimas unidades hoje"', note: "+21% de conversão média" },
  { icon: Lightbulb, label: "Oportunidade", value: "Cross-sell no bloco 3", note: "Kit combinado + brinde" },
];

export function AiRecommendations() {
  const { data, isLoading } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: async () => {
      try {
        const res = await fetchApi<RecItem[]>("/ai/recommendations");
        return Array.isArray(res) && res.length ? res : defaultItems;
      } catch (err) {
        return defaultItems;
      }
    },
    staleTime: 30000,
  });

  const items = data || defaultItems;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl glass-card p-5 lg:p-6",
        "ring-1 ring-neon/20",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(600px 300px at 100% 0%, oklch(0.88 0.24 138 / 0.14), transparent 60%)",
        }}
      />
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon to-amber text-neon-foreground shadow-[0_0_24px_oklch(0.88_0.24_138/0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Recomendações da IA</h3>
            <p className="text-xs text-muted-foreground">Baseado nas últimas 30 lives</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      ) : (
        <ul className="grid gap-2">
          {items.map((i, idx) => {
            const IconComp = i.icon || Sparkles;

            return (
              <li
                key={i.label + idx}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 p-3 transition hover:border-neon/40 hover:bg-neon/5"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon">
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {i.label}
                  </p>
                  <p className="truncate text-sm font-semibold">{i.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.note}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-neon" />
              </li>
            );
          })}
        </ul>
      )}

      <Button className="mt-5 w-full gap-2 bg-gradient-to-r from-neon to-amber text-neon-foreground font-bold hover:opacity-95">
        Aplicar recomendações
        <Sparkles className="h-4 w-4" />
      </Button>
    </div>
  );
}
