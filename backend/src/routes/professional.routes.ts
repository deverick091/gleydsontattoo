import { Router } from 'express';
import { ProfessionalController } from '../controllers/professionals/professional.controller';

const router = Router();
const controller = new ProfessionalController();

router.get('/', controller.getActive.bind(controller));

export default router;
