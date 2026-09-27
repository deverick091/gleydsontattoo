"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminClient, adminClientService } from "@/services/admin.service";
import { Search, RefreshCw, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminClientes() {
  const [items, setItems] = useState<AdminClient[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminClient | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const result = await adminClientService.list({ limit: "50", ...(query ? { query } : {}) }); setItems(result.data); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar os clientes."); }
    finally { setLoading(false); }
  }, [query]);
  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);

  async function openProfile(id: string) { try { setSelected(await adminClientService.get(id)); } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível carregar o perfil."); } }
  function whatsapp(phone: string) { window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank", "noopener,noreferrer"); }

  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl font-bold text-white">Clientes</h1><Button onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button></div>
    <Card className="p-4 bg-zinc-900 border-zinc-800"><div className="relative max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" /><Input className="pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome, telefone ou e-mail" /></div></Card>
    {error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}<Button variant="ghost" className="ml-3" onClick={load}>Tentar novamente</Button></div>}
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm text-zinc-300"><thead className="bg-black/50 text-muted uppercase"><tr><th className="px-6 py-4">Nome</th><th className="px-6 py-4">Telefone</th><th className="px-6 py-4">E-mail</th><th className="px-6 py-4">Agendamentos</th><th className="px-6 py-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-zinc-800">{loading ? <tr><td colSpan={5} className="px-6 py-10 text-center">Carregando...</td></tr> : items.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center">Nenhum cliente encontrado.</td></tr> : items.map(item => <tr key={item.id}><td className="px-6 py-4 font-medium text-white">{item.name}</td><td className="px-6 py-4">{item.phone}</td><td className="px-6 py-4">{item.email || "—"}</td><td className="px-6 py-4">{item.appointments?.length ?? 0}</td><td className="px-6 py-4 text-right"><Button variant="outline" size="sm" onClick={() => openProfile(item.id)}>Perfil</Button><Button aria-label="Abrir WhatsApp" variant="ghost" size="sm" onClick={() => whatsapp(item.whatsapp || item.phone)}><MessageCircle className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>
    <Dialog open={Boolean(selected)} onOpenChange={open => !open && setSelected(null)}><DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <div className="space-y-4 text-sm text-zinc-300"><p>{selected.phone} · {selected.email || "sem e-mail"}</p><p className="text-white font-medium">Histórico de agendamentos</p>{selected.appointments?.length ? selected.appointments.map(item => <div key={item.id} className="border-b border-zinc-800 pb-2">{item.date} às {item.startTime} — {item.service.name}</div>) : <p>Nenhum agendamento registrado.</p>}</div>}</DialogContent></Dialog>
  </div>;
}
