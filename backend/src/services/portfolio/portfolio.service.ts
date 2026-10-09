import { PortfolioRepository } from '../../repositories/portfolio/portfolio.repository';
import { Prisma } from '@prisma/client';

const repo = new PortfolioRepository();

export class PortfolioService {
  async list(page: number, limit: number) {
    const [data, total] = await Promise.all([
      repo.findAll((page - 1) * limit, limit),
      repo.count()
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return repo.findById(id);
  }

  async create(data: Prisma.PortfolioUncheckedCreateInput) {
    return repo.create(data);
  }

  async update(id: string, data: Prisma.PortfolioUpdateInput) {
    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.delete(id);
  }
}
