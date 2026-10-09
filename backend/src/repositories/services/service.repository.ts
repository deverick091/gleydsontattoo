import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class ServiceRepository {
  async findAll() {
    return prisma.service.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findActive() {
    return prisma.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
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
