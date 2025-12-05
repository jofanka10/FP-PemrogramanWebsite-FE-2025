import { Router } from 'express';
import { RankOrderController } from './rank-order.controller.js';

const router = Router();

router.post('/validate', RankOrderController.validateGame);
router.post('/submit', RankOrderController.submitAnswer);

export default router;
