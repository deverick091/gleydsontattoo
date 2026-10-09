"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit2, Plus, RefreshCw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price?: number | null;
  active: boolean;
  createdAt: string;
}

interface ServiceForm {
  name: string;
  description: string;
  duration: string;
  price: string;
  active: boolean;
}

const emptyForm: ServiceForm = {
  name: "",
  description: "",
  duration: "60",
  price: "",
  active: true,
};

async function apiGetServices(): Promise<Service[]> {
  const res = await api.get<ApiResponse<Service[]>>("/api/services");
  return res.data;
}

async function apiCreateService(data: Omit<Service, "id" | "createdAt">): Promise<Service> {
  const res = await api.post<ApiResponse<Service>>("/api/services", data);
  return res.data;
}

async function apiUpdateService(id: string, data: Partial<Omit<Service, "id" | "createdAt">>): Promise<Service> {
  const res = await api.patch<ApiResponse<Service>>(`/api/services/${id}`, data);
  return res.data;
}

export default function AdminServicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setServices(await apiGetServices());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description ?? "",
      duration: String(service.duration),
      price: service.price != null ? String(service.price) : "",
      active: service.active,
    });
    setModalOpen(true);
  }

  function updateForm(field: keyof ServiceForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) { toast.error("Nome é obrigatório."); return; }
    const duration = parseInt(form.duration);
    if (!duration || duration < 1) { toast.error("Duração inválida."); return; }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      duration,
      price: form.price !== "" ? parseFloat(form.price) : null,
      active: form.active,
    };

    setSubmitting(true);
    try {
      if (editing) {
        await apiUpdateService(editing.id, payload);
        toast.success("Serviço atualizado!");
      } else {
        await apiCreateService(payload);
        toast.success("Serviço criado!");
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar serviço.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(service: Service) {
    try {
      await apiUpdateService(service.id, { active: !service.active });
      setServices(prev =>
        prev.map(s => s.id === service.id ? { ...s, active: !s.active } : s)
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar serviço.");
    }
  }

  function formatPrice(price?: number | null) {
    if (price == null) return "Sob orçamento";
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Serviços</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Novo Serviço
          </Button>
        </div>
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
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">Carregando...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">Nenhum serviço cadastrado.</td></tr>
            ) : services.map(s => (
              <tr key={s.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{s.name}</p>
                  {s.description && <p className="text-xs text-zinc-500 mt-0.5">{s.description}</p>}
                </td>
                <td className="px-6 py-4">{s.duration}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(s.price)}</td>
                <td className="px-6 py-4">
                  <Switch
                    checked={s.active}
                    onCheckedChange={() => toggleActive(s)}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                    <Edit2 className="w-4 h-4 text-accent" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Criar / Editar Serviço */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            <DialogDescription>
              {editing ? "Altere os dados do serviço." : "Preencha os dados do novo serviço."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Nome *</label>
              <Input
                value={form.name}
                onChange={e => updateForm("name", e.target.value)}
                placeholder="Ex: Tatuagem Traço Fino"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Descrição</label>
              <Textarea
                value={form.description}
                onChange={e => updateForm("description", e.target.value)}
                placeholder="Descrição do serviço..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">Duração (minutos) *</label>
                <Input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={e => updateForm("duration", e.target.value)}
                  placeholder="60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">Preço base (R\$)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => updateForm("price", e.target.value)}
                  placeholder="Deixe vazio p/ orçamento"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={v => updateForm("active", v)}
              />
              <span className="text-sm text-zinc-300">Serviço ativo</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
