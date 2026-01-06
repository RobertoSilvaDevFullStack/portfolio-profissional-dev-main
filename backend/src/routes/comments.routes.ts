import { Router } from 'express';
import * as commentsController from '../controllers/comments.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/post/:postId', commentsController.getCommentsByPost);
router.post('/', commentsController.createComment);

// Protected routes (requires authentication)
router.put('/:id', authMiddleware, commentsController.updateComment);
router.put('/:id/moderate', authMiddleware, commentsController.moderateComment);
router.delete('/:id', authMiddleware, commentsController.deleteComment);
router.post('/:id/like', authMiddleware, commentsController.toggleLike);

export default router;
