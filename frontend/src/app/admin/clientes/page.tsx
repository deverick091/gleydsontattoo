"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

export default function AdminClientes() {
  const clientes = [
    { id: 1, name: "João Silva", phone: "(91) 98888-8888", email: "joao@email.com", totalAppointments: 3, lastVisit: "10/09/2026" },
    { id: 2, name: "Maria Costa", phone: "(91) 97777-7777", email: "maria@email.com", totalAppointments: 1, lastVisit: "15/10/2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Clientes</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <Input className="pl-10" placeholder="Buscar por nome, email ou telefone..." />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-black/50 text-muted uppercase">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4 text-center">Agendamentos</th>
              <th className="px-6 py-4">Última Visita</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                <td className="px-6 py-4">
                  <p>{c.phone}</p>
                  <p className="text-xs text-muted">{c.email}</p>
                </td>
                <td className="px-6 py-4 text-center">{c.totalAppointments}</td>
                <td className="px-6 py-4">{c.lastVisit}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-accent"><Eye className="w-4 h-4 mr-2"/> Perfil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
