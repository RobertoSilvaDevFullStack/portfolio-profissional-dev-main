import { Router } from 'express';
import { authMiddleware as authenticate } from '../middleware/auth.js';
import * as notificationsController from '../controllers/notifications.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);
router.delete('/:id', notificationsController.deleteNotification);

export default router;
