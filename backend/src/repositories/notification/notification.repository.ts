import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class NotificationRepository {
  async findAll(skip: number, take: number) {
    const [data, total] = await Promise.all([
      prisma.notification.findMany({ skip, take, include: { appointment: true }, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count()
    ]);
    return { data, total };
  }

  async findPending() {
    return prisma.notification.findMany({
      where: { status: 'PENDING' },
      include: { appointment: { include: { client: true, professional: true, service: true } } },
      orderBy: { createdAt: 'asc' }
    });
  }

  async create(data: Prisma.NotificationUncheckedCreateInput) {
    return prisma.notification.create({ data });
  }

  async markSent(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date(), error: null }
    });
  }

  async markFailed(id: string, error: string) {
    return prisma.notification.update({
      where: { id },
      data: { status: 'FAILED', error }
    });
  }
}
