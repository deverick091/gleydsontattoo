import { ScheduleRepository } from '../../repositories/schedule/schedule.repository';
import { Prisma } from '@prisma/client';

const repo = new ScheduleRepository();

export class ScheduleService {
  async getSlots(professionalId: string) { return repo.getTimeSlots(professionalId); }
  async createBlock(data: Prisma.BlockedTimeCreateInput) { return repo.createBlock(data); }
  async deleteBlock(id: string) { return repo.deleteBlock(id); }
  async getAvailableSlots(professionalId: string, date: string) {
    return repo.getAvailableSlots(professionalId, new Date(date));
  }
}
