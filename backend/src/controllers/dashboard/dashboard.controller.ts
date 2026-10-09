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
