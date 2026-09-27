import { ProfessionalRepository } from '../../repositories/professionals/professional.repository';

const repository = new ProfessionalRepository();

export class ProfessionalService {
  async getActive() {
    return repository.findActive();
  }
}
