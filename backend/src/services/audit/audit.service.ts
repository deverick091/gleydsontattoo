import { AuditRepository } from '../../repositories/audit/audit.repository.js';

const repo = new AuditRepository();

export class AuditService {
  async log(data: any) { return repo.create(data); }
  async getAll(filters: any, page: number, limit: number) {
    return repo.findAll(filters, (page - 1) * limit, limit);
  }
}
