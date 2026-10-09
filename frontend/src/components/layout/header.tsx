"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Lock, LayoutDashboard, Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-widest flex items-center gap-1.5">
          <span className="text-accent">GLEYDSON</span>
          <span className="text-white">TATTOO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition text-zinc-300">Início</Link>
          <Link href="/portfolio" className="hover:text-accent transition text-zinc-300">Portfólio</Link>
          <Link href="/servicos" className="hover:text-accent transition text-zinc-300">Serviços</Link>
          <Link href="/agendamento" className="hover:text-accent transition text-zinc-300">Agendamento</Link>
          <Link href="/contato" className="hover:text-accent transition text-zinc-300">Contato</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild size="sm" className="bg-accent text-black hover:bg-accent/90 font-medium">
            <Link href="/agendamento" className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Agendar</span>
            </Link>
          </Button>

          {user ? (
            <Button asChild variant="outline" size="sm" className="border-accent/40 text-accent hover:bg-accent/10">
              <Link href="/admin" className="flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Painel Admin</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">
              <Link href="/auth/login" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>Acessar Sistema</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-zinc-300 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-border px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-base">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Início
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Portfólio
            </Link>
            <Link
              href="/servicos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Serviços
            </Link>
            <Link
              href="/agendamento"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Agendamento Online
            </Link>
            <Link
              href="/orcamento"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Pedir Orçamento
            </Link>
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-accent py-1"
            >
              Contato
            </Link>
          </nav>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <Button asChild className="w-full bg-accent text-black font-semibold">
              <Link href="/agendamento" onClick={() => setMobileMenuOpen(false)}>
                Agendar Horário
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-zinc-700 text-zinc-300">
              <Link href={user ? "/admin" : "/auth/login"} onClick={() => setMobileMenuOpen(false)}>
                <Lock className="w-4 h-4 mr-2 text-accent" />
                {user ? "Acessar Painel Administrativo" : "Acessar Sistema / Login"}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

