import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

/**
 * Converte com segurança uma string 'yyyy-MM-dd' em Date no horário local (meio-dia),
 * evitando qualquer deslocamento de fuso horário UTC (ex: UTC-3 voltando 1 dia).
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const clean = dateStr.slice(0, 10);
  const [year, month, day] = clean.split('-').map(Number);
  if (!year || !month || !day) return new Date(dateStr);
  return new Date(year, month - 1, day, 12, 0, 0);
}
