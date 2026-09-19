import { Router } from 'express';
import { NotificationController } from '../controllers/notification/notification.controller.js';

const router = Router();
const controller = new NotificationController();

router.get('/pending', controller.getPending.bind(controller));

export default router;
