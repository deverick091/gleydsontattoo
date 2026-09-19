export interface WhatsAppProvider {
  sendMessage(to: string, message: string): Promise<void>;
}

class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(to: string, message: string) {
    // Mock implementation - just silently succeed
  }
}

export class WhatsAppService {
  private provider: WhatsAppProvider = new MockWhatsAppProvider();

  async sendBookingConfirmation(appt: any) {
    await this.provider.sendMessage(appt.client.whatsapp, `Olá ${appt.client.name}, seu agendamento está confirmado!`);
  }
  
  async sendCancellation(appt: any) {
    await this.provider.sendMessage(appt.client.whatsapp, `Olá ${appt.client.name}, seu agendamento foi cancelado.`);
  }
  
  async sendReschedule(appt: any) {
    await this.provider.sendMessage(appt.client.whatsapp, `Olá ${appt.client.name}, seu agendamento foi reagendado para ${appt.date}.`);
  }
  
  async sendReminder(appt: any) {
    await this.provider.sendMessage(appt.client.whatsapp, `Olá ${appt.client.name}, lembrete de agendamento amanhã!`);
  }
}