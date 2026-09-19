"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Plus } from "lucide-react";

export default function AdminServicos() {
  const servicos = [
    { id: 1, name: "Tatuagem", desc: "Tatuagem personalizada", duration: 60, price: "Sob orçamento", active: true },
    { id: 2, name: "Piercing", desc: "Perfuração", duration: 30, price: "R$ 80,00", active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Serviços</h1>
        <Button><Plus className="w-4 h-4 mr-2"/> Novo Serviço</Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-black/50 text-muted uppercase">
            <tr>
              <th className="px-6 py-4">Serviço</th>
              <th className="px-6 py-4">Duração (min)</th>
              <th className="px-6 py-4">Preço Base</th>
              <th className="px-6 py-4">Ativo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {servicos.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{s.name}</p>
                  <p className="text-xs text-muted">{s.desc}</p>
                </td>
                <td className="px-6 py-4">{s.duration}</td>
                <td className="px-6 py-4 font-medium">{s.price}</td>
                <td className="px-6 py-4"><Switch checked={s.active} /></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4 text-accent"/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
