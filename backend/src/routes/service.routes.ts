import { Router } from 'express';
import { ServiceController } from '../controllers/services/service.controller.js';

const router = Router();
const controller = new ServiceController();

router.get('/', controller.getAll.bind(controller));
router.post('/', controller.create.bind(controller));

export default router;
