"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { BookingData } from "@/types";

interface SectionProps {
  title: string;
  content: string;
  step: number;
  onEdit: (step: number) => void;
}

interface StepSummaryProps {
  data: BookingData;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

const Section = ({ title, content, step, onEdit }: SectionProps) => (
  <div className="flex justify-between items-start py-4 border-b border-zinc-800 last:border-0">
    <div>
      <p className="text-sm text-muted mb-1">{title}</p>
      <p className="text-white font-medium capitalize">{content}</p>
    </div>
    <button
      onClick={() => onEdit(step)}
      className="p-2 text-muted hover:text-accent transition-colors"
    >
      <Edit2 className="w-4 h-4" />
    </button>
  </div>
);

export default function StepSummary({ data, onEdit, onConfirm }: StepSummaryProps) {
  const dateFormatted = data.selectedDate
    ? format(new Date(data.selectedDate), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Resumo do Agendamento</h2>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <Section title="Serviço" content={data.serviceName} step={0} onEdit={onEdit} />
        <Section title="Profissional" content={data.professionalName} step={1} onEdit={onEdit} />
        <Section title="Data" content={dateFormatted} step={2} onEdit={onEdit} />
        <Section title="Horário" content={data.selectedTime} step={3} onEdit={onEdit} />

        <div className="flex justify-between items-start py-4">
          <div>
            <p className="text-sm text-muted mb-1">Seus Dados</p>
            <p className="text-white font-medium">{data.clientName}</p>
            <p className="text-zinc-400 text-sm mt-1">{data.clientPhone}</p>
            <p className="text-zinc-400 text-sm mt-1">{data.clientEmail}</p>
          </div>
          <button
            onClick={() => onEdit(4)}
            className="p-2 text-muted hover:text-accent transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="terms"
          className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent accent-accent"
        />
        <label htmlFor="terms" className="text-sm text-muted">
          Li e concordo com a Política de Cancelamento e Privacidade do estúdio.
        </label>
      </div>

      <Button size="lg" className="w-full h-14 text-lg" onClick={onConfirm}>
        Confirmar Agendamento
      </Button>
    </div>
  );
}
