import { Router } from 'express';
import * as projectsController from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', projectsController.getProjects);

// Protected routes
router.post('/', authMiddleware, projectsController.createProject);
router.put('/:id', authMiddleware, projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject);

export default router;
