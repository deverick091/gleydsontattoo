import { Router } from 'express';
import authRoutes from './auth.routes.js';
import appointmentRoutes from './appointment.routes.js';
import clientRoutes from './client.routes.js';
import serviceRoutes from './service.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import budgetRoutes from './budget.routes.js';
import scheduleRoutes from './schedule.routes.js';
import settingsRoutes from './settings.routes.js';
import notificationRoutes from './notification.routes.js';
import userRoutes from './user.routes.js';
import auditRoutes from './audit.routes.js';

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
