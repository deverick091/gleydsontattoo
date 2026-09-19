import { AppointmentRepository } from '../../repositories/appointments/appointment.repository.js';
import { ClientRepository } from '../../repositories/clients/client.repository.js';
import { WhatsAppService } from '../whatsapp/whatsapp.service.js';
import { ConflictError } from '../../helpers/errors.js';
import prisma from '../../config/database.js';
import { Prisma, AppointmentStatus } from '@prisma/client';

const appointmentRepo = new AppointmentRepository();
const clientRepo = new ClientRepository();
const whatsappService = new WhatsAppService();

interface CreateAppointmentInput {
  professionalId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  client: { phone: string; name: string; email?: string; notes?: string; bodyRegion?: string; stylePreference?: string; referenceImages?: string[] };
}

export class AppointmentService {
  async create(data: CreateAppointmentInput) {
    const conflict = await appointmentRepo.findConflicting(data.professionalId, data.date, data.startTime);
    if (conflict) throw new ConflictError('Horário não disponível');

    return prisma.$transaction(async (tx) => {
      let client = await clientRepo.findByPhone(data.client.phone);
      if (!client) {
        client = await tx.client.create({
          data: {
            name: data.client.name,
            email: data.client.email || '',
            phone: data.client.phone,
            whatsapp: data.client.phone
          }
        });
      }

      const appointment = await tx.appointment.create({
        data: {
          clientId: client.id,
          professionalId: data.professionalId,
          serviceId: data.serviceId,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          notes: data.client.notes,
          bodyRegion: data.client.bodyRegion,
          stylePreference: data.client.stylePreference,
          referenceImages: data.client.referenceImages || []
        },
        include: { client: true, professional: true, service: true }
      });

      await whatsappService.sendBookingConfirmation(appointment);
      return appointment;
    });
  }

  async updateStatus(id: string, status: AppointmentStatus, extras?: Record<string, any>) {
    const appt = await appointmentRepo.updateStatus(id, status, extras);
    if (status === 'CANCELLED') {
      const fullAppt = await prisma.appointment.findUnique({ where: { id }, include: { client: true } });
      if (fullAppt?.client) await whatsappService.sendCancellation(fullAppt);
    }
    return appt;
  }

  async reschedule(id: string, date: Date, startTime: string) {
    const appt = await appointmentRepo.reschedule(id, date, startTime, startTime);
    const fullAppt = await prisma.appointment.findUnique({ where: { id }, include: { client: true } });
    if (fullAppt?.client) await whatsappService.sendReschedule(fullAppt);
    return appt;
  }
}
