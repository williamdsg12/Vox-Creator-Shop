import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BarChart3,
  Radio,
  Sparkles,
  PackageSearch,
  Gift,
  Brain,
  Chrome,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { label: string; variant?: "neon" | "amber" | "orange" };
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Cockpit",
    items: [
      { title: "Cockpit Executivo", url: "/", icon: LayoutDashboard },
      { title: "Analytics Avançado", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Lives & Conteúdo",
    items: [
      { title: "Central de Lives & IA", url: "/lives", icon: Radio, badge: { label: "LIVE", variant: "neon" } },
      { title: "Criador de Conteúdo IA", url: "/creator", icon: Sparkles },
    ],
  },
  {
    label: "Mercado & Amostras",
    items: [
      { title: "Radar de Produtos", url: "/radar", icon: PackageSearch },
      { title: "Produtos Gratuitos", url: "/free", icon: Gift, badge: { label: "AMOSTRAS", variant: "orange" } },
    ],
  },
  {
    label: "Automação & IA",
    items: [
      { title: "IA Estratégica & Feed", url: "/ai", icon: Brain },
      { title: "Extensão Chrome OS", url: "/extension", icon: Chrome },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon to-neon/70 shadow-[0_0_20px_oklch(0.88_0.24_138/0.4)] transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 text-neon-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-black tracking-tight">VOX</span>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-neon uppercase">
              Creator Shop
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="group/item h-10 rounded-lg data-[active=true]:bg-sidebar-accent data-[active=true]:text-neon"
                    >
                      <Link
                        to={item.url}
                        activeOptions={{ exact: item.url === "/" }}
                        activeProps={{ "data-active": "true" } as never}
                        className="relative flex items-center gap-3"
                      >
                        <item.icon className="h-4 w-4 shrink-0 transition-colors group-hover/item:text-neon" />
                        <span className="flex-1 truncate text-sm font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge
                            className={cn(
                              "h-5 px-1.5 text-[10px] font-bold tracking-wide border-0",
                              item.badge.variant === "neon" &&
                                "bg-neon/15 text-neon ring-1 ring-neon/40",
                              item.badge.variant === "orange" &&
                                "bg-orange/15 text-orange ring-1 ring-orange/40",
                              item.badge.variant === "amber" &&
                                "bg-amber/15 text-amber ring-1 ring-amber/40",
                            )}
                          >
                            {item.badge.label}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2.5 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-9 w-9 ring-2 ring-neon/40">
            <AvatarFallback className="bg-gradient-to-br from-neon to-amber text-neon-foreground font-bold text-sm">
              W
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">williamdsg12</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Vox PRO · 50 créd.
            </p>
            <p className="truncate text-[10px] text-neon font-medium">
              Teste: 7 dias restantes
            </p>
          </div>
          <button
            aria-label="Configurações"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
