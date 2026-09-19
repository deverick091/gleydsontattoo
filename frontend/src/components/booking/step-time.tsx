"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { StepComponentProps } from "@/types";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function StepTime({ data, updateData, onNext }: StepComponentProps) {
  const dateFormatted = data.selectedDate
    ? format(new Date(data.selectedDate), "dd 'de' MMMM", { locale: ptBR })
    : "Data não selecionada";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha o Horário</h2>
        <p className="text-muted capitalize">{dateFormatted}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TIME_SLOTS.map((time) => {
          const isSelected = data.selectedTime === time;

          return (
            <button
              key={time}
              onClick={() => {
                updateData({ selectedTime: time });
                setTimeout(onNext, 300);
              }}
              className={`p-4 rounded-xl font-bold text-lg transition-all ${
                isSelected
                  ? 'bg-accent text-black'
                  : 'bg-zinc-950 border border-zinc-800 text-white hover:border-accent hover:bg-zinc-900'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
