import { Router } from 'express';
import * as uploadsController from '../controllers/uploads.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

// All upload routes require authentication
router.post('/blog', authMiddleware, uploadSingle, uploadsController.uploadBlogImage);
router.post('/projects', authMiddleware, uploadSingle, uploadsController.uploadProjectImage);
router.post('/site', authMiddleware, uploadSingle, uploadsController.uploadSiteAsset);

// Delete file
router.delete('/:category/:filename', authMiddleware, uploadsController.deleteFile);

export default router;
