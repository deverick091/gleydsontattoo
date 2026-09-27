"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: "1", name: "Gleydson", email: "admin@gleydsontattoo.com", role: "Administrador" },
    { id: "2", name: "Atendimento", email: "recepcao@gleydsontattoo.com", role: "Atendente" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Tatuador" });

  const openNew = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "Tatuador" });
    setDialogOpen(true);
  };

  const openEdit = (user: UserItem) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nome e e-mail são obrigatórios.");
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
      );
      toast.success("Usuário atualizado com sucesso!");
    } else {
      setUsers((prev) => [
        ...prev,
        { id: String(Date.now()), name: form.name, email: form.email, role: form.role },
      ]);
      toast.success("Usuário adicionado com sucesso!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === "1") {
      toast.error("Não é possível excluir o usuário administrador principal.");
      return;
    }
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("Usuário removido.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Usuários do Sistema</h1>
          <p className="text-sm text-zinc-400">Controle de acesso dos profissionais e equipe do estúdio.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-black/50 text-muted uppercase">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Nível de Acesso</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
                      <Edit className="w-4 h-4 text-zinc-400 hover:text-white" />
                    </Button>
                    {user.id !== "1" && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-zinc-300">Nome</label>
              <Input
                placeholder="Ex: Maria Tatuadora"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">E-mail</label>
              <Input
                type="email"
                placeholder="maria@gleydsontattoo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Nível de Acesso</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent mt-1"
              >
                <option value="Administrador">Administrador</option>
                <option value="Tatuador">Tatuador</option>
                <option value="Body Piercer">Body Piercer</option>
                <option value="Atendente">Atendente</option>
              </select>
            </div>
            <Button onClick={handleSave} className="w-full mt-4">
              Salvar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

