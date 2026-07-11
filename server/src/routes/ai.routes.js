import { Router } from 'express';

import { improveTask } from '../controllers/ai.controller.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/improve-task', aiLimiter, improveTask);

export default router;
