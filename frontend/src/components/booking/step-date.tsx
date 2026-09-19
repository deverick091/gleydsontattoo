"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, isSunday } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { StepComponentProps } from "@/types";

export default function StepDate({ data, updateData, onNext }: StepComponentProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Escolha a Data</h2>

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
            const isSun = isSunday(day);
            const isDisabled = isPast || isSun;
            const isSelected = data.selectedDate && isSameDay(new Date(data.selectedDate), day);
            const isToday = isSameDay(today, day);

            return (
              <button
                key={i}
                disabled={isDisabled}
                onClick={() => {
                  updateData({ selectedDate: day.toISOString() });
                  setTimeout(onNext, 300);
                }}
                className={`h-10 w-full rounded-lg text-sm font-medium transition-colors flex items-center justify-center
                  ${isDisabled ? 'text-zinc-700 cursor-not-allowed opacity-50' : 'text-white hover:bg-zinc-800 cursor-pointer'}
                  ${isSelected ? 'bg-accent text-black hover:bg-accent' : ''}
                  ${isToday && !isSelected ? 'text-accent border border-accent' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Escolha a Data</h2>
      
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
            const isSun = isSunday(day);
            const isDisabled = isPast || isSun;
            const isSelected = data.selectedDate && isSameDay(new Date(data.selectedDate), day);
            const isToday = isSameDay(today, day);

            return (
              <button
                key={i}
                disabled={isDisabled}
                onClick={() => {
                  updateData({ selectedDate: day.toISOString() });
                  setTimeout(onNext, 300);
                }}
                className={`h-10 w-full rounded-lg text-sm font-medium transition-colors flex items-center justify-center
                  ${isDisabled ? 'text-zinc-700 cursor-not-allowed opacity-50' : 'text-white hover:bg-zinc-800 cursor-pointer'}
                  ${isSelected ? 'bg-accent text-black hover:bg-accent' : ''}
                  ${isToday && !isSelected ? 'text-accent border border-accent' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
