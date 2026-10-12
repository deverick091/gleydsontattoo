"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminBudget, adminBudgetService } from "@/services/admin.service";
import { BudgetStatus } from "@/types";
import { MessageCircle, RefreshCw, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const statusConfig: Record<BudgetStatus, { label: string; badgeClass: string }> = {
  PENDING: { label: "Pendente", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  RESPONDED: { label: "Respondido", badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  CONVERTED: { label: "Convertido", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Recusado", badgeClass: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminOrcamentos() {
  const [items, setItems] = useState<AdminBudget[]>([]);
  const [status, setStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<AdminBudget | null>(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminBudgetService.list({
        limit: "50",
        ...(status !== "todos" ? { status } : {}),
      });
      const list = Array.isArray(result) ? result : result.data || [];
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar os orçamentos.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveResponse() {
    if (!responding || !response.trim()) return;
    setSaving(true);
    try {
      await adminBudgetService.respond(responding.id, response.trim());
      toast.success("Resposta registrada com sucesso!");
      setResponding(null);
      setResponse("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível registrar a resposta.");
    } finally {
      setSaving(false);
    }
  }

  function whatsapp(item: any) {
    const rawPhone = item.whatsapp || item.phone || item.client?.phone || "";
    const phone = rawPhone.replace(/\D/g, "");
    if (!phone) {
      toast.error("Cliente sem número de WhatsApp cadastrado.");
      return;
    }
    const name = item.name || item.clientName || item.client?.name || "Cliente";
    const text = response || `Olá, ${name}! Tudo bem? Sou do Gleydson Tattoo Studio e recebemos sua solicitação de orçamento.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function updateStatus(item: AdminBudget, newStatus: BudgetStatus) {
    try {
      if (newStatus === BudgetStatus.CONVERTED) {
        await adminBudgetService.convert(item.id);
        toast.success("Orçamento aprovado e agendado com sucesso no Calendário!");
      } else {
        await adminBudgetService.updateStatus(item.id, newStatus);
        toast.success("Status atualizado com sucesso.");
      }
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o status.");
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Orçamentos</h1>
          <p className="text-sm text-zinc-400 mt-1">Gerencie as solicitações de clientes para serviços sob orçamento.</p>
        </div>
        <Button onClick={load} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Card className="p-4 bg-zinc-900 border-zinc-800 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">Filtrar por Status:</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px] bg-zinc-950 border-zinc-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.values(BudgetStatus).map(value => (
                <SelectItem key={value} value={value}>
                  {statusConfig[value]?.label || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-zinc-500">
          Total: {items.length} {items.length === 1 ? "solicitação" : "solicitações"}
        </div>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={load}>Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 text-zinc-500">
          Carregando orçamentos...
        </div>
      ) : items.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
          <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">Nenhum orçamento encontrado</h3>
          <p className="text-sm text-zinc-400">
            {status !== "todos"
              ? "Não há solicitações com o status selecionado."
              : "Quando clientes solicitarem orçamentos de serviços 'sob orçamento', eles aparecerão aqui."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map(item => {
            const clientName = (item as any).name || (item as any).clientName || item.client?.name || "Cliente";
            const phone = (item as any).whatsapp || (item as any).phone || item.client?.phone || "";
            const email = (item as any).email || item.client?.email || "";
            const currentConfig = statusConfig[item.status] || { label: item.status, badgeClass: "bg-zinc-800 text-zinc-300" };

            return (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{clientName}</h3>
                      {phone && <p className="text-sm text-accent font-medium mt-0.5">WhatsApp: {phone}</p>}
                      {email && <p className="text-xs text-zinc-500">{email}</p>}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${currentConfig.badgeClass}`}>
                      {currentConfig.label}
                    </span>
                  </div>

                  <div className="mt-4 bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 text-sm text-zinc-200 whitespace-pre-line">
                    {item.description || "Sem detalhes adicionais."}
                  </div>

                  {item.adminResponse && (
                    <div className="mt-3 bg-blue-950/30 border border-blue-900/40 rounded-lg p-3 text-xs text-blue-200">
                      <strong className="block text-blue-400 mb-1">Última resposta do estúdio:</strong>
                      {item.adminResponse}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Solicitado em: {formatDate(item.createdAt)}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {phone && (
                      <Button size="sm" className="bg-[#25D366] hover:bg-[#20b858] text-white" onClick={() => whatsapp(item)}>
                        <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setResponding(item);
                        setResponse(item.adminResponse || "");
                      }}
                    >
                      Responder
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.status === BudgetStatus.CONVERTED ? (
                      <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Agendado no Calendário
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30"
                        onClick={() => updateStatus(item, BudgetStatus.CONVERTED)}
                      >
                        <CheckCircle className="mr-1.5 h-4 w-4" /> Aprovar e Agendar
                      </Button>
                    )}
                    {item.status !== BudgetStatus.REJECTED && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        onClick={() => updateStatus(item, BudgetStatus.REJECTED)}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" /> Recusar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Responder */}
      <Dialog open={Boolean(responding)} onOpenChange={open => !open && setResponding(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Registrar Resposta do Orçamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-zinc-400">
              Digite a resposta ou valor estimado para este cliente. O status mudará para <strong>Respondido</strong>.
            </p>
            <Textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Ex: Tatuagem estimada em R$ 450,00 para o tamanho informado..."
              rows={4}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setResponding(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button disabled={saving || !response.trim()} onClick={saveResponse}>
              {saving ? "Salvando..." : "Salvar Resposta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
