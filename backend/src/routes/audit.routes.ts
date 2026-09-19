import { Router } from 'express';
import { AuditController } from '../controllers/audit/audit.controller.js';

const router = Router();
const controller = new AuditController();

router.get('/', controller.getAll.bind(controller));

export default router;
