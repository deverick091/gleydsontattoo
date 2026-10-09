import prisma from '../../config/database';
import { AppointmentStatus, Prisma } from '@prisma/client';

export class AppointmentRepository {
  async findAll(filters: { status?: AppointmentStatus; date?: Date; dateFrom?: Date; dateTo?: Date; query?: string }, skip: number, take: number) {
    const { date, dateFrom, dateTo, query, ...rest } = filters;
    const where: Prisma.AppointmentWhereInput = {
      ...rest,
      ...(date ? { date } : dateFrom || dateTo ? { date: { ...(dateFrom ? { gte: dateFrom } : {}), ...(dateTo ? { lte: dateTo } : {}) } } : {}),
      ...(query ? { OR: [{ clientName: { contains: query, mode: 'insensitive' } }, { clientPhone: { contains: query } }] } : {})
    };
    return prisma.appointment.findMany({
      where,
      skip, take,
      include: { client: true, service: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }]
    });
  }

  async count(filters: { status?: AppointmentStatus; date?: Date; dateFrom?: Date; dateTo?: Date; query?: string }) {
    const { date, dateFrom, dateTo, query, ...rest } = filters;
    const where: Prisma.AppointmentWhereInput = {
      ...rest,
      ...(date ? { date } : dateFrom || dateTo ? { date: { ...(dateFrom ? { gte: dateFrom } : {}), ...(dateTo ? { lte: dateTo } : {}) } } : {}),
      ...(query ? { OR: [{ clientName: { contains: query, mode: 'insensitive' } }, { clientPhone: { contains: query } }] } : {})
    };
    return prisma.appointment.count({ where });
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { client: true, service: true }
    });
  }

  async findConflicting(date: Date, time: string) {
    return prisma.appointment.findFirst({
      where: {
        date,
        time,
        status: { not: 'CANCELLED' }
      }
    });
  }
  
  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({ data, include: { client: true, service: true } });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return prisma.appointment.update({ where: { id }, data: { status }, include: { client: true, service: true } });
  }

  async reschedule(id: string, date: Date, time: string) {
    return prisma.appointment.update({
      where: { id },
      data: { date, time, status: 'PENDING' },
      include: { client: true, service: true }
    });
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const [todayCount, weekCount, pendingCount, cancelledCount, totalCount] = await Promise.all([
      prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
      prisma.appointment.count({ where: { date: { gte: weekStart, lt: weekEnd } } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      prisma.appointment.count()
    ]);
    
    const cancellationRate = totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0;
    return { todayCount, weekCount, pendingCount, cancellationRate: Math.round(cancellationRate * 10) / 10 };
  }
}
