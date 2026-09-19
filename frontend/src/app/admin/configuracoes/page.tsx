"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminConfiguracoes() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Configurações</h1>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Dados do Estúdio</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input defaultValue="Gleydson Tattoo" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <Input defaultValue="(91) 99999-9999" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Endereço</label>
            <Input defaultValue="R. Domingos Silva, 84 - Barcarena, PA" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 pt-4">Políticas</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Política de Cancelamento</label>
          <Textarea className="h-32" defaultValue="Cancelamentos devem ser feitos com 48h de antecedência..." />
        </div>

        <Button className="w-full md:w-auto">Salvar Configurações</Button>
      </div>
    </div>
  );
}
