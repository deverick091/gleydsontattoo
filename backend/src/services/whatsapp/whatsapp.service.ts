import { Appointment, Client } from '@prisma/client';

export interface WhatsAppProvider {
  sendMessage(to: string, message: string): Promise<void>;
}

class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(to: string, message: string) {
    // Mock implementation - just silently succeed
  }
}

interface AppointmentWithClient extends Appointment {
  client: Client;
}

export class WhatsAppService {
  private provider: WhatsAppProvider = new MockWhatsAppProvider();

  async sendBookingConfirmation(appt: AppointmentWithClient) {
    await this.provider.sendMessage(
      appt.client.phone,
      `Olá ${appt.client.name}, seu agendamento está confirmado!`
    );
  }

  async sendCancellation(appt: AppointmentWithClient) {
    await this.provider.sendMessage(
      appt.client.phone,
      `Olá ${appt.client.name}, seu agendamento foi cancelado.`
    );
  }

  async sendReschedule(appt: AppointmentWithClient) {
    await this.provider.sendMessage(
      appt.client.phone,
      `Olá ${appt.client.name}, seu agendamento foi reagendado para ${appt.date}.`
    );
  }

  async sendReminder(appt: AppointmentWithClient) {
    await this.provider.sendMessage(
      appt.client.phone,
      `Olá ${appt.client.name}, lembrete de agendamento amanhã!`
    );
  }
}