"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { z } from "zod";
import type { StepComponentProps } from "@/types";

const detailsSchema = z.object({
  clientName: z.string().min(3, "Nome completo é obrigatório"),
  clientPhone: z.string().min(10, "Telefone inválido"),
  clientEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  bodyRegion: z.string().min(1, "Região do corpo é obrigatória"),
  approximateSize: z.string().min(1, "Tamanho aproximado é obrigatório"),
  notes: z.string().optional()
});

type ValidationErrors = Record<string, string | null>;

export default function StepDetails({ data, updateData, onNext }: StepComponentProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      detailsSchema.parse({
        clientName: data.clientName || "",
        clientPhone: data.clientPhone || "",
        clientEmail: data.clientEmail || "",
        bodyRegion: data.bodyRegion || "",
        approximateSize: data.approximateSize || "",
        notes: data.notes || ""
      });
      setErrors({});
      onNext();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors: ValidationErrors = {};
        err.errors.forEach((e) => {
          formattedErrors[e.path[0] as string] = e.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Seus Dados e Ideia</h2>
      
      <form id="details-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Nome Completo *</label>
            <Input name="name" value={data.name || ''} onChange={handleChange} error={!!errors.name} placeholder="Seu nome" />
            {errors.name && <p className="text-error text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">WhatsApp / Telefone *</label>
            <Input name="phone" value={data.phone || ''} onChange={handleChange} error={!!errors.phone} placeholder="(00) 00000-0000" />
            {errors.phone && <p className="text-error text-xs">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Região do Corpo *</label>
            <Input name="bodyRegion" value={data.bodyRegion || ''} onChange={handleChange} error={!!errors.bodyRegion} placeholder="Ex: Antebraço" />
            {errors.bodyRegion && <p className="text-error text-xs">{errors.bodyRegion}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Tamanho Aproximado (cm) *</label>
            <Input name="approximateSize" value={data.approximateSize || ''} onChange={handleChange} error={!!errors.approximateSize} placeholder="Ex: 10cm" />
            {errors.approximateSize && <p className="text-error text-xs">{errors.approximateSize}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Descrição da Ideia</label>
          <Textarea 
            name="notes" 
            value={data.notes || ''} 
            onChange={handleChange} 
            placeholder="Conte-nos os detalhes do que você deseja fazer..."
            className="h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Referências (Imagens)</label>
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-950 hover:bg-zinc-900 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-sm text-white font-medium">Clique para fazer upload ou arraste as imagens</p>
            <p className="text-xs text-muted mt-1">PNG, JPG ou WEBP (Max 5MB)</p>
          </div>
        </div>

        <button type="submit" className="hidden" id="submit-details" />
      </form>
    </div>
  );
}
