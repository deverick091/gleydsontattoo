import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });
  }

  async deactivate(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, email: true, isActive: true }
    });
  }
}
