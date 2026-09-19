import { BudgetRepository } from '../../repositories/budget/budget.repository.js';

const repo = new BudgetRepository();

export class BudgetService {
  async create(data: any) { return repo.create(data); }
  async respond(id: string, response: string) { return repo.respond(id, response); }
  async convert(id: string, appointmentId: string) { return repo.updateStatus(id, 'CONVERTED', appointmentId); }
  async getAll(page: number, limit: number) { return repo.findAll((page - 1) * limit, limit); }
}
