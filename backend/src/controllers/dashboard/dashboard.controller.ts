import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Hoje
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        client: true,
        service: true,
      },
      orderBy: {
        time: 'asc',
      },
    });

    // Count por status
    const statusCounts = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;

    statusCounts.forEach(stat => {
      if (stat.status === 'PENDING') pendingCount = stat._count._all;
      if (stat.status === 'CONFIRMED') confirmedCount = stat._count._all;
      if (stat.status === 'COMPLETED') completedCount = stat._count._all;
    });

    // Últimos 7 dias
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weekAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
          lt: tomorrow,
        },
      },
      select: {
        date: true,
      },
    });

    const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      
      const count = weekAppointments.filter(a => {
        const aStr = a.date.toISOString().split('T')[0];
        return aStr === dStr;
      }).length;
      
      weekData.push({ name: DAY_NAMES[d.getDay()], Agendamentos: count });
    }

    const todayCount = todayAppointments.length;

    res.json({
      todayCount,
      pendingCount,
      confirmedCount,
      completedCount,
      todayAppointments: todayAppointments.map(a => ({
        id: a.id,
        clientId: a.clientId,
        serviceId: a.serviceId,
        date: a.date.toISOString().split('T')[0],
        startTime: a.time,
        status: a.status,
        client: {
          id: a.client?.id,
          name: a.clientName || a.client?.name || 'Cliente',
        },
        service: {
          id: a.service?.id,
          name: a.service?.name || 'Serviço',
        }
      })),
      weekData,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [pendingBudgets, pendingAppointments, todayAppointments] = await Promise.all([
      prisma.budget.findMany({
        where: { status: 'PENDING' },
        include: { client: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.appointment.findMany({
        where: { status: 'PENDING' },
        include: { client: true, service: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.appointment.findMany({
        where: {
          date: { gte: today, lt: tomorrow },
          status: { not: 'CANCELLED' },
        },
        include: { client: true, service: true },
        orderBy: { time: 'asc' },
        take: 10,
      }),
    ]);

    const notifications: Array<{
      id: string;
      type: 'budget' | 'appointment' | 'today';
      title: string;
      description: string;
      detail?: string | null;
      date: string;
      link: string;
      isPending: boolean;
    }> = [];

    // Orçamentos pendentes
    for (const b of pendingBudgets) {
      notifications.push({
        id: `budget-${b.id}`,
        type: 'budget',
        title: 'Novo Orçamento Solicitado',
        description: `${b.clientName} enviou solicitação de orçamento.`,
        detail: b.description ? b.description.slice(0, 100) : null,
        date: b.createdAt.toISOString(),
        link: '/admin/orcamentos',
        isPending: true,
      });
    }

    // Agendamentos pendentes
    for (const a of pendingAppointments) {
      const dateFormatted = (a.date instanceof Date ? a.date : new Date(a.date)).toISOString().slice(0, 10).split('-').reverse().join('/');
      notifications.push({
        id: `appointment-${a.id}`,
        type: 'appointment',
        title: 'Novo Agendamento Pendente',
        description: `${a.clientName} agendou ${a.service?.name || 'serviço'} para ${dateFormatted} às ${a.time}.`,
        detail: a.client?.notes || null,
        date: a.createdAt.toISOString(),
        link: '/admin/agendamentos',
        isPending: true,
      });
    }

    // Agendamentos de hoje
    for (const a of todayAppointments) {
      notifications.push({
        id: `today-${a.id}`,
        type: 'today',
        title: 'Agendamento de Hoje',
        description: `${a.clientName} às ${a.time} - ${a.service?.name || 'serviço'}.`,
        detail: `Status: ${a.status === 'CONFIRMED' ? 'Confirmado' : a.status === 'PENDING' ? 'Pendente' : a.status}`,
        date: a.createdAt.toISOString(),
        link: '/admin/calendario',
        isPending: false,
      });
    }

    // Ordena do mais recente para o mais antigo
    notifications.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());

    const unreadCount = pendingBudgets.length + pendingAppointments.length;

    res.json({
      success: true,
      data: {
        unreadCount,
        counts: {
          pendingBudgets: pendingBudgets.length,
          pendingAppointments: pendingAppointments.length,
          todayAppointments: todayAppointments.length,
        },
        notifications,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: { message: 'Erro ao carregar notificações' } });
  }
};
