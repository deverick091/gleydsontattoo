"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw, CalendarPlus } from "lucide-react";
import { adminAppointmentService } from "@/services/admin.service";

// ── types ────────────────────────────────────────────────────────────────────

interface RawAppointment {
  id: string;
  date: string;       // "2026-08-11T00:00:00.000Z"  (UTC midnight)
  time: string;       // "14:00"
  status: string;
  clientName: string;
  clientPhone: string;
  client?: { id: string; name: string; phone: string; email?: string | null };
  service?: { id: string; name: string; duration: number };
}

interface CalendarEntry {
  id: string;
  dateKey: string;    // "2026-08-11"
  startTime: string;  // "14:00"
  endTime: string;    // "14:30"  (computed from duration)
  status: string;
  clientName: string;
  serviceName: string;
  duration: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 – 20:00

/** "14:30" → minutes since midnight */
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** add `mins` minutes to a "HH:MM" string */
const addMinutes = (t: string, mins: number): string => {
  const total = toMinutes(t) + mins;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** Extract "yyyy-MM-dd" from any ISO date string, treating as UTC */
const extractDateKey = (isoOrPlain: string): string => {
  // handles "2026-08-11T00:00:00.000Z" and plain "2026-08-11"
  return isoOrPlain.slice(0, 10);
};

const fmtDayKey = (d: Date) => format(d, "yyyy-MM-dd");

const statusColor = (status: string) => {
  switch (status) {
    case "CANCELLED": return "border-red-700 bg-red-950/50 text-red-300";
    case "COMPLETED": return "border-zinc-600 bg-zinc-800/60 text-zinc-400";
    case "CONFIRMED": return "border-green-700 bg-green-950/40 text-green-300";
    default:          return "border-accent bg-accent/10 text-accent"; // PENDING
  }
};

const statusLabel: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminCalendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(startDate, i)),
    [startDate]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch with a wide date window (full week). Backend parseDate creates
      // "T00:00:00.000Z" — we send the first day and last day of the week.
      const startKey = fmtDayKey(startDate);
      const endKey   = fmtDayKey(addDays(startDate, 6));

      const result = await adminAppointmentService.list({
        startDate: startKey,
        endDate:   endKey,
        limit:     "100",
      });

      // result may be paginated { data: [...], pagination: {...} }
      // or a plain array depending on API shape. Cast through unknown to handle
      // the real API shape (which differs from the TypeScript type).
      // eslint-disable-next-line
      const resultAny = result as any;
      const raw: RawAppointment[] = Array.isArray(resultAny)
        ? resultAny
        : Array.isArray(resultAny?.data)
          ? resultAny.data
          : [];

      const mapped: CalendarEntry[] = raw.map((a: any) => {
        const duration = a.service?.duration ?? 60;
        const timeStr = a.startTime || a.time; // Use startTime from backend, fallback to time
        return {
          id:          a.id,
          dateKey:     extractDateKey(a.date),
          startTime:   timeStr,
          endTime:     a.endTime || addMinutes(timeStr, duration),
          status:      a.status,
          clientName:  a.client?.name ?? a.clientName ?? "–",
          serviceName: a.service?.name ?? "–",
          duration,
        };
      });

      setEntries(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar o calendário.");
    } finally {
      setLoading(false);
    }
  }, [startDate]);

  useEffect(() => { load(); }, [load]);

  const entriesFor = (day: Date, hour: number) =>
    entries.filter(
      (e) =>
        e.dateKey === fmtDayKey(day) &&
        toMinutes(e.startTime) >= hour * 60 &&
        toMinutes(e.startTime) < (hour + 1) * 60
    );

  const isToday = (d: Date) => fmtDayKey(d) === fmtDayKey(new Date());

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Calendário</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 font-medium text-white min-w-[140px] text-center capitalize">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="outline" size="sm"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            aria-label="Próxima semana"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={load} aria-label="Atualizar">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-accent/20 border border-accent" /> Pendente</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-950/40 border border-green-700" /> Confirmado</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-zinc-800/60 border border-zinc-600" /> Concluído</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-950/50 border border-red-700" /> Cancelado</span>
      </div>

      {/* Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex-1 overflow-auto">
        <div className="min-w-[750px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-zinc-800 bg-black/30 sticky top-0 z-10">
            <div className="p-3 border-r border-zinc-800 text-center text-zinc-500 text-xs font-medium">
              Hora
            </div>
            {weekDays.map((day) => (
              <div
                key={fmtDayKey(day)}
                className={`p-3 border-r border-zinc-800 text-center ${isToday(day) ? "bg-accent/5" : ""}`}
              >
                <p className="text-xs text-zinc-500 uppercase">
                  {format(day, "EEE", { locale: ptBR })}
                </p>
                <p className={`text-xl font-bold ${isToday(day) ? "text-accent" : "text-white"}`}>
                  {format(day, "d")}
                </p>
              </div>
            ))}
          </div>

          {/* Hour rows */}
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-zinc-800 min-h-[72px]">
              <div className="p-2 border-r border-zinc-800 text-center text-xs text-zinc-500 bg-black/20 flex items-start justify-center pt-2">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDays.map((day) => {
                const dayEntries = entriesFor(day, hour);
                return (
                  <div
                    key={fmtDayKey(day)}
                    className={`border-r border-zinc-800 p-1 relative ${isToday(day) ? "bg-accent/[0.02]" : ""}`}
                  >
                    {dayEntries.map((e) => (
                      <div
                        key={e.id}
                        title={`${e.clientName} — ${e.serviceName}\n${e.startTime}–${e.endTime} (${e.duration}min)\nStatus: ${statusLabel[e.status] ?? e.status}`}
                        className={`rounded border px-1.5 py-1 text-[11px] leading-snug mb-0.5 cursor-default ${statusColor(e.status)}`}
                      >
                        <strong className="font-semibold">{e.startTime}–{e.endTime}</strong>
                        <br />
                        {e.clientName}
                        <br />
                        <span className="opacity-80">{e.serviceName}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty state inside grid */}
          {!loading && entries.length === 0 && (
            <p className="p-8 text-center text-zinc-500 text-sm">
              Nenhum agendamento nesta semana.
            </p>
          )}
          {loading && (
            <p className="p-8 text-center text-zinc-400 text-sm animate-pulse">
              Carregando calendário...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
