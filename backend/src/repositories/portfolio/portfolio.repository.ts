import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class PortfolioRepository {
  async findAll(page: number, limit: number) {
    return prisma.portfolio.findMany({
      skip: page,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }

  async count() {
    return prisma.portfolio.count();
  }

  async findById(id: string) {
    return prisma.portfolio.findUnique({ where: { id } });
  }

  async create(data: Prisma.PortfolioUncheckedCreateInput) {
    return prisma.portfolio.create({ data });
  }

  async update(id: string, data: Prisma.PortfolioUncheckedUpdateInput) {
    return prisma.portfolio.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.portfolio.delete({ where: { id } });
  }
}
