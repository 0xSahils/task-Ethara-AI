import { Router } from 'express';
import { getStats, getRecent } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/recent', getRecent);

export default router;
