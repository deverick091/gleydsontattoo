import prisma from '../../config/database';

export class ProfessionalRepository {
  async findActive() {
    return prisma.professional.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        specialties: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
