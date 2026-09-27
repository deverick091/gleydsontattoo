import { Request, Response } from 'express';
import { sendSuccess } from '../../helpers/response';
import { ProfessionalService } from '../../services/professionals/professional.service';

const service = new ProfessionalService();

export class ProfessionalController {
  async getActive(_req: Request, res: Response) {
    try {
      return sendSuccess(res, await service.getActive());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter profissionais';
      return res.status(400).json({ success: false, error: { message } });
    }
  }
}
