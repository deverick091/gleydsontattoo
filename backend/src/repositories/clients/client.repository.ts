import prisma from '../../config/database.js';
import { Prisma } from '@prisma/client';

export class ClientRepository {
  async findAll(skip: number, take: number) {
    const [data, total] = await Promise.all([
      prisma.client.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.client.count()
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: { appointments: { orderBy: { date: 'desc' }, take: 5 } }
    });
  }

  async findByPhone(phone: string) {
    return prisma.client.findFirst({ where: { OR: [{ phone }, { whatsapp: phone }] } });
  }

  async findByEmail(email: string) {
    return prisma.client.findFirst({ where: { email } });
  }

  async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({ where: { id }, data });
  }

  async search(query: string, skip: number, take: number) {
    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { phone: { contains: query } },
        { email: { contains: query, mode: 'insensitive' as const } }
      ]
    };
    const [data, total] = await Promise.all([
      prisma.client.findMany({ where, skip, take }),
      prisma.client.count({ where })
    ]);
    return { data, total };
  }

  async getWithHistory(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        appointments: { include: { service: true, professional: true }, orderBy: { date: 'desc' } },
        budgets: { orderBy: { createdAt: 'desc' } }
      }
    });
  }
}
