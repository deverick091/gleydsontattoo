"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ServiceItem {
  id: number;
  name: string;
  desc: string;
  duration: number;
  price: string;
  active: boolean;
}

export default function AdminServicos() {
  const [servicos, setServicos] = useState<ServiceItem[]>([
    { id: 1, name: "Tatuagem Exclusiva", desc: "Tatuagem personalizada sob encomenda", duration: 60, price: "Sob orçamento", active: true },
    { id: 2, name: "Piercing Corporal", desc: "Perfurações assépticas em titânio", duration: 30, price: "R$ 80,00", active: true },
    { id: 3, name: "Cover-up / Reforma", desc: "Cobertura de tatuagem antiga", duration: 120, price: "Sob consulta", active: true },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState({ name: "", desc: "", duration: 60, price: "" });

  const openNew = () => {
    setEditingItem(null);
    setForm({ name: "", desc: "", duration: 60, price: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setForm({ name: item.name, desc: item.desc, duration: item.duration, price: item.price });
    setDialogOpen(true);
  };

  const handleToggleActive = (id: number) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    toast.success("Status do serviço atualizado.");
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("O nome do serviço é obrigatório.");
      return;
    }

    if (editingItem) {
      setServicos((prev) =>
        prev.map((s) =>
          s.id === editingItem.id ? { ...s, ...form } : s
        )
      );
      toast.success("Serviço atualizado com sucesso!");
    } else {
      const newService: ServiceItem = {
        id: Date.now(),
        name: form.name,
        desc: form.desc,
        duration: Number(form.duration) || 60,
        price: form.price || "Sob orçamento",
        active: true,
      };
      setServicos((prev) => [newService, ...prev]);
      toast.success("Serviço adicionado com sucesso!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;
    setServicos((prev) => prev.filter((s) => s.id !== id));
    toast.success("Serviço removido.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Serviços</h1>
          <p className="text-sm text-zinc-400">Gerencie a lista de procedimentos disponíveis para agendamento.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Serviço
        </Button>
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
                <td className="px-6 py-4">{s.duration} min</td>
                <td className="px-6 py-4 font-medium text-accent">{s.price}</td>
                <td className="px-6 py-4">
                  <Switch checked={s.active} onCheckedChange={() => handleToggleActive(s.id)} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                      <Edit2 className="w-4 h-4 text-accent" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-zinc-300">Nome do Serviço</label>
              <Input
                placeholder="Ex: Tatuagem Fine Line"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Descrição Curta</label>
              <Input
                placeholder="Ex: Traços finos e delicados"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300">Duração (minutos)</label>
                <Input
                  type="number"
                  placeholder="60"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Preço Estimado</label>
                <Input
                  placeholder="Ex: R$ 150,00 ou Sob orçamento"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full mt-4">
              Salvar Serviço
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

