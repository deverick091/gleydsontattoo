"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminBudget, adminBudgetService } from "@/services/admin.service";
import { BudgetStatus } from "@/types";
import { MessageCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const labels: Record<BudgetStatus, string> = { PENDING: "Pendente", RESPONDED: "Respondido", CONVERTED: "Convertido", REJECTED: "Recusado" };

export default function AdminOrcamentos() {
  const [items, setItems] = useState<AdminBudget[]>([]);
  const [status, setStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<AdminBudget | null>(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const result = await adminBudgetService.list({ limit: "50", ...(status !== "todos" ? { status } : {}) }); setItems(result.data); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar os orçamentos."); } finally { setLoading(false); } }, [status]);
  useEffect(() => { load(); }, [load]);
  async function saveResponse() { if (!responding || !response.trim()) return; setSaving(true); try { await adminBudgetService.respond(responding.id, response.trim()); toast.success("Resposta registrada."); setResponding(null); setResponse(""); await load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível responder."); } finally { setSaving(false); } }
  function whatsapp(item: AdminBudget) { const phone = item.whatsapp.replace(/\D/g, ""); const text = response || `Olá, ${item.name}! Recebemos sua solicitação de orçamento.`; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); }
  async function reject(item: AdminBudget) { try { await adminBudgetService.updateStatus(item.id, BudgetStatus.REJECTED); toast.success("Orçamento recusado."); await load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o orçamento."); } }

  return <div className="space-y-6"><div className="flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl font-bold text-white">Orçamentos</h1><Button onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button></div><Card className="p-4 bg-zinc-900 border-zinc-800"><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-[220px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem>{Object.values(BudgetStatus).map(value => <SelectItem key={value} value={value}>{labels[value]}</SelectItem>)}</SelectContent></Select></Card>{error && <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}<Button variant="ghost" className="ml-3" onClick={load}>Tentar novamente</Button></div>}<div className="grid gap-5 lg:grid-cols-2">{loading ? <p>Carregando...</p> : items.length === 0 ? <p className="text-zinc-400">Nenhum orçamento encontrado.</p> : items.map(item => <Card key={item.id} className="bg-zinc-900 border-zinc-800 p-5"><div className="flex justify-between gap-3"><div><h3 className="text-lg font-semibold text-white">{item.name}</h3><p className="text-sm text-zinc-400">{item.style || "Estilo não informado"} · {item.bodyRegion || "Região não informada"}</p></div><span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-accent">{labels[item.status]}</span></div><p className="mt-4 text-sm text-zinc-300">{item.description || "Sem descrição."}</p><p className="mt-2 text-sm text-zinc-500">WhatsApp: {item.whatsapp}</p><div className="mt-5 flex flex-wrap gap-2"><Button size="sm" onClick={() => whatsapp(item)}><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button><Button size="sm" variant="outline" onClick={() => { setResponding(item); setResponse(item.adminResponse || ""); }}>Responder</Button>{item.status !== BudgetStatus.CONVERTED && <Button size="sm" variant="destructive" onClick={() => reject(item)}>Recusar</Button>}</div></Card>)}</div><Dialog open={Boolean(responding)} onOpenChange={open => !open && setResponding(null)}><DialogContent><DialogHeader><DialogTitle>Responder orçamento</DialogTitle></DialogHeader><Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Escreva a resposta para o cliente" /><Button disabled={saving || !response.trim()} onClick={saveResponse}>{saving ? "Salvando..." : "Salvar resposta"}</Button></DialogContent></Dialog></div>;
}
