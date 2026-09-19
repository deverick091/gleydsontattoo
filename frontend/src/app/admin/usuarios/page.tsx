"use client";

import { Button } from "@/components/ui/button";

export default function AdminUsuarios() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Usuários do Sistema</h1>
        <Button>Adicionar Usuário</Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-black/50 text-muted uppercase">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Nível</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="hover:bg-zinc-800/50">
              <td className="px-6 py-4 font-medium text-white">Gleydson</td>
              <td className="px-6 py-4">admin@gleydsontattoo.com</td>
              <td className="px-6 py-4 text-accent">Administrador</td>
              <td className="px-6 py-4 text-right">
                <Button variant="outline" size="sm">Editar</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
