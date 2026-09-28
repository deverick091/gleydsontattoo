"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, CheckCircle, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAppointmentService, adminClientService, AdminAppointment } from "@/services/admin.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const defaultWeeklyData = [
  { name: 'Seg', Agendamentos: 4 },
  { name: 'Ter', Agendamentos: 3 },
  { name: 'Qua', Agendamentos: 2 },
  { name: 'Qui', Agendamentos: 6 },
  { name: 'Sex', Agendamentos: 8 },
  { name: 'Sáb', Agendamentos: 9 },
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [clientCount, setClientCount] = useState<number>(24);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aptRes, cliRes] = await Promise.all([
        adminAppointmentService.list({ limit: "20" }),
        adminClientService.list({ limit: "50" }),
      ]);
      setAppointments(aptRes.data || []);
      setClientCount(cliRes.data?.length || 24);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((a) => a.date.slice(0, 10) === todayStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400">Resumo de desempenho e próximos atendimentos do estúdio.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Agendamentos Hoje</CardTitle>
            <CalendarCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {todayAppointments.length > 0 ? todayAppointments.length : appointments.length}
            </div>
            <p className="text-xs text-muted">
              {todayAppointments.length > 0 ? "Para o dia de hoje" : "Agendados recentemente"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Clientes Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clientCount}</div>
            <p className="text-xs text-muted text-success">+12% vs último mês</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Faturamento Previsto</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 8.450</div>
            <p className="text-xs text-muted text-success">+4.5% vs último mês</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Taxa de Presença</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94%</div>
            <p className="text-xs text-muted">Excelente comparecimento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Fluxo de Agendamentos Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a'}} />
                <Bar dataKey="Agendamentos" fill="#C9A96E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-white">Próximos Agendamentos</CardTitle>
            <Link href="/admin/agendamentos" className="text-xs text-accent hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">Nenhum agendamento pendente.</p>
              ) : (
                appointments.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-white text-sm">{item.client.name}</p>
                      <p className="text-xs text-muted">{item.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent text-sm">{item.startTime}</p>
                      <p className="text-xs text-zinc-400 capitalize">{item.status.toLowerCase()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
