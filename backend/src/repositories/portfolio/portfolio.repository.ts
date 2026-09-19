import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class PortfolioRepository {
  async findAll(categoryId?: string) {
    return prisma.portfolioItem.findMany({
      where: categoryId ? { categoryId, isActive: true } : {},
      include: { category: true },
      orderBy: { order: 'asc' }
    });
  }

  async findById(id: string) {
    return prisma.portfolioItem.findUnique({ where: { id }, include: { category: true } });
  }

  async create(data: Prisma.PortfolioItemUncheckedCreateInput) {
    return prisma.portfolioItem.create({ data });
  }

  async update(id: string, data: Prisma.PortfolioItemUncheckedUpdateInput) {
    return prisma.portfolioItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.portfolioItem.delete({ where: { id } });
  }

  async reorder(items: { id: string; order: number }[]) {
    // using transaction for batch update
    return prisma.$transaction(
      items.map(item => prisma.portfolioItem.update({
        where: { id: item.id },
        data: { order: item.order }
      }))
    );
  }
}
