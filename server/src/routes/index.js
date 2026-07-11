import { Router } from 'express';
import healthRoutes from './health.routes.js';
import taskRoutes from './task.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/tasks', taskRoutes);
router.use('/ai', aiRoutes);

export default router;
