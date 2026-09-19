import prisma from '../../config/database.js';
import { Prisma } from '@prisma/client';

export class ServiceRepository {
  async findAll() {
    return prisma.service.findMany({
      include: { category: true },
      orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }]
    });
  }

  async findActive() {
    return prisma.service.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }]
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({ where: { id }, include: { category: true } });
  }

  async findByCategory(categoryId: string) {
    return prisma.service.findMany({
      where: { categoryId, isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  async create(data: Prisma.ServiceUncheckedCreateInput) {
    return prisma.service.create({ data });
  }

  async update(id: string, data: Prisma.ServiceUncheckedUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}
