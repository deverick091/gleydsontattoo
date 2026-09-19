"use client";

import { Check, Star } from "lucide-react";
import { useEffect } from "react";
import type { StepComponentProps } from "@/types";

export default function StepProfessional({ data, updateData, onNext }: StepComponentProps) {
  const professional = {
    id: 'gleydson',
    name: 'Gleydson',
    specialties: ['Realismo', 'Blackwork', 'Fine Line'],
    bio: 'Especialista com mais de 8 anos de experiência em tatuagens exclusivas.',
    rating: 5.0
  };

  useEffect(() => {
    updateData({ professionalId: professional.id, professionalName: professional.name });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Escolha o Profissional</h2>

      <div
        onClick={() => {
          updateData({ professionalId: professional.id, professionalName: professional.name });
          setTimeout(onNext, 300);
        }}
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all border-accent bg-accent/5`}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-accent flex-shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-2">{professional.name}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-3 text-accent text-sm font-medium">
              <Star className="w-4 h-4 fill-current" /> {professional.rating}
            </div>
            <p className="text-muted text-sm mb-4">{professional.bio}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {professional.specialties.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-900 rounded-full text-xs text-white border border-zinc-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-accent text-black rounded-full p-1 hidden sm:block">
          <Check className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
  const professional = {
    id: 'gleydson',
    name: 'Gleydson',
    specialties: ['Realismo', 'Blackwork', 'Fine Line'],
    bio: 'Especialista com mais de 8 anos de experiência em tatuagens exclusivas.',
    rating: 5.0
  };

  useEffect(() => {
    // Auto select if only one
    updateData({ professionalId: professional.id, professionalName: professional.name });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Escolha o Profissional</h2>
      
      <div 
        onClick={() => {
          updateData({ professionalId: professional.id, professionalName: professional.name });
          setTimeout(onNext, 300);
        }}
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all border-accent bg-accent/5`}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-accent flex-shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-2">{professional.name}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-3 text-accent text-sm font-medium">
              <Star className="w-4 h-4 fill-current" /> {professional.rating}
            </div>
            <p className="text-muted text-sm mb-4">{professional.bio}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {professional.specialties.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-900 rounded-full text-xs text-white border border-zinc-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-accent text-black rounded-full p-1 hidden sm:block">
          <Check className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
