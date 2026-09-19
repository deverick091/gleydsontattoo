import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.get('/me', authenticate, controller.me.bind(controller));

export default router;
