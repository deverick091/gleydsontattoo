import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.get('/stats', authenticate, authorize('ADMIN'), getDashboardStats);

export default router;
