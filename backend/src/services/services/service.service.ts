import { ServiceRepository } from '../../repositories/services/service.repository.js';

const repo = new ServiceRepository();

export class ServiceService {
  async getAll() { return repo.findAll(); }
  async getActive() { return repo.findActive(); }
  async getById(id: string) { return repo.findById(id); }
  async create(data: any) { return repo.create(data); }
  async update(id: string, data: any) { return repo.update(id, data); }
  async delete(id: string) { return repo.delete(id); }
}
