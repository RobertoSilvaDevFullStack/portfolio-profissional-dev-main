import { Router } from 'express';
import * as postsController from '../controllers/posts.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', postsController.getPosts);
router.get('/:slug', postsController.getPostBySlug);

// Protected routes (require authentication)
router.post('/', authMiddleware, postsController.createPost);
router.put('/:id', authMiddleware, postsController.updatePost);
router.delete('/:id', authMiddleware, postsController.deletePost);

export default router;
