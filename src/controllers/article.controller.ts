import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import articleService from '../services/article.service.js';
import { UpdateArticleDto } from '../dto/update.article.dto.js';
import ApiError from '../config/api-error.js';

dotenv.config();

interface ArticleQuery {
    filter: string,
}

class ArticleController {
    public async createArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, content, isPublic, tags} = req.body;
            const article = await articleService.createArticle(title, content, isPublic, tags);
            res.json(article);
        } catch (error) {
            next(error);
        }
    }

    public async updateArticle(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const dto: UpdateArticleDto = req.body;
        try {
            const article = await articleService.updateArticle(+id, dto);
            res.json(article);
        } catch (error) {
            next(error);
        }
    }

    public async deleteArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const article = await articleService.deleteArticle(+id);
            res.json(article);
        } catch (error) {
            next(error);
        }
    }


    public async getArticleById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const article = await articleService.getArticleById(+id);
            if (!article) throw ApiError.BadRequest('Article not found');
            res.json(article);
        } catch (error) {
            next(error);
        }
    }

    public async getArticles(req: Request<{}, {}, {}, ArticleQuery>, res: Response, next: NextFunction) {
        try {
            const filter = req.query.filter;
            const isAuthorized = articleService.checkAuth(req.headers.authorization);
            const articles = await articleService.getArticles(isAuthorized, filter);
            res.json(articles);
        } catch (error) {
            next(error);
        }
    }
}

export default new ArticleController();
