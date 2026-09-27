import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div className="space-y-3">
            <Link href="/" className="font-bold text-xl tracking-widest inline-block">
              <span className="text-accent">GLEYDSON</span>{" "}
              <span className="text-white">TATTOO</span>
            </Link>
            <p className="text-sm text-zinc-400">
              Estúdio de tatuagem e piercing em Barcarena, PA. Especialistas em Realismo, Blackwork e Fine Line.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-accent transition">Início</Link></li>
              <li><Link href="/portfolio" className="hover:text-accent transition">Portfólio</Link></li>
              <li><Link href="/servicos" className="hover:text-accent transition">Serviços</Link></li>
              <li><Link href="/agendamento" className="hover:text-accent transition">Agendamento Online</Link></li>
              <li><Link href="/orcamento" className="hover:text-accent transition">Solicitar Orçamento</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Informações</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/contato" className="hover:text-accent transition">Contato & Localização</Link></li>
              <li><Link href="/privacidade" className="hover:text-accent transition">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-accent transition">Termos de Serviço</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Área Restrita</h4>
            <p className="text-xs text-zinc-400 mb-3">
              Gestão interna de clientes, horários e orçamentos da equipe.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-accent hover:bg-zinc-800 hover:border-accent/40 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              Painel Administrativo
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Gleydson Tattoo. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/auth/login" className="hover:text-zinc-300 transition">Login do Sistema</Link>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-zinc-300 transition">Privacidade</Link>
            <span>•</span>
            <Link href="/termos" className="hover:text-zinc-300 transition">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

