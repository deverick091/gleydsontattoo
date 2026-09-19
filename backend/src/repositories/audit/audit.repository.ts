import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class AuditRepository {
  async create(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }

  async findAll(filters: { userId?: string; action?: string; startDate?: Date; endDate?: Date }, skip: number, take: number) {
    const where: Prisma.AuditLogWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take, include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count({ where })
    ]);
    return { data, total };
  }
}
