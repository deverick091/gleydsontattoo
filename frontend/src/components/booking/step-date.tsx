"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { StepComponentProps } from "@/types";
import { bookingService } from "@/services/booking.service";

export default function StepDate({ data, updateData, onNext }: StepComponentProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(true);

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  useEffect(() => {
    async function loadHours() {
      try {
        setIsLoadingHours(true);
        const hours = await bookingService.getBusinessHours();
        if (hours?.openDays && Array.isArray(hours.openDays)) {
          setOpenDays(hours.openDays);
        }
        if (hours?.closedDates && Array.isArray(hours.closedDates)) {
          setClosedDates(hours.closedDates);
        }
      } catch (err) {
        console.error("Erro ao carregar dias de funcionamento:", err);
      } finally {
        setIsLoadingHours(false);
      }
    }
    loadHours();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Escolha a Data</h2>
        {isLoadingHours && (
          <span className="text-xs text-zinc-500">Verificando dias disponíveis...</span>
        )}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-900 rounded-full text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-900 rounded-full text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-muted">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {days.map((day, i) => {
            const isPast = isBefore(day, today);
            const dayOfWeek = getDay(day); // 0 = Domingo, 1 = Segunda, etc.
            const isDayClosed = !openDays.includes(dayOfWeek);
            const dateStr = format(day, "yyyy-MM-dd");
            const isSpecificDateClosed = closedDates.includes(dateStr);

            const isDisabled = isPast || isDayClosed || isSpecificDateClosed;
            const isSelected = Boolean(data.selectedDate && data.selectedDate.slice(0, 10) === dateStr);
            const isToday = isSameDay(today, day);

            return (
              <button
                key={i}
                disabled={isDisabled}
                onClick={() => {
                  updateData({ selectedDate: dateStr });
                  setTimeout(onNext, 300);
                }}
                title={
                  isPast
                    ? "Data no passado"
                    : isDayClosed || isSpecificDateClosed
                    ? "Estúdio fechado neste dia"
                    : "Disponível para agendamento"
                }
                className={`h-10 w-full rounded-lg text-sm font-medium transition-colors flex items-center justify-center
                  ${isDisabled ? 'text-zinc-700 cursor-not-allowed opacity-40 bg-zinc-900/30' : 'text-white hover:bg-zinc-800 cursor-pointer'}
                  ${isSelected ? 'bg-accent text-black hover:bg-accent font-bold' : ''}
                  ${isToday && !isSelected && !isDisabled ? 'text-accent border border-accent' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 inline-block" />
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-zinc-900/50 opacity-40 inline-block border border-zinc-800" />
            <span>Fechado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent inline-block" />
            <span>Selecionado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
