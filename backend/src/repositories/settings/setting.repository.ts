import prisma from '../../config/database';

export class SettingRepository {
  async getAll() {
    return prisma.setting.findMany();
  }

  async get(key: string) {
    return prisma.setting.findUnique({ where: { key } });
  }

  async set(key: string, value: string, type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' = 'STRING') {
    return prisma.setting.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type }
    });
  }

  async getBulk(keys: string[]) {
    return prisma.setting.findMany({ where: { key: { in: keys } } });
  }
}
