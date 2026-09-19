import prisma from '../../config/database.js';
import { AppointmentStatus, Prisma } from '@prisma/client';

export class AppointmentRepository {
  async findAll(filters: { status?: AppointmentStatus; date?: Date; professionalId?: string }, skip: number, take: number) {
    return prisma.appointment.findMany({
      where: filters,
      skip, take,
      include: { client: true, service: true, professional: true },
      orderBy: { date: 'asc' }
    });
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { client: true, service: true, professional: true, notifications: true }
    });
  }

  async findByDateRange(professionalId: string, startDate: Date, endDate: Date) {
    return prisma.appointment.findMany({
      where: { professionalId, date: { gte: startDate, lte: endDate }, status: { not: 'CANCELLED' } },
      include: { client: true, service: true }
    });
  }

async findConflicting(professionalId: string, date: Date, startTime: string) {
    // SELECT FOR UPDATE to prevent race conditions during booking
    const result = (await prisma.$queryRaw`
      SELECT id FROM appointments
      WHERE "professionalId" = ${professionalId}
      AND "date" = ${date}
      AND "startTime" = ${startTime}
      AND status != 'CANCELLED'
      FOR UPDATE
    `) as any[];

    return result.length > 0 ? result[0] : null;
  }
  
  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({ data, include: { client: true, service: true } });
  }

  async updateStatus(id: string, status: AppointmentStatus, extras?: { cancelReason?: string; timestamp?: Date }) {
    const data: Prisma.AppointmentUpdateInput = { status };
    if (status === 'CANCELLED') {
      data.cancelReason = extras?.cancelReason;
      data.cancelledAt = extras?.timestamp || new Date();
    } else if (status === 'CONFIRMED') {
      data.confirmedAt = extras?.timestamp || new Date();
    } else if (status === 'COMPLETED') {
      data.completedAt = extras?.timestamp || new Date();
    }
    return prisma.appointment.update({ where: { id }, data, include: { client: true } });
  }

  async reschedule(id: string, date: Date, startTime: string, endTime: string) {
    return prisma.appointment.update({
      where: { id },
      data: { date, startTime, endTime, status: 'PENDING', notifications: { deleteMany: { status: 'PENDING' } } }
    });
  }

  async countByStatus() {
    return prisma.appointment.groupBy({ by: ['status'], _count: { id: true } });
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

    const [todayCount, weekCount, pendingCount, completedCount, cancelledCount, totalCount] = await Promise.all([
      prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
      prisma.appointment.count({ where: { date: { gte: weekStart, lt: weekEnd } } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      prisma.appointment.count()
    ]);
    
    const cancellationRate = totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0;
    return { todayCount, weekCount, pendingCount, completedCount, cancellationRate: Math.round(cancellationRate * 10) / 10 };
  }
}
