"use client";

import { Check } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { StepComponentProps } from "@/types";

export default function StepService({ data, updateData, onNext }: StepComponentProps) {
  const services = [
    { id: '1', name: 'Tatuagem', description: 'Tatuagem personalizada', duration: 'A partir de 1h', price: 'A partir de R$ 200' },
    { id: '2', name: 'Piercing', description: 'Perfuração asséptica', duration: '30 min', price: 'A partir de R$ 80' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Qual serviço você deseja?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = data.serviceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => {
                updateData({ serviceId: service.id, serviceName: service.name });
                setTimeout(onNext, 300);
              }}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected ? 'border-accent bg-accent/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-muted text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">{service.duration}</span>
                <span className="text-accent font-semibold">{service.price}</span>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 bg-accent text-black rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
