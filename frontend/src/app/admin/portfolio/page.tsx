"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AdminPortfolioItem, adminPortfolioService } from "@/services/admin.service";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPortfolio() {
  const [items, setItems] = useState<AdminPortfolioItem[]>([]);
  const [category, setCategory] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminPortfolioItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", categoryId: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); setError(null); try { setItems(await adminPortfolioService.list(category === "todas" ? undefined : category)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar o portfólio."); } finally { setLoading(false); } }, [category]);
  useEffect(() => { load(); }, [load]);
  function openNew() { setEditing(null); setForm({ title: "", description: "", categoryId: "", imageUrl: "" }); }
  function openEdit(item: AdminPortfolioItem) { setEditing(item); setForm({ title: item.title, description: item.description || "", categoryId: item.categoryId, imageUrl: item.imageUrl }); }
  async function save() { if (!form.title.trim() || !form.categoryId.trim() || !form.imageUrl.trim()) { toast.error("Título, categoria e imagem são obrigatórios."); return; } setSaving(true); try { if (editing) await adminPortfolioService.update(editing.id, form); else await adminPortfolioService.create({ ...form, isFeatured: false, isActive: true, order: 0 }); toast.success("Portfólio salvo."); setEditing(null); await load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível salvar."); } finally { setSaving(false); } }
  async function remove(item: AdminPortfolioItem) { if (!window.confirm(`Excluir “${item.title}”?`)) return; try { await adminPortfolioService.delete(item.id); toast.success("Item excluído."); await load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível excluir."); } }

  return <div className="space-y-6"><div className="flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl font-bold text-white">Portfólio</h1><div className="flex gap-2"><Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Adicionar</Button></div></div><Card className="p-4 bg-zinc-900 border-zinc-800"><Select value={category} onValueChange={setCategory}><SelectTrigger className="w-[220px]"><SelectValue placeholder="Categoria" /></SelectTrigger><SelectContent><SelectItem value="todas">Todas as categorias</SelectItem><SelectItem value="tatuagem">Tatuagem</SelectItem><SelectItem value="piercing">Piercing</SelectItem></SelectContent></Select></Card>{error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}<Button variant="ghost" className="ml-3" onClick={load}>Tentar novamente</Button></div>}<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{loading ? <p>Carregando...</p> : items.length === 0 ? <p className="text-zinc-400">Nenhum item encontrado.</p> : items.map(item => <Card key={item.id} className="overflow-hidden bg-zinc-900 border-zinc-800"><div className="aspect-square bg-zinc-800 relative"><Image src={item.imageUrl} alt={item.title} fill className="object-cover" /></div><div className="p-4"><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm text-zinc-400">{item.category?.name || item.categoryId}</p><div className="mt-3 flex justify-end gap-1"><Button aria-label="Editar item" variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button><Button aria-label="Excluir item" variant="ghost" size="sm" onClick={() => remove(item)}><Trash2 className="h-4 w-4 text-red-400" /></Button></div></div></Card>)}</div><Dialog open={editing !== null || form.title !== ""} onOpenChange={open => { if (!open) { setEditing(null); setForm({ title: "", description: "", categoryId: "", imageUrl: "" }); } }}><DialogContent><DialogHeader><DialogTitle>{editing ? "Editar item" : "Novo item"}</DialogTitle></DialogHeader><div className="space-y-3"><Input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /><Input placeholder="Categoria ID" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} /><Input placeholder="URL da imagem" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /><Input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><Button disabled={saving} onClick={save}>{saving ? "Salvando..." : "Salvar"}</Button></div></DialogContent></Dialog></div>;
}
