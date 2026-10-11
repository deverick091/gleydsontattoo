"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, ExternalLink, Calendar, Clock, Save } from "lucide-react";
import toast from "react-hot-toast";
import { adminSettingsService, BusinessHoursSetting } from "@/services/admin.service";

const DAYS_OF_WEEK = [
  { dayIndex: 0, label: "Domingo", short: "Dom" },
  { dayIndex: 1, label: "Segunda-feira", short: "Seg" },
  { dayIndex: 2, label: "Terça-feira", short: "Ter" },
  { dayIndex: 3, label: "Quarta-feira", short: "Qua" },
  { dayIndex: 4, label: "Quinta-feira", short: "Qui" },
  { dayIndex: 5, label: "Sexta-feira", short: "Sex" },
  { dayIndex: 6, label: "Sábado", short: "Sáb" },
];

export default function AdminConfiguracoes() {
  const [copiedBooking, setCopiedBooking] = useState(false);
  const [copiedBudget, setCopiedBudget] = useState(false);
  const [origin, setOrigin] = useState("");

  // Dias e horários de funcionamento
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [workStartHour, setWorkStartHour] = useState<number>(9);
  const [workEndHour, setWorkEndHour] = useState<number>(19);
  const [savingHours, setSavingHours] = useState(false);
  const [loadingHours, setLoadingHours] = useState(true);

  // Dados do estúdio
  const [studioName, setStudioName] = useState("Gleydson Tattoo");
  const [studioPhone, setStudioPhone] = useState("(91) 99999-9999");
  const [studioAddress, setStudioAddress] = useState("R. Domingos Silva, 84 - Barcarena, PA");
  const [cancellationPolicy, setCancellationPolicy] = useState("Cancelamentos devem ser feitos com 48h de antecedência.");
  const [savingStudio, setSavingStudio] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }

    async function loadSettings() {
      try {
        setLoadingHours(true);
        const [hoursRes, studioRes] = await Promise.all([
          adminSettingsService.getBusinessHours(),
          adminSettingsService.getStudioInfo(),
        ]);

        if (hoursRes?.openDays) {
          setOpenDays(hoursRes.openDays);
        }
        if (hoursRes?.workStartHour) setWorkStartHour(hoursRes.workStartHour);
        if (hoursRes?.workEndHour) setWorkEndHour(hoursRes.workEndHour);

        if (studioRes?.name) setStudioName(studioRes.name);
        if (studioRes?.phone) setStudioPhone(studioRes.phone);
        if (studioRes?.address) setStudioAddress(studioRes.address);
        if (studioRes?.cancellationPolicy) setCancellationPolicy(studioRes.cancellationPolicy);
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      } finally {
        setLoadingHours(false);
      }
    }

    loadSettings();
  }, []);

  const bookingLink = origin ? `${origin}/agendar` : "/agendar";
  const budgetLink = origin ? `${origin}/orcamento` : "/orcamento";

  const handleCopy = (link: string, isBooking: boolean) => {
    navigator.clipboard.writeText(link);
    if (isBooking) {
      setCopiedBooking(true);
      setTimeout(() => setCopiedBooking(false), 2000);
    } else {
      setCopiedBudget(true);
      setTimeout(() => setCopiedBudget(false), 2000);
    }
    toast.success("Link copiado para a área de transferência!");
  };

  const toggleDay = (dayIndex: number) => {
    setOpenDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort();
      }
    });
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await adminSettingsService.updateBusinessHours({
        openDays,
        workStartHour,
        workEndHour,
      });
      toast.success("Dias e horários de funcionamento atualizados com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar horários");
    } finally {
      setSavingHours(false);
    }
  };

  const handleSaveStudioInfo = async () => {
    setSavingStudio(true);
    try {
      await adminSettingsService.updateStudioInfo({
        name: studioName,
        phone: studioPhone,
        address: studioAddress,
        cancellationPolicy,
      });
      toast.success("Dados do estúdio salvos com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar dados do estúdio");
    } finally {
      setSavingStudio(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Defina os dias de atendimento do estúdio, links de agendamento e informações gerais.
        </p>
      </div>

      {/* DIAS DE ATENDIMENTO E HORÁRIOS */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" /> Dias de Funcionamento do Estúdio
            </h3>
            <p className="text-zinc-400 text-sm mt-1">
              Selecione quais dias o estúdio está <strong>aberto</strong> ou <strong>fechado</strong>. Os dias desativados ficarão bloqueados no calendário de agendamento dos clientes.
            </p>
          </div>
        </div>

        {loadingHours ? (
          <p className="text-zinc-500 text-sm py-4">Carregando horários do estúdio...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAYS_OF_WEEK.map(({ dayIndex, label }) => {
                const isOpen = openDays.includes(dayIndex);
                return (
                  <div
                    key={dayIndex}
                    onClick={() => toggleDay(dayIndex)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isOpen
                        ? "bg-zinc-950 border-emerald-500/40 hover:border-emerald-500"
                        : "bg-zinc-950/60 border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${isOpen ? "text-white" : "text-zinc-400"}`}>
                        {label}
                      </p>
                      <span className={`text-xs ${isOpen ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
                        {isOpen ? "Aberto para agendamentos" : "Fechado"}
                      </span>
                    </div>
                    <Switch
                      checked={isOpen}
                      onCheckedChange={() => toggleDay(dayIndex)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1">
                  Horário de Início do Atendimento
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={workStartHour}
                    onChange={e => setWorkStartHour(Number(e.target.value))}
                    className="bg-zinc-950 border-zinc-800 text-white w-28"
                  />
                  <span className="text-sm text-zinc-400">:00 horas</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1">
                  Horário de Término do Atendimento
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={workEndHour}
                    onChange={e => setWorkEndHour(Number(e.target.value))}
                    className="bg-zinc-950 border-zinc-800 text-white w-28"
                  />
                  <span className="text-sm text-zinc-400">:00 horas</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveHours}
                disabled={savingHours}
                className="bg-accent hover:bg-accent/90 text-black font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {savingHours ? "Salvando..." : "Salvar Dias e Horários"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* LINKS PÚBLICOS */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Links Públicos do Sistema</h3>
          <p className="text-zinc-400 text-sm mt-2">
            Copie os links abaixo para enviar aos seus clientes ou colocar na bio do Instagram / redes sociais.
          </p>
        </div>

        {/* Link de Agendamento */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white block">Link Direto de Agendamento:</label>
          <div className="flex gap-2">
            <Input readOnly value={bookingLink} className="bg-zinc-800 font-mono text-zinc-200 h-11" />
            <Button onClick={() => handleCopy(bookingLink, true)} variant="secondary" className="min-w-[130px] h-11">
              {copiedBooking ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedBooking ? "Copiado!" : "Copiar Link"}
            </Button>
            <Button asChild variant="outline" className="h-11 px-3">
              <a href={bookingLink} target="_blank" rel="noopener noreferrer" title="Abrir página">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Link de Orçamento */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <label className="text-sm font-medium text-white block">Link para Solicitação de Orçamento:</label>
          <div className="flex gap-2">
            <Input readOnly value={budgetLink} className="bg-zinc-800 font-mono text-zinc-200 h-11" />
            <Button onClick={() => handleCopy(budgetLink, false)} variant="secondary" className="min-w-[130px] h-11">
              {copiedBudget ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedBudget ? "Copiado!" : "Copiar Link"}
            </Button>
            <Button asChild variant="outline" className="h-11 px-3">
              <a href={budgetLink} target="_blank" rel="noopener noreferrer" title="Abrir página">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* DADOS DO ESTÚDIO */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Dados do Estúdio</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nome do Estúdio</label>
            <Input
              value={studioName}
              onChange={e => setStudioName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">WhatsApp de Contato</label>
            <Input
              value={studioPhone}
              onChange={e => setStudioPhone(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Endereço</label>
            <Input
              value={studioAddress}
              onChange={e => setStudioAddress(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 pt-4">Políticas</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Política de Cancelamento</label>
          <Textarea
            value={cancellationPolicy}
            onChange={e => setCancellationPolicy(e.target.value)}
            className="h-32 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <Button
          onClick={handleSaveStudioInfo}
          disabled={savingStudio}
          className="w-full md:w-auto bg-accent hover:bg-accent/90 text-black font-semibold"
        >
          {savingStudio ? "Salvando..." : "Salvar Configurações do Estúdio"}
        </Button>
      </div>
    </div>
  );
}
