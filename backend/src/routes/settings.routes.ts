import { Router } from 'express';
import { SettingsController } from '../controllers/settings/settings.controller.js';

const router = Router();
const controller = new SettingsController();

router.get('/', controller.getAll.bind(controller));
router.put('/', controller.update.bind(controller));

export default router;
