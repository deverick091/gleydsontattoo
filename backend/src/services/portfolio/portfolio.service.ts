import { PortfolioRepository } from '../../repositories/portfolio/portfolio.repository.js';
import { Prisma } from '@prisma/client';

const repo = new PortfolioRepository();

export class PortfolioService {
  async getAll(categoryId?: string) { return repo.findAll(categoryId); }
  async create(data: Prisma.PortfolioItemUncheckedCreateInput) { return repo.create(data); }
  async update(id: string, data: Prisma.PortfolioItemUpdateInput) { return repo.update(id, data); }
  async delete(id: string) { return repo.delete(id); }
  async reorder(items: {id: string, order: number}[]) { return repo.reorder(items); }
}
