import { AppointmentRepository } from '../../repositories/appointments/appointment.repository.js';
import { ClientRepository } from '../../repositories/clients/client.repository.js';
import { WhatsAppService } from '../whatsapp/whatsapp.service.js';
import { ConflictError, NotFoundError } from '../../helpers/errors.js';
import prisma from '../../config/database.js';

const appointmentRepo = new AppointmentRepository();
const clientRepo = new ClientRepository();
const whatsappService = new WhatsAppService();

export class AppointmentService {
  async create(data: any) {
    // Check conflicts inside a transaction using FOR UPDATE (simulated via query in Repo)
    const conflict = await appointmentRepo.findConflicting(data.professionalId, new Date(data.date), data.startTime);
    if (conflict) throw new ConflictError('Horário não disponível');

    return prisma.$transaction(async (tx) => {
      // 1. Get or create client
      let client = await clientRepo.findByPhone(data.client.phone);
      if (!client) client = await tx.client.create({ data: data.client });

      // 2. Create appointment
      const appointment = await tx.appointment.create({
        data: {
          clientId: client.id,
          professionalId: data.professionalId,
          serviceId: data.serviceId,
          date: new Date(data.date),
          startTime: data.startTime,
          endTime: data.startTime, // simplified
          notes: data.client.notes,
          bodyRegion: data.client.bodyRegion,
          stylePreference: data.client.stylePreference,
          referenceImages: data.referenceImages || []
        },
        include: { client: true, professional: true, service: true }
      });

      // 3. Send WhatsApp
      await whatsappService.sendBookingConfirmation(appointment);
      return appointment;
    });
  }

  async updateStatus(id: string, status: any, extras?: any) {
    const appt = await appointmentRepo.updateStatus(id, status, extras);
    if (status === 'CANCELLED') await whatsappService.sendCancellation(appt);
    return appt;
  }

  async reschedule(id: string, date: string, startTime: string) {
    const appt = await appointmentRepo.reschedule(id, new Date(date), startTime, startTime);
    await whatsappService.sendReschedule(appt);
    return appt;
  }
}
