import { Router } from 'express';
import healthRoutes from './health.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/tasks', taskRoutes);

export default router;
