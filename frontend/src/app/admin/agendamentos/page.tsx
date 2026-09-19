"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/status-badge";
import { AppointmentStatus } from "@/types";
import { Edit, MoreVertical } from "lucide-react";

export default function AdminAgendamentos() {
  const [agendamentos] = useState([
    { id: '1', client: 'Rafael Costa', date: '15/10/2026', time: '14:00', service: 'Tatuagem Realismo', status: AppointmentStatus.CONFIRMED },
    { id: '2', client: 'Ana Silva', date: '15/10/2026', time: '16:00', service: 'Piercing Septo', status: AppointmentStatus.PENDING },
    { id: '3', client: 'Juliana Santos', date: '16/10/2026', time: '10:00', service: 'Tatuagem Fine Line', status: AppointmentStatus.CANCELLED },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
        <Button>Novo Agendamento</Button>
      </div>

      <Card className="p-4 bg-zinc-900 border-zinc-800 flex flex-col md:flex-row gap-4">
        <Input placeholder="Buscar por cliente..." className="md:w-1/3" />
        <Select>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value={AppointmentStatus.PENDING}>Pendentes</SelectItem>
            <SelectItem value={AppointmentStatus.CONFIRMED}>Confirmados</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="md:w-[200px]" />
      </Card>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-black/50 text-muted uppercase">
            <tr>
              <th className="px-6 py-4">Data e Hora</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Serviço</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {agendamentos.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{item.date} às {item.time}</td>
                <td className="px-6 py-4">{item.client}</td>
                <td className="px-6 py-4">{item.service}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted hover:text-accent p-2"><Edit className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
