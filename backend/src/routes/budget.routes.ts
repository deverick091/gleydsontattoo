import { Router } from 'express';
import { BudgetController } from '../controllers/budget/budget.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
const controller = new BudgetController();
const admin = [authenticate, authorize('ADMIN', 'ATTENDANT')];

router.get('/', ...admin, controller.list.bind(controller));
router.post('/', controller.create.bind(controller));
router.get('/:id', ...admin, controller.getById.bind(controller));
router.patch('/:id/respond', ...admin, controller.respond.bind(controller));
router.patch('/:id/status', ...admin, controller.updateStatus.bind(controller));
router.post('/:id/convert', ...admin, controller.convert.bind(controller));

export default router;
