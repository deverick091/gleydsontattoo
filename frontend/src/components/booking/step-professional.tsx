"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw, Star } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bookingService } from "@/services/booking.service";
import type { BookingProfessional, StepComponentProps } from "@/types";

export default function StepProfessional({ data, updateData, onNext }: StepComponentProps) {
  const [professionals, setProfessionals] = useState<BookingProfessional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfessionals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProfessionals(await bookingService.getProfessionals());
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Não foi possível carregar os profissionais.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfessionals();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Escolha o Profissional</h2>

      {isLoading && (
        <div className="grid gap-4">
          {Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-48 rounded-xl" />)}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="Não foi possível carregar os profissionais"
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => void loadProfessionals()}
        />
      )}

      {!isLoading && !error && professionals.length === 0 && (
        <EmptyState title="Nenhum profissional disponível" description="Não há profissionais disponíveis para agendamento." />
      )}

      {!isLoading && !error && professionals.length > 0 && (
        <div className="grid gap-4">
          {professionals.map((professional) => {
            const isSelected = data.professionalId === professional.id;

            return (
              <button
                key={professional.id}
                type="button"
                onClick={() => {
                  updateData({ professionalId: professional.id, professionalName: professional.name });
                  window.setTimeout(onNext, 300);
                }}
                className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                  isSelected ? "border-accent bg-accent/5" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="h-24 w-24 flex-shrink-0 rounded-full border-2 border-accent bg-zinc-800" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="mb-2 text-xl font-bold text-white">{professional.name}</h3>
                    <div className="mb-3 flex items-center justify-center gap-1 text-sm font-medium text-accent sm:justify-start">
                      <Star className="h-4 w-4 fill-current" /> Profissional
                    </div>
                    <p className="mb-4 text-sm text-muted">{professional.bio ?? "Especialista em tatuagens exclusivas."}</p>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {professional.specialties.map((specialty) => (
                        <span key={specialty} className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-white">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
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
