"use client";

import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminCalendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Domingo
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 11 }).map((_, i) => i + 9); // 9h as 19h

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Calendário</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">Hoje</Button>
          <div className="flex items-center bg-zinc-900 rounded-md border border-zinc-800 p-1">
            <button className="p-1 hover:text-accent text-muted"><ChevronLeft className="w-5 h-5" /></button>
            <span className="px-4 font-medium text-white min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </span>
            <button className="p-1 hover:text-accent text-muted"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-zinc-800 bg-black/30">
          <div className="p-4 border-r border-zinc-800 text-center text-muted font-medium">Hora</div>
          {weekDays.map((day, i) => (
            <div key={i} className="p-4 border-r border-zinc-800 text-center last:border-r-0">
              <p className="text-xs text-muted uppercase">{format(day, 'E', { locale: ptBR })}</p>
              <p className="text-xl font-bold text-white">{format(day, 'd')}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-zinc-800 min-h-[80px]">
              <div className="p-2 border-r border-zinc-800 text-center text-xs text-muted bg-black/30">
                {hour}:00
              </div>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="border-r border-zinc-800 p-1 last:border-r-0 relative hover:bg-zinc-800/30 transition-colors cursor-pointer">
                  {/* Mock Event */}
                  {hour === 14 && i === 2 && (
                    <div className="absolute top-1 left-1 right-1 bg-accent/20 border border-accent rounded p-1">
                      <p className="text-xs font-bold text-accent">Rafael - Tatuagem</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
