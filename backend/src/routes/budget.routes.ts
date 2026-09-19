import { Router } from 'express';
import { BudgetController } from '../controllers/budget/budget.controller.js';

const router = Router();
const controller = new BudgetController();

router.post('/', controller.create.bind(controller));

export default router;
