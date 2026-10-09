import { AppointmentRepository } from '../../repositories/appointments/appointment.repository.js';
import { ClientRepository } from '../../repositories/clients/client.repository.js';
import { ConflictError } from '../../helpers/errors.js';
import prisma from '../../config/database.js';
import { Prisma, AppointmentStatus } from '@prisma/client';

const appointmentRepo = new AppointmentRepository();
const clientRepo = new ClientRepository();

interface CreateAppointmentInput {
  serviceId: string;
  date: Date;
  time: string;
  client: { phone: string; name: string; email?: string; notes?: string; };
}

export class AppointmentService {
  async create(data: CreateAppointmentInput) {
    // simplified conflict check: date and time
    const conflict = await appointmentRepo.findConflicting(data.date, data.time);
    if (conflict) throw new ConflictError('Horário não disponível');

    return prisma.$transaction(async (tx) => {
      let client = await tx.client.findFirst({ where: { phone: data.client.phone } });
      if (!client) {
        client = await tx.client.create({
          data: {
            name: data.client.name,
            email: data.client.email || '',
            phone: data.client.phone,
            notes: data.client.notes
          }
        });
      } else {
        // Se o cliente já existir com o mesmo telefone, atualiza o nome se foi alterado
        if (client.name !== data.client.name || (data.client.email && client.email !== data.client.email)) {
          client = await tx.client.update({
            where: { id: client.id },
            data: {
              name: data.client.name,
              ...(data.client.email ? { email: data.client.email } : {})
            }
          });
        }
      }

      const appointment = await tx.appointment.create({
        data: {
          clientName: data.client.name,
          clientPhone: data.client.phone,
          clientId: client.id,
          serviceId: data.serviceId,
          date: data.date,
          time: data.time
        },
        include: { client: true, service: true }
      });

      return appointment;
    });
  }

  async list(filters: { status?: AppointmentStatus; date?: Date; dateFrom?: Date; dateTo?: Date; query?: string }, page: number, limit: number) {
    const [data, total] = await Promise.all([
      appointmentRepo.findAll(filters, (page - 1) * limit, limit),
      appointmentRepo.count(filters)
    ]);
    return { data, total };
  }

  async getById(id: string) {
    const appointment = await appointmentRepo.findById(id);
    if (!appointment) throw new Error('Agendamento não encontrado');
    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return appointmentRepo.updateStatus(id, status);
  }

  async reschedule(id: string, date: Date, time: string) {
    const existing = await appointmentRepo.findById(id);
    if (!existing) throw new Error('Agendamento não encontrado');
    const conflict = await appointmentRepo.findConflicting(date, time);
    if (conflict && conflict.id !== id) throw new ConflictError('Horário não disponível');
    return appointmentRepo.reschedule(id, date, time);
  }
}
