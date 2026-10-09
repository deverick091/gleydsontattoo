"use client";

import { Bell, User, LogOut, Menu, X } from "lucide-react";
import AdminSidebar from "./admin-sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      // Decode JWT payload to get name (no verification needed here, server verifies)
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.name) setUserName(payload.name);
      else if (payload?.email) setUserName(payload.email.split("@")[0]);
    } catch {
      // ignore decode errors
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    router.replace("/auth/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar className={sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} />
      
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-black/50 backdrop-blur px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-white p-2 -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-medium text-white hidden sm:block">Painel Administrativo</h2>
          </div>
          

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-muted hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black">
                3
              </span>
            </button>
            

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 hover:bg-zinc-900 transition-colors focus:outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-black font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">{userName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
