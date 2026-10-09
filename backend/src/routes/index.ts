import { Router } from 'express';
import authRoutes from './auth.routes';
import appointmentRoutes from './appointment.routes';
import clientRoutes from './client.routes';
import serviceRoutes from './service.routes';
import portfolioRoutes from './portfolio.routes';
import budgetRoutes from './budget.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';

import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const adminAccess = [authenticate, authorize('ADMIN')]; // ATTENDANT is gone from Role enum

const router = Router();

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/budgets', budgetRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
