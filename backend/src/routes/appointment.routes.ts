import { Router } from 'express';
import { AppointmentController } from '../controllers/appointments/appointment.controller';

const router = Router();
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const controller = new AppointmentController();
const admin = [authenticate, authorize('ADMIN', 'ATTENDANT')];

router.get('/', ...admin, controller.list.bind(controller));
router.get('/:id', ...admin, controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id/status', ...admin, controller.updateStatus.bind(controller));
router.patch('/:id/reschedule', ...admin, controller.reschedule.bind(controller));

export default router;
