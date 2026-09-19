import { AuditRepository } from '../../repositories/audit/audit.repository';
import { Prisma } from '@prisma/client';

const repo = new AuditRepository();

export class AuditService {
  async log(data: Prisma.AuditLogCreateInput) { return repo.create(data); }
  async getAll(filters: Record<string, any>, page: number, limit: number) {
    return repo.findAll(filters, (page - 1) * limit, limit);
  }
}
