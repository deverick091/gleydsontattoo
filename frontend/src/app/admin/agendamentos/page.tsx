"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "@/components/shared/status-badge";
import { AppointmentStatus } from "@/types";
import { Edit, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminAppointmentService, AdminAppointment } from "@/services/admin.service";

export default function AdminAgendamentos() {
  const [items, setItems] = useState<AdminAppointment[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<string | null>(null);
  const [editingApt, setEditingApt] = useState<AdminAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (query.trim()) params.query = query.trim();
      if (status !== "todos") params.status = status;
      if (date) params.date = date;
      const result = await adminAppointmentService.list(params);
      setItems(result.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar os agendamentos."); }
    finally { setLoading(false); }
  }, [query, status, date]);

  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);

  async function changeStatus(item: AdminAppointment, next: AppointmentStatus) {
    const reason = next === AppointmentStatus.CANCELLED ? window.prompt("Motivo do cancelamento:") : undefined;
    if (next === AppointmentStatus.CANCELLED && !reason) return;
    setMutating(item.id);
    try { await adminAppointmentService.updateStatus(item.id, next, reason || undefined); toast.success("Status atualizado."); await load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o status."); }
    finally { setMutating(null); }
  }

  function openEdit(item: AdminAppointment) {
    setEditingApt(item);
    setRescheduleDate(item.date);
    setRescheduleTime(item.startTime);
  }

  async function saveReschedule() {
    if (!editingApt) return;
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Informe a data e o horário.");
      return;
    }
    setMutating(editingApt.id);
    try {
      await adminAppointmentService.reschedule(editingApt.id, { date: rescheduleDate, startTime: rescheduleTime });
      toast.success("Agendamento reagendado com sucesso!");
      setEditingApt(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível reagendar.");
    } finally {
      setMutating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
        <Button onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
      </div>
      <Card className="p-4 bg-zinc-900 border-zinc-800 flex flex-col md:flex-row gap-4">
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por cliente..." className="md:w-1/3" />
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>
          <SelectItem value="todos">Todos</SelectItem>{Object.values(AppointmentStatus).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}
        </SelectContent></Select>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="md:w-[200px]" />
      </Card>
      {error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}<Button variant="ghost" className="ml-3" onClick={load}>Tentar novamente</Button></div>}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-zinc-300"><thead className="bg-black/50 text-muted uppercase"><tr><th className="px-6 py-4">Data e Hora</th><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Serviço</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
          <tbody className="divide-y divide-zinc-800">{loading ? <tr><td colSpan={5} className="px-6 py-10 text-center">Carregando...</td></tr> : items.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center">Nenhum agendamento encontrado.</td></tr> : items.map(item => <tr key={item.id} className="hover:bg-zinc-800/50"><td className="px-6 py-4 font-medium text-white">{item.date} às {item.startTime}</td><td className="px-6 py-4">{item.client.name}<div className="text-xs text-zinc-500">{item.client.phone}</div></td><td className="px-6 py-4">{item.service.name}</td><td className="px-6 py-4"><StatusBadge status={item.status} /></td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Button aria-label="Editar agendamento" variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>{item.status === AppointmentStatus.PENDING && <Button size="sm" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.CONFIRMED)}>Confirmar</Button>}{item.status === AppointmentStatus.CONFIRMED && <Button size="sm" variant="outline" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.COMPLETED)}>Concluir</Button>}{![AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED].includes(item.status) && <Button size="sm" variant="destructive" disabled={mutating === item.id} onClick={() => changeStatus(item, AppointmentStatus.CANCELLED)}>Cancelar</Button>}</div></td></tr>)}</tbody>
        </table>
      </div>

      <Dialog open={Boolean(editingApt)} onOpenChange={(open) => !open && setEditingApt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Horário</DialogTitle>
          </DialogHeader>
          {editingApt && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-zinc-400">
                Cliente: <strong className="text-white">{editingApt.client.name}</strong> ({editingApt.service.name})
              </p>
              <div>
                <label className="text-sm font-medium text-zinc-300">Nova Data</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Novo Horário</label>
                <Input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={saveReschedule} className="w-full mt-2" disabled={mutating === editingApt.id}>
                Confirmar Reagendamento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
