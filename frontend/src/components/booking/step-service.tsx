"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bookingService } from "@/services/booking.service";
import type { BookingService, StepComponentProps } from "@/types";

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours && minutes) return `${hours}h ${minutes} min`;
  if (hours) return `${hours}h`;
  return `${minutes} min`;
}

function formatPrice(service: BookingService) {
  if (service.priceType === "CONSULTATION") return "Sob consulta";

  const price = service.priceMin ?? service.priceMax;
  if (price === null || price === undefined) return "Sob consulta";

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(price));

  return service.priceType === "STARTING_AT" ? `A partir de ${formatted}` : formatted;
}

export default function StepService({ data, updateData, onNext }: StepComponentProps) {
  const [services, setServices] = useState<BookingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setServices(await bookingService.getServices());
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Não foi possível carregar os serviços.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Qual serviço você deseja?</h2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-48 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="Não foi possível carregar os serviços"
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => void loadServices()}
        />
      )}

      {!isLoading && !error && services.length === 0 && (
        <EmptyState
          title="Nenhum serviço disponível"
          description="Não há serviços disponíveis para agendamento neste momento."
        />
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => {
            const isSelected = data.serviceId === service.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  updateData({ serviceId: service.id, serviceName: service.name });
                  window.setTimeout(onNext, 300);
                }}
                className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <h3 className="mb-2 text-xl font-bold text-white">{service.name}</h3>
                <p className="mb-4 text-sm text-muted">{service.description ?? "Serviço personalizado"}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{formatDuration(service.duration)}</span>
                  <span className="font-semibold text-accent">{formatPrice(service)}</span>
                </div>

                {isSelected && (
                  <span className="absolute right-4 top-4 rounded-full bg-accent p-1 text-black">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
