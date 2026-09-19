import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio/portfolio.controller';

const router = Router();
const controller = new PortfolioController();

router.get('/', controller.getAll.bind(controller));

export default router;
