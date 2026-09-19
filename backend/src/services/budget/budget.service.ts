import { BudgetRepository } from '../../repositories/budget/budget.repository';
import { Prisma } from '@prisma/client';

const repo = new BudgetRepository();

export class BudgetService {
  async create(data: Prisma.BudgetCreateInput) { return repo.create(data); }
  async respond(id: string, response: string) { return repo.respond(id, response); }
  async convert(id: string, appointmentId: string) { return repo.updateStatus(id, 'CONVERTED', appointmentId); }
  async getAll(page: number, limit: number) { return repo.findAll((page - 1) * limit, limit); }
}
