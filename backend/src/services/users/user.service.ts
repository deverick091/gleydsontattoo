import { UserRepository } from '../../repositories/users/user.repository';
import { Prisma } from '@prisma/client';

const repo = new UserRepository();

export class UserService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    return repo.findById(id);
  }

  async findByEmail(email: string) {
    return repo.findByEmail(email);
  }

  async create(data: Prisma.UserCreateInput) {
    return repo.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return repo.update(id, data);
  }

  async deactivate(id: string) {
    return repo.deactivate(id);
  }
}
