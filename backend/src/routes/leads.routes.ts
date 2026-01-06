import { Router } from 'express';
import * as leadsController from '../controllers/leads.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public route (contact form)
router.post('/', leadsController.createLead);

// Protected routes
router.get('/', authMiddleware, leadsController.getLeads);
router.put('/:id', authMiddleware, leadsController.updateLead);
router.delete('/:id', authMiddleware, leadsController.deleteLead);

export default router;
