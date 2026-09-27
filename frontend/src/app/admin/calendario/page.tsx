"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { AdminAppointment, adminAppointmentService } from "@/services/admin.service";

const hours = Array.from({ length: 13 }, (_, i) => i + 8);
const toMinutes = (time: string) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };
const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

export default function AdminCalendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startDate, i)), [startDate]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const result = await adminAppointmentService.list({ startDate: dateKey(startDate), endDate: dateKey(addDays(startDate, 6)), limit: "100" }); setAppointments(result.data); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar o calendário."); }
    finally { setLoading(false); }
  }, [startDate]);
  useEffect(() => { load(); }, [load]);
  const appointmentsFor = (day: Date, hour: number) => appointments.filter(item => item.date.slice(0, 10) === dateKey(day) && toMinutes(item.startTime) >= hour * 60 && toMinutes(item.startTime) < (hour + 1) * 60);

  return <div className="space-y-6 h-full flex flex-col"><div className="flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl font-bold text-white">Calendário</h1><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button><Button variant="outline" size="sm" onClick={() => setCurrentDate(addWeeks(currentDate, -1))} aria-label="Semana anterior"><ChevronLeft className="h-4 w-4" /></Button><span className="px-2 font-medium text-white min-w-[140px] text-center">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</span><Button variant="outline" size="sm" onClick={() => setCurrentDate(addWeeks(currentDate, 1))} aria-label="Próxima semana"><ChevronRight className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={load} aria-label="Atualizar calendário"><RefreshCw className="h-4 w-4" /></Button></div></div>{error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-red-200">{error}</div>}<div className="bg-zinc-900 border border-zinc-800 rounded-xl flex-1 overflow-auto"><div className="min-w-[900px]"><div className="grid grid-cols-8 border-b border-zinc-800 bg-black/30"><div className="p-3 border-r border-zinc-800 text-center text-muted font-medium">Hora</div>{weekDays.map(day => <div key={dateKey(day)} className="p-3 border-r border-zinc-800 text-center"><p className="text-xs text-muted uppercase">{format(day, "EEE", { locale: ptBR })}</p><p className="text-xl font-bold text-white">{format(day, "d")}</p></div>)}</div>{hours.map(hour => <div key={hour} className="grid grid-cols-8 border-b border-zinc-800 min-h-[76px]"><div className="p-2 border-r border-zinc-800 text-center text-xs text-muted bg-black/30">{hour}:00</div>{weekDays.map(day => <div key={dateKey(day)} className="border-r border-zinc-800 p-1 relative">{appointmentsFor(day, hour).map(item => <div key={item.id} className={`rounded border p-1 text-xs ${item.status === "CANCELLED" ? "border-red-700 bg-red-950/40 text-red-300" : "border-accent bg-accent/10 text-accent"}`}><strong>{item.startTime}–{item.endTime}</strong><br />{item.client.name}<br /><span className="text-[10px]">{item.service.name}</span></div>)}</div>)}</div>)}{!loading && appointments.length === 0 && <p className="p-6 text-center text-zinc-400">Nenhum agendamento nesta semana.</p>}{loading && <p className="p-6 text-center text-zinc-400">Carregando calendário...</p>}</div></div></div>;
}
