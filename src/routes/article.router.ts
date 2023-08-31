import { Router } from 'express';
import articleController from '../controllers/article.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', articleController.getArticles);
router.post('/', authMiddleware, articleController.createArticle);
router.get('/:id', authMiddleware, articleController.getArticleById);
router.delete('/:id', authMiddleware, articleController.deleteArticle);
router.patch('/:id', authMiddleware, articleController.updateArticle);
export default router;
