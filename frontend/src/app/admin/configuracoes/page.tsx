"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminConfiguracoes() {
  const [copiedBooking, setCopiedBooking] = useState(false);
  const [copiedBudget, setCopiedBudget] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const bookingLink = origin ? `${origin}/agendar` : "/agendar";
  const budgetLink = origin ? `${origin}/orcamento` : "/orcamento";

  const handleCopy = (link: string, isBooking: boolean) => {
    navigator.clipboard.writeText(link);
    if (isBooking) {
      setCopiedBooking(true);
      setTimeout(() => setCopiedBooking(false), 2000);
    } else {
      setCopiedBudget(true);
      setTimeout(() => setCopiedBudget(false), 2000);
    }
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-zinc-400 mt-1">Gerencie os links públicos do estúdio e preferências do sistema.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Links Públicos do Sistema</h3>
          <p className="text-zinc-400 text-sm mt-2">
            Copie os links abaixo para enviar aos seus clientes ou colocar na bio do Instagram / redes sociais.
          </p>
        </div>

        {/* Link de Agendamento */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white block">Link Direto de Agendamento:</label>
          <div className="flex gap-2">
            <Input readOnly value={bookingLink} className="bg-zinc-800 font-mono text-zinc-200 h-11" />
            <Button onClick={() => handleCopy(bookingLink, true)} variant="secondary" className="min-w-[130px] h-11">
              {copiedBooking ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedBooking ? "Copiado!" : "Copiar Link"}
            </Button>
            <Button asChild variant="outline" className="h-11 px-3">
              <a href={bookingLink} target="_blank" rel="noopener noreferrer" title="Abrir página">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Link de Orçamento */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <label className="text-sm font-medium text-white block">Link para Solicitação de Orçamento:</label>
          <div className="flex gap-2">
            <Input readOnly value={budgetLink} className="bg-zinc-800 font-mono text-zinc-200 h-11" />
            <Button onClick={() => handleCopy(budgetLink, false)} variant="secondary" className="min-w-[130px] h-11">
              {copiedBudget ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedBudget ? "Copiado!" : "Copiar Link"}
            </Button>
            <Button asChild variant="outline" className="h-11 px-3">
              <a href={budgetLink} target="_blank" rel="noopener noreferrer" title="Abrir página">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Dados do Estúdio</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nome do Estúdio</label>
            <Input defaultValue="Gleydson Tattoo" className="bg-zinc-800 border-zinc-700" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">WhatsApp de Contato</label>
            <Input defaultValue="(91) 99999-9999" className="bg-zinc-800 border-zinc-700" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Endereço</label>
            <Input defaultValue="R. Domingos Silva, 84 - Barcarena, PA" className="bg-zinc-800 border-zinc-700" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 pt-4">Políticas</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Política de Cancelamento</label>
          <Textarea className="h-32 bg-zinc-800 border-zinc-700" defaultValue="Cancelamentos devem ser feitos com 48h de antecedência..." />
        </div>

        <Button onClick={() => toast.success("Configurações salvas com sucesso!")} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-black font-semibold">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
