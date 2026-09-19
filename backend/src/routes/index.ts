import { Router } from 'express';
import authRoutes from './auth.routes';
import appointmentRoutes from './appointment.routes';
import clientRoutes from './client.routes';
import serviceRoutes from './service.routes';
import portfolioRoutes from './portfolio.routes';
import budgetRoutes from './budget.routes';
import scheduleRoutes from './schedule.routes';
import settingsRoutes from './settings.routes';
import notificationRoutes from './notification.routes';
import userRoutes from './user.routes';
import auditRoutes from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/budgets', budgetRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/audit', auditRoutes);

export default router;
