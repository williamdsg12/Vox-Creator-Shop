import {
  Radio,
  PackageCheck,
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Kpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  accent: "neon" | "amber" | "orange" | "violet";
  spark: number[];
};

const kpis: Kpi[] = [
  { label: "Lives hoje", value: "3", delta: "+1", trend: "up", icon: Radio, accent: "neon", spark: [2, 3, 2, 4, 3, 5, 4] },
  { label: "Produtos ativos", value: "128", delta: "+12", trend: "up", icon: PackageCheck, accent: "amber", spark: [100, 105, 108, 115, 120, 124, 128] },
  { label: "Scripts", value: "42", delta: "+6", trend: "up", icon: FileText, accent: "violet", spark: [30, 32, 35, 34, 38, 40, 42] },
  { label: "Conversão", value: "8,4%", delta: "+1,2%", trend: "up", icon: TrendingUp, accent: "neon", spark: [5, 6, 6, 7, 7, 8, 8.4] },
  { label: "Receita", value: "R$ 24.870", delta: "+18%", trend: "up", icon: DollarSign, accent: "amber", spark: [10, 12, 14, 16, 20, 22, 24] },
  { label: "Pedidos", value: "612", delta: "+9%", trend: "up", icon: ShoppingCart, accent: "orange", spark: [400, 430, 470, 500, 540, 580, 612] },
  { label: "Visualizações", value: "48,2k", delta: "-3%", trend: "down", icon: Eye, accent: "violet", spark: [50, 52, 49, 48, 46, 47, 48.2] },
];

const accent = {
  neon: "text-neon bg-neon/10",
  amber: "text-amber bg-amber/10",
  orange: "text-orange bg-orange/10",
  violet: "text-chart-4 bg-chart-4/10",
} as const;

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80;
  const h = 26;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="opacity-90">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const strokeMap = {
  neon: "oklch(0.88 0.24 138)",
  amber: "oklch(0.87 0.19 92)",
  orange: "oklch(0.72 0.19 45)",
  violet: "oklch(0.65 0.15 260)",
} as const;

export function KpiGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neon">
          Resumo do dia
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
          Seus números em tempo real
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="group glass-card rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-neon/30"
          >
            <div className="flex items-start justify-between">
              <div className={cn("grid h-9 w-9 place-items-center rounded-lg", accent[k.accent])}>
                <k.icon className="h-4 w-4" />
              </div>
              <Sparkline data={k.spark} color={strokeMap[k.accent]} />
            </div>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {k.label}
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-xl font-black tracking-tight sm:text-2xl">{k.value}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  k.trend === "up"
                    ? "bg-neon/10 text-neon"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {k.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {k.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
