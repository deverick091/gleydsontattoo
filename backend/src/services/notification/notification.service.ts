import { NotificationRepository } from '../../repositories/notification/notification.repository';

const repo = new NotificationRepository();

export class NotificationService {
  async getPending() { return repo.findPending(); }
  async markSent(id: string) { return repo.markSent(id); }
}
