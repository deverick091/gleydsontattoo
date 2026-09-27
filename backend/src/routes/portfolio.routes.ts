import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio/portfolio.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
const controller = new PortfolioController();
const admin = [authenticate, authorize('ADMIN', 'ATTENDANT')];

router.get('/', controller.getAll.bind(controller));
router.post('/', ...admin, controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.patch('/:id', ...admin, controller.update.bind(controller));
router.delete('/:id', ...admin, controller.delete.bind(controller));

export default router;
