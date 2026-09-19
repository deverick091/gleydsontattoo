import { Router } from 'express';
import { AppointmentController } from '../controllers/appointments/appointment.controller';

const router = Router();
const controller = new AppointmentController();

router.post('/', controller.create.bind(controller));
router.patch('/:id/status', controller.updateStatus.bind(controller));

export default router;
