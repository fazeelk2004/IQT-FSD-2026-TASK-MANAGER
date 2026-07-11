import { Router } from 'express';

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import {
  validateObjectId,
  validateCreateTask,
  validateUpdateTask,
} from '../middleware/validateTask.js';

const router = Router();

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);

router.get('/:id', validateObjectId, getTaskById);
router.patch('/:id', validateObjectId, validateUpdateTask, updateTask);
router.delete('/:id', validateObjectId, deleteTask);

export default router;
