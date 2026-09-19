import { ClientRepository } from '../../repositories/clients/client.repository';
import { Prisma } from '@prisma/client';

const repo = new ClientRepository();

export class ClientService {
  async create(data: Prisma.ClientCreateInput) { return repo.create(data); }
  async update(id: string, data: Prisma.ClientUpdateInput) { return repo.update(id, data); }
  async getById(id: string) { return repo.getWithHistory(id); }
  async search(query: string, page: number, limit: number) {
    return repo.search(query, (page - 1) * limit, limit);
  }
  async getOrCreate(data: Prisma.ClientCreateInput) {
    let client = await repo.findByPhone(data.phone as string);
    if (!client) client = await repo.create(data);
    return client;
  }
}
