"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function AdminConfiguracoes() {
  const [form, setForm] = useState({
    name: "Gleydson Tattoo",
    whatsapp: "(91) 99999-9999",
    address: "R. Domingos Silva, 84 - Barcarena, PA",
    cancellationPolicy: "Cancelamentos devem ser feitos com no mínimo 48 horas de antecedência para remarcação da data sem perda do sinal.",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Configurações do estúdio salvas com sucesso!");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-zinc-400">Informações gerais do estúdio e regras de atendimento.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Dados do Estúdio</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nome do Estúdio</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">WhatsApp Comercial</label>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Endereço Completo</label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 pt-4">Políticas de Atendimento</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Política de Cancelamento e Reagendamento</label>
          <Textarea
            className="h-32"
            value={form.cancellationPolicy}
            onChange={(e) => setForm({ ...form, cancellationPolicy: e.target.value })}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
