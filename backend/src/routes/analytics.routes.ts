import { Router } from 'express';
import { authMiddleware as authenticate } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = Router();

// Public route
router.post('/page-visit', analyticsController.logPageVisit);

// Protected routes
router.get('/stats', authenticate, analyticsController.getStats);
router.get('/page-visits', authenticate, analyticsController.getPageVisits);

export default router;
