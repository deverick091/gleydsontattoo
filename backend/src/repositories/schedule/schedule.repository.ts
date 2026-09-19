import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class ScheduleRepository {
  async getTimeSlots(professionalId: string) {
    return prisma.timeSlot.findMany({
      where: { professionalId, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
  }

  async getBlockedTimes(professionalId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.BlockedTimeWhereInput = { professionalId };
    if (startDate && endDate) {
      where.OR = [
        { startDate: { lte: endDate }, endDate: { gte: startDate } }
      ];
    }
    return prisma.blockedTime.findMany({ where, orderBy: { startDate: 'asc' } });
  }

  async createBlock(data: Prisma.BlockedTimeCreateInput) {
    return prisma.blockedTime.create({ data });
  }

  async deleteBlock(id: string) {
    return prisma.blockedTime.delete({ where: { id } });
  }

  async getAvailableSlots(professionalId: string, date: Date) {
    const dayOfWeek = date.getDay();
    const [slots, blocked, appointments] = await Promise.all([
      prisma.timeSlot.findMany({ where: { professionalId, dayOfWeek, isActive: true } }),
      prisma.blockedTime.findMany({
        where: { professionalId, startDate: { lte: date }, endDate: { gte: date } }
      }),
      prisma.appointment.findMany({
        where: { professionalId, date, status: { notIn: ['CANCELLED', 'NO_SHOW'] } }
      })
    ]);
    return { slots, blocked, appointments };
  }
}
