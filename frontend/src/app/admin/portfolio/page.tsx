"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function AdminPortfolio() {
  const items = [
    { id: 1, title: "Leão Realista", category: "Realismo" },
    { id: 2, title: "Mandala", category: "Blackwork" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Portfólio</h1>
        <Button><Plus className="w-4 h-4 mr-2"/> Adicionar Trabalho</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="aspect-square bg-zinc-800 flex items-center justify-center text-muted">
              Imagem
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-xs text-accent">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-muted hover:text-white"><Edit2 className="w-4 h-4"/></button>
                <button className="text-muted hover:text-error"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
