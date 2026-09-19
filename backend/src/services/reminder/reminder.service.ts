import cron from 'node-cron';
import { AppointmentRepository } from '../../repositories/appointments/appointment.repository';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

const repo = new AppointmentRepository();
const waService = new WhatsAppService();

export class ReminderService {
  static start() {
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily reminder check...');
      // logic to fetch tomorrow's appointments and send reminders
    });
  }
}
