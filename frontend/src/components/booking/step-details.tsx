"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { z } from "zod";
import type { StepComponentProps } from "@/types";

const detailsSchema = z.object({
  clientName: z.string().min(3, "Nome completo é obrigatório"),
  clientPhone: z.string().regex(/^\d{10,15}$/, "Telefone inválido"),
  clientEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  notes: z.string().optional()
});

type ValidationErrors = Record<string, string | null>;

export default function StepDetails({ data, updateData, onNext }: StepComponentProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ [name as keyof typeof data]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      detailsSchema.parse({
        clientName: data.clientName || "",
        clientPhone: data.clientPhone || "",
        clientEmail: data.clientEmail || "",
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
      <h2 className="text-2xl font-bold text-white mb-6">Seus Dados</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Nome Completo *</label>
            <Input
              name="clientName"
              value={data.clientName || ''}
              onChange={handleChange}
              error={!!errors.clientName}
              placeholder="Seu nome completo"
            />
            {errors.clientName && <p className="text-error text-xs">{errors.clientName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">WhatsApp / Telefone *</label>
            <Input
              name="clientPhone"
              value={data.clientPhone || ''}
              onChange={handleChange}
              error={!!errors.clientPhone}
              placeholder="(00) 00000-0000"
            />
            {errors.clientPhone && <p className="text-error text-xs">{errors.clientPhone}</p>}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-white">E-mail</label>
            <Input
              name="clientEmail"
              type="email"
              value={data.clientEmail || ''}
              onChange={handleChange}
              error={!!errors.clientEmail}
              placeholder="seu@email.com"
            />
            {errors.clientEmail && <p className="text-error text-xs">{errors.clientEmail}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Observações e Detalhes</label>
          <Textarea
            name="notes"
            value={data.notes || ''}
            onChange={handleChange}
            placeholder="Conte-nos os detalhes do que você deseja..."
            className="h-24"
          />
        </div>

        <button type="submit" className="hidden" />
      </form>
    </div>
  );
}
