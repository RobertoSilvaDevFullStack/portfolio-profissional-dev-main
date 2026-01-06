import { Router } from 'express';
import { authMiddleware as authenticate } from '../middleware/auth.js';
import * as auditLogsController from '../controllers/auditLogs.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', auditLogsController.getAuditLogs);

export default router;
