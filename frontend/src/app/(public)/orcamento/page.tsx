"use client";

import SectionHeader from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function OrcamentoPage() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title="Solicitar Orçamento" subtitle="Preencha os dados para receber um orçamento detalhado do seu projeto." />

        {success ? (
          <div className="bg-zinc-900 border border-success p-12 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-success mb-4">Solicitação Enviada!</h3>
            <p className="text-muted mb-8">Recebemos seu pedido de orçamento. Entraremos em contato via WhatsApp em até 24 horas.</p>
            <Button onClick={() => setSuccess(false)} variant="outline">Enviar outro orçamento</Button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Nome Completo</label>
                  <Input required placeholder="Ex: João Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">WhatsApp</label>
                  <Input required placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Região do Corpo</label>
                  <Input required placeholder="Ex: Antebraço interno" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Tamanho Aproximado</label>
                  <Input required placeholder="Ex: 15cm x 10cm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Estilo da Tatuagem</label>
                <select className="flex h-10 w-full rounded-md border border-border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Selecione um estilo</option>
                  <option value="realismo">Realismo</option>
                  <option value="blackwork">Blackwork</option>
                  <option value="fineline">Fine Line</option>
                  <option value="oldschool">Old School</option>
                  <option value="outro">Outro / Não sei</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Descrição da Ideia</label>
                <Textarea required placeholder="Descreva em detalhes o que você imagina para sua tatuagem..." className="h-32" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Imagens de Referência</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center bg-black hover:bg-zinc-950 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="text-sm text-white font-medium">Clique ou arraste as imagens aqui</p>
                  <p className="text-xs text-muted mt-1">Até 3 imagens (Max 5MB cada)</p>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg mt-4">
                Enviar Solicitação
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
