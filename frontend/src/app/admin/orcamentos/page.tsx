"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminOrcamentos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Solicitações de Orçamento</h1>
      </div>

      <div className="grid gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-white">Carlos Almeida</h3>
                <Badge variant="warning">Pendente</Badge>
              </div>
              <p className="text-sm text-zinc-400 mb-4">Braço inteiro • Realismo • Aprox 30cm</p>
              <p className="text-sm text-muted line-clamp-2">"Queria fechar o braço com tema de mitologia nórdica, com um Odin principal..."</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button>Responder via WhatsApp</Button>
              <Button variant="outline">Converter em Agendamento</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
