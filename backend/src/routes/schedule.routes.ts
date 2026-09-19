import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule/schedule.controller.js';

const router = Router();
const controller = new ScheduleController();

router.get('/slots', controller.getAvailableSlots.bind(controller));

export default router;
