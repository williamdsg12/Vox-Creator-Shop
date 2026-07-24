import {
  Radio,
  PackagePlus,
  MessageSquare,
  ShoppingBag,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Activity = {
  when: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "neon" | "amber" | "orange" | "violet";
  tag: string;
};

const activities: Activity[] = [
  { when: "agora", title: "Live iniciada", description: "Martelete Rotativo · roteiro sincronizado", icon: Radio, accent: "neon", tag: "AO VIVO" },
  { when: "há 12 min", title: "Novo pedido", description: "Cliente comprou 2 unidades pelo TikTok Shop", icon: ShoppingBag, accent: "amber", tag: "VENDA" },
  { when: "há 42 min", title: "IA sugeriu troca de CTA", description: "Aumento estimado de 12% na conversão", icon: Sparkles, accent: "violet", tag: "IA" },
  { when: "há 1h", title: "Script gerado", description: "Novo roteiro para 'Kit Beleza Premium'", icon: FileText, accent: "orange", tag: "SCRIPT" },
  { when: "há 2h", title: "Produto importado", description: "12 novos itens sincronizados do TikTok Shop", icon: PackagePlus, accent: "neon", tag: "SYNC" },
  { when: "há 3h", title: "Comentário respondido", description: "IA respondeu automaticamente 34 mensagens", icon: MessageSquare, accent: "amber", tag: "AUTO" },
];

const accent = {
  neon: "text-neon bg-neon/10 ring-neon/30",
  amber: "text-amber bg-amber/10 ring-amber/30",
  orange: "text-orange bg-orange/10 ring-orange/30",
  violet: "text-chart-4 bg-chart-4/10 ring-chart-4/30",
} as const;

export function RecentActivity() {
  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Atividade recente</h3>
          <p className="text-xs text-muted-foreground">Últimas ações da sua operação</p>
        </div>
        <Badge className="border-0 bg-neon/10 text-neon">Ao vivo</Badge>
      </div>
      <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-border">
        {activities.map((a) => (
          <li key={a.title} className="relative flex gap-3">
            <div
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-card",
                accent[a.accent],
              )}
            >
              <a.icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{a.title}</p>
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                  · {a.when}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
            </div>
            <Badge
              variant="secondary"
              className="h-5 shrink-0 border-0 bg-muted text-[10px] font-bold tracking-wide text-muted-foreground"
            >
              {a.tag}
            </Badge>
          </li>
        ))}
      </ol>
    </div>
  );
}
