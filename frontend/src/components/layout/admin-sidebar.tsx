"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Calendar, 
  Users, 
  Settings,
  Image as ImageIcon,
  Calculator,
  ShieldAlert,
  ClipboardList,
  Scissors
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: CalendarCheck2, label: "Agendamentos", href: "/admin/agendamentos" },
  { icon: Calendar, label: "Calendário", href: "/admin/calendario" },
  { icon: Users, label: "Clientes", href: "/admin/clientes" },
  { icon: Scissors, label: "Serviços", href: "/admin/servicos" },
  { icon: ImageIcon, label: "Portfólio", href: "/admin/portfolio" },
  { icon: Calculator, label: "Orçamentos", href: "/admin/orcamentos" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: ClipboardList, label: "Logs", href: "/admin/logs" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-black transition-transform">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-xl font-bold tracking-wider">
          <span className="text-accent">GLEYDSON</span>
          <span className="text-white"> ADMIN</span>
        </span>
      </div>

      <div className="overflow-y-auto py-6 px-4 h-[calc(100vh-4rem)]">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-accent" : "text-muted")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
