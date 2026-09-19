import { ServiceRepository } from '../../repositories/services/service.repository';
import { Prisma } from '@prisma/client';

const repo = new ServiceRepository();

export class ServiceService {
  async getAll() { return repo.findAll(); }
  async getActive() { return repo.findActive(); }
  async getById(id: string) { return repo.findById(id); }
  async create(data: Prisma.ServiceUncheckedCreateInput) { return repo.create(data); }
  async update(id: string, data: Prisma.ServiceUpdateInput) { return repo.update(id, data); }
  async delete(id: string) { return repo.delete(id); }
}
