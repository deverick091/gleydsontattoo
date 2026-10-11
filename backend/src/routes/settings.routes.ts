import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
const controller = new SettingsController();
const admin = [authenticate, authorize('ADMIN')];

// Rotas públicas (para a tela de agendamento do cliente consultar dias abertos/fechados)
router.get('/business-hours', controller.getBusinessHours.bind(controller));
router.get('/studio-info', controller.getStudioInfo.bind(controller));

// Rotas protegidas (apenas admin pode salvar nas configurações)
router.put('/business-hours', ...admin, controller.updateBusinessHours.bind(controller));
router.patch('/business-hours', ...admin, controller.updateBusinessHours.bind(controller));
router.put('/studio-info', ...admin, controller.updateStudioInfo.bind(controller));
router.patch('/studio-info', ...admin, controller.updateStudioInfo.bind(controller));

export default router;
