import { ScheduleRepository } from '../../repositories/schedule/schedule.repository.js';

const repo = new ScheduleRepository();

export class ScheduleService {
  async getSlots(professionalId: string) { return repo.getTimeSlots(professionalId); }
  async createBlock(data: any) { return repo.createBlock(data); }
  async deleteBlock(id: string) { return repo.deleteBlock(id); }
  async getAvailableSlots(professionalId: string, date: string) {
    return repo.getAvailableSlots(professionalId, new Date(date));
  }
}
