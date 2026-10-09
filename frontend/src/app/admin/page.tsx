"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAppointmentService, adminDashboardService, AdminAppointment } from "@/services/admin.service";
import { AppointmentStatus } from "@/types";

interface DashboardStats {
  todayCount: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  todayAppointments: AdminAppointment[];
  weekData: { name: string; Agendamentos: number }[];
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function toLocalDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await adminDashboardService.getStats();
        setStats(result);
      } catch (e) {
        console.error('Erro ao carregar dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Agendamentos Hoje</CardTitle>
            <CalendarCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : stats?.todayCount ?? 0}
            </div>
            <p className="text-xs text-muted">agendamentos para hoje</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : stats?.pendingCount ?? 0}
            </div>
            <p className="text-xs text-muted">aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Confirmados</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : stats?.confirmedCount ?? 0}
            </div>
            <p className="text-xs text-muted">agendamentos confirmados</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Concluídos</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : stats?.completedCount ?? 0}
            </div>
            <p className="text-xs text-muted">serviços realizados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Agendamentos — Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-zinc-500">Carregando...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weekData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }} />
                  <Bar dataKey="Agendamentos" fill="#C9A96E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Próximos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-zinc-500 text-sm">Carregando...</p>
            ) : !stats?.todayAppointments.length ? (
              <p className="text-zinc-500 text-sm">Nenhum agendamento para hoje.</p>
            ) : (
              <div className="space-y-4">
                {stats.todayAppointments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-white">{item.client.name}</p>
                      <p className="text-sm text-muted">{item.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">{item.startTime}</p>
                      <p className="text-xs text-muted capitalize">{item.status.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
