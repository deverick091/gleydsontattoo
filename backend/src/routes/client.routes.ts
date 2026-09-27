import { Router } from 'express';
import { ClientController } from '../controllers/clients/client.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
const controller = new ClientController();
const admin = [authenticate, authorize('ADMIN', 'ATTENDANT')];

router.get('/', ...admin, controller.list.bind(controller));
router.post('/', controller.create.bind(controller));
router.get('/:id', ...admin, controller.getById.bind(controller));
router.patch('/:id', ...admin, controller.update.bind(controller));

export default router;
