"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bookingService } from "@/services/booking.service";
import type { BookingTimeSlot, StepComponentProps } from "@/types";

export default function StepTime({ data, updateData, onNext }: StepComponentProps) {
  const [slots, setSlots] = useState<BookingTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedDate = data.selectedDate?.slice(0, 10);
  const canLoadSlots = Boolean(selectedDate);
  const dateFormatted = data.selectedDate
    ? format(new Date(data.selectedDate), "dd 'de' MMMM", { locale: ptBR })
    : "Data não selecionada";

  const loadSlots = async () => {
    if (!selectedDate || !data.professionalId) {
      setSlots([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSlots(await bookingService.getAvailableSlots(data.professionalId, selectedDate));
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Não foi possível carregar os horários.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.professionalId, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-white">Escolha o Horário</h2>
        <p className="capitalize text-muted">{dateFormatted}</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-14 rounded-xl" />)}
        </div>
      )}

      {!isLoading && !canLoadSlots && (
        <EmptyState title="Selecione os dados anteriores" description="Escolha um profissional e uma data antes de consultar os horários." />
      )}

      {!isLoading && canLoadSlots && error && (
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="Não foi possível carregar os horários"
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => void loadSlots()}
        />
      )}

      {!isLoading && canLoadSlots && !error && slots.length === 0 && (
        <EmptyState title="Nenhum horário disponível" description="Tente escolher outra data ou profissional." />
      )}

      {!isLoading && canLoadSlots && !error && slots.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {slots.map((slot) => {
            const isSelected = data.selectedTime === slot.startTime;

            return (
              <button
                key={slot.startTime}
                type="button"
                onClick={() => {
                  updateData({ selectedTime: slot.startTime });
                  window.setTimeout(onNext, 300);
                }}
                className={`rounded-xl p-4 text-lg font-bold transition-all ${
                  isSelected
                    ? "bg-accent text-black"
                    : "border border-zinc-800 bg-zinc-950 text-white hover:border-accent hover:bg-zinc-900"
                }`}
              >
                {slot.startTime}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
