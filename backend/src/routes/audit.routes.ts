import { Router } from 'express';
import { AuditController } from '../controllers/audit/audit.controller';

const router = Router();
const controller = new AuditController();

router.get('/', controller.getAll.bind(controller));

export default router;
