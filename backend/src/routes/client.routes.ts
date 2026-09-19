import { Router } from 'express';
import { ClientController } from '../controllers/clients/client.controller';

const router = Router();
const controller = new ClientController();

router.post('/', controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));

export default router;
