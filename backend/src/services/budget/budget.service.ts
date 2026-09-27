import { BudgetRepository } from '../../repositories/budget/budget.repository';
import { Prisma, BudgetStatus } from '@prisma/client';
import { AppointmentService } from '../appointments/appointment.service';

const repo = new BudgetRepository();
const appointmentService = new AppointmentService();

export class BudgetService {
  async getById(id: string) {
    const budget = await repo.findById(id);
    if (!budget) throw new Error('Orçamento não encontrado');
    return budget;
  }
  async updateStatus(id: string, status: Prisma.BudgetUpdateInput['status']) {
    return repo.updateStatus(id, status as BudgetStatus);
  }
  async convert(id: string, data: { professionalId: string; serviceId: string; date: Date; startTime: string; endTime: string }) {
    const budget = await repo.findById(id);
    if (!budget) throw new Error('Orçamento não encontrado');
    if (budget.status === BudgetStatus.CONVERTED) throw new Error('Orçamento já convertido');
    const appointment = await appointmentService.create({
      professionalId: data.professionalId,
      serviceId: data.serviceId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      client: {
        name: budget.name,
        phone: budget.whatsapp,
        email: budget.email || undefined,
        notes: budget.description || undefined,
        bodyRegion: budget.bodyRegion || undefined,
        stylePreference: budget.style || undefined,
        referenceImages: budget.referenceImages
      }
    });
    return repo.updateStatus(id, BudgetStatus.CONVERTED, appointment.id);
  }
  async create(data: Prisma.BudgetCreateInput) { return repo.create(data); }
  async respond(id: string, response: string) { return repo.respond(id, response); }
  async getAll(page: number, limit: number) { return repo.findAll((page - 1) * limit, limit); }
}
