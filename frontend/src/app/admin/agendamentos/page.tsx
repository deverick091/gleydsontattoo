"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/shared/status-badge";
import { AppointmentStatus } from "@/types";
import type { BookingService as BookingServiceType } from "@/types";
import { CalendarPlus, Edit, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminAppointmentService, AdminAppointment } from "@/services/admin.service";
import { bookingService } from "@/services/booking.service";

interface NewAppointmentForm {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

/** Returns today's date as "yyyy-MM-dd" without timezone shift */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateMask(val: string) {
  const v = val.replace(/\D/g, '').slice(0, 8);
  if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return v;
}

function isoToBr(iso: string) {
  if (!iso || !iso.includes('-')) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function brToIso(br: string) {
  if (br.length !== 10) return br;
  const [d, m, y] = br.split('/');
  return `${y}-${m}-${d}`;
}

const emptyForm: NewAppointmentForm = {
  serviceId: "",
  date: isoToBr(todayStr()), // keep state as DD/MM/YYYY
  time: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  notes: "",
};

export default function AdminAgendamentos() {
  const [items, setItems] = useState<AdminAppointment[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<string | null>(null);

  // New appointment modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewAppointmentForm>(emptyForm);
  const [services, setServices] = useState<BookingServiceType[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (query.trim()) params.query = query.trim();
      if (status !== "todos") params.status = status;
      if (date && date.length === 10) params.date = brToIso(date);
      const result = await adminAppointmentService.list(params);
      setItems(result.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar os agendamentos."); }
    finally { setLoading(false); }
  }, [query, status, date]);

  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);

  // Load services when modal opens
  useEffect(() => {
    if (modalOpen) {
      bookingService.getServices()
        .then(setServices)
        .catch(() => toast.error("Não foi possível carregar os serviços."));
    }
  }, [modalOpen]);

  async function changeStatus(item: AdminAppointment, next: AppointmentStatus) {
    const reason = next === AppointmentStatus.CANCELLED ? window.prompt("Motivo do cancelamento:") : undefined;
    if (next === AppointmentStatus.CANCELLED && !reason) return;
    setMutating(item.id);
    try { await adminAppointmentService.updateStatus(item.id, next, reason || undefined); toast.success("Status atualizado."); await load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o status."); }
    finally { setMutating(null); }
  }

  function updateForm(field: keyof NewAppointmentForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function openModal() {
    setForm({ ...emptyForm, date: isoToBr(todayStr()) });
    setModalOpen(true);
  }

  async function handleCreateAppointment() {
    if (!form.serviceId || !form.date || !form.time || !form.clientName || !form.clientPhone) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const isoDate = brToIso(form.date);
    if (isoDate.length !== 10 || !isoDate.includes('-')) {
      toast.error("Data inválida. Use o formato DD/MM/AAAA.");
      return;
    }
    setSubmitting(true);
    try {
      await adminAppointmentService.create({
        serviceId: form.serviceId,
        date: isoDate,
        time: form.time,
        client: {
          name: form.clientName,
          phone: form.clientPhone,
          email: form.clientEmail,
          notes: form.notes || undefined,
        },
      });
      toast.success("Agendamento criado com sucesso!");
      setModalOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar agendamento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
        <div className="flex gap-2">
          <Button onClick={openModal} className="bg-emerald-700 hover:bg-emerald-600 text-white">
            <CalendarPlus className="mr-2 h-4 w-4" />Novo Agendamento
          </Button>
          <Button onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
        </div>
      </div>
      <Card className="p-4 bg-zinc-900 border-zinc-800 flex flex-col md:flex-row gap-4">
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por cliente..." className="md:w-1/3" />
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>
          <SelectItem value="todos">Todos</SelectItem>{Object.values(AppointmentStatus).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}
        </SelectContent></Select>
        <Input type="text" placeholder="Data (DD/MM/AAAA)" maxLength={10} value={date} onChange={e => setDate(formatDateMask(e.target.value))} className="md:w-[200px]" />
      </Card>
      {error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}<Button variant="ghost" className="ml-3" onClick={load}>Tentar novamente</Button></div>}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-zinc-300"><thead className="bg-black/50 text-muted uppercase"><tr><th className="px-6 py-4">Data e Hora</th><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Serviço</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
          <tbody className="divide-y divide-zinc-800">{loading ? <tr><td colSpan={5} className="px-6 py-10 text-center">Carregando...</td></tr> : items.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center">Nenhum agendamento encontrado.</td></tr> : items.map(item => <tr key={item.id} className="hover:bg-zinc-800/50"><td className="px-6 py-4 font-medium text-white">{item.date.split('-').reverse().join('/')} às {item.startTime}</td><td className="px-6 py-4">{item.client.name}<div className="text-xs text-zinc-500">{item.client.phone}</div></td><td className="px-6 py-4">{item.service.name}</td><td className="px-6 py-4"><StatusBadge status={item.status} /></td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Button aria-label="Editar agendamento" variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>{item.status === AppointmentStatus.PENDING && <Button size="sm" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.CONFIRMED)}>Confirmar</Button>}{item.status === AppointmentStatus.CONFIRMED && <Button size="sm" variant="outline" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.COMPLETED)}>Concluir</Button>}{![AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED].includes(item.status) && <Button size="sm" variant="destructive" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.CANCELLED)}>Cancelar</Button>}</div></td></tr>)}</tbody>
        </table>
      </div>

      {/* Modal Novo Agendamento */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Preencha os dados para criar um novo agendamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Serviço *</label>
              <Select value={form.serviceId} onValueChange={v => updateForm("serviceId", v)}>
                <SelectTrigger><SelectValue placeholder={services.length === 0 ? "Nenhum serviço cadastrado" : "Selecione o serviço"} /></SelectTrigger>
                <SelectContent>
                  {services.length === 0 ? (
                    <SelectItem value="__empty" disabled>Cadastre serviços em Serviços</SelectItem>
                  ) : (
                    services.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.duration}min)</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">Data *</label>
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  value={form.date}
                  onChange={e => updateForm("date", formatDateMask(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">Horário *</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => updateForm("time", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Nome do Cliente *</label>
              <Input
                value={form.clientName}
                onChange={e => updateForm("clientName", e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">Telefone *</label>
                <Input
                  value={form.clientPhone}
                  onChange={e => updateForm("clientPhone", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1 block">E-mail</label>
                <Input
                  type="email"
                  value={form.clientEmail}
                  onChange={e => updateForm("clientEmail", e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Observações</label>
              <Textarea
                value={form.notes}
                onChange={e => updateForm("notes", e.target.value)}
                placeholder="Detalhes adicionais sobre o agendamento..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>Cancelar</Button>
            <Button onClick={handleCreateAppointment} disabled={submitting}>
              {submitting ? "Criando..." : "Criar Agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
