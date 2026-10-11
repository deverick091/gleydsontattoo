"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingService } from "@/services/booking.service";
import { BookingService } from "@/types";
import { CheckCircle, MessageCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrcamentoPage() {
  const [services, setServices] = useState<BookingService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [bodyRegion, setBodyRegion] = useState("");
  const [approxSize, setApproxSize] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const list = await bookingService.getServices();
        setServices(list);
        // Pré-seleciona o primeiro que for sob orçamento, se houver
        const budgetService = list.find(s => (s as any).price == null || (s as any).price === 0 || s.priceType === "CONSULTATION");
        if (budgetService) setSelectedServiceId(budgetService.id);
        else if (list.length > 0) setSelectedServiceId(list[0].id);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !description.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedService = services.find(s => s.id === selectedServiceId);
      const serviceName = selectedService ? selectedService.name : "Personalizado";

      const fullDescription = [
        `Serviço: ${serviceName}`,
        bodyRegion ? `Região do corpo: ${bodyRegion}` : null,
        approxSize ? `Tamanho aproximado: ${approxSize}` : null,
        `Ideia / Descrição:\n${description}`,
      ].filter(Boolean).join("\n\n");

      await bookingService.createBudget({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || undefined,
        serviceId: selectedServiceId || undefined,
        description: fullDescription,
      });

      setSuccess(true);
      toast.success("Solicitação de orçamento enviada!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar solicitação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          title="Solicitar Orçamento"
          subtitle="Preencha os detalhes da sua ideia para receber uma estimativa exclusiva diretamente no seu WhatsApp."
        />

        {success ? (
          <div className="bg-zinc-900 border border-emerald-500/30 p-10 md:p-14 rounded-2xl text-center space-y-6 mt-8">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Solicitação Enviada com Sucesso!</h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Olá <strong>{clientName}</strong>, recebemos o seu pedido de orçamento. Nossa equipe entrará em contato pelo WhatsApp ({clientPhone}) em breve com todos os detalhes e valores.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/agendar">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Agendar Outro Horário
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setSuccess(false);
                  setDescription("");
                  setBodyRegion("");
                  setApproxSize("");
                }}
              >
                Enviar Outro Orçamento
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 mt-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">Serviço Desejado *</label>
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full h-12 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {services.map(s => {
                    const isBudget = (s as any).price == null || (s as any).price === 0 || s.priceType === "CONSULTATION";
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} {isBudget ? "(Sob Orçamento)" : `(A partir de R$ ${(s as any).price || s.priceMin})`}
                      </option>
                    );
                  })}
                  <option value="">Outro / Ideia Exclusiva</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Seu Nome *</label>
                  <Input
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="h-12 bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">WhatsApp (com DDD) *</label>
                  <Input
                    required
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="Ex: (91) 98888-0000"
                    className="h-12 bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Email (Opcional)</label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="h-12 bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Região do Corpo</label>
                  <Input
                    value={bodyRegion}
                    onChange={e => setBodyRegion(e.target.value)}
                    placeholder="Ex: Antebraço, Costas, Perna..."
                    className="h-12 bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">Tamanho Aproximado (cm)</label>
                <Input
                  value={approxSize}
                  onChange={e => setApproxSize(e.target.value)}
                  placeholder="Ex: 15cm x 10cm ou tamanho da palma da mão"
                  className="h-12 bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">Descrição da Ideia / Tatuagem *</label>
                <Textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva detalhes como referências, cores (preto e cinza ou colorido), estilo desejado, etc..."
                  rows={4}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-400 space-y-1">
                <p>🔒 Seus dados serão utilizados apenas para entrarmos em contato a respeito deste orçamento.</p>
                <p>💬 O orçamento e as orientações serão enviados diretamente no seu WhatsApp.</p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 text-base font-semibold bg-accent hover:bg-accent/90 text-black flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Enviando solicitação..."
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Enviar Solicitação de Orçamento
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
