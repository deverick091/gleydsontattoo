import { ClientRepository } from '../../repositories/clients/client.repository.js';

const repo = new ClientRepository();

export class ClientService {
  async create(data: any) { return repo.create(data); }
  async update(id: string, data: any) { return repo.update(id, data); }
  async getById(id: string) { return repo.getWithHistory(id); }
  async search(query: string, page: number, limit: number) {
    return repo.search(query, (page - 1) * limit, limit);
  }
  async getOrCreate(data: any) {
    let client = await repo.findByPhone(data.phone);
    if (!client) client = await repo.create(data);
    return client;
  }
}
