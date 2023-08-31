import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Article } from '../entities/article.entity.js';
import dataSource from '../config/data-source.js';
import { UpdateArticleDto } from '../dto/update.article.dto.js';
import { Tag } from '../entities/tag.entity.js';
import ApiError from '../config/api-error.js';

const articleRepository: Repository<Article> = dataSource.getRepository(Article);
const tagRepository: Repository<Tag> = dataSource.getRepository(Tag);

class ArticleService {
    public async createArticle(title: string, content: string, isPublic: boolean = false, tags?: string[]): Promise<Article> {
        if (!title) throw ApiError.BadRequest('Title is not defined');
        if (!content) throw ApiError.BadRequest('Content is not defined');

        const existArticle = await articleRepository.findOne({where: {title}});
        if (existArticle) throw ApiError.BadRequest(`Article ${title} already exists`);

        const tagArray: Tag[] = await this.crateOrFindTags(tags);

        return await articleRepository.save({title, content, isPublic, tags: tagArray});
    }

    public async updateArticle(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
        const article = await this.getArticleById(id);
        if (!article) throw ApiError.BadRequest('Article not found');
        const {title, content, isPublic, tags} = updateArticleDto;
        if (tags) {
            const tagArray: Tag[] = await this.crateOrFindTags(tags);
            await articleRepository.save({...article, tags: tagArray});
        } else {
            await articleRepository.save({...article, title, content, isPublic});
        }
        const updated = await this.getArticleById(id);
        if (!updated) throw ApiError.BadRequest('Error during updating');

        return updated;
    }

    public async deleteArticle(id: number): Promise<number> {
        const article = await this.getArticleById(id);
        if (!article) throw ApiError.BadRequest('Article not found');

        await articleRepository.delete(id);
        return id;
    }

    public async getArticleById(id: number): Promise<Article | null> {
        return articleRepository.findOne({where: {id}, relations: {tags: true}});
    }

    public async getArticles(isAuthorized: boolean, filter?: string): Promise<Article[] | []> {
        if (filter) {
            const filterArray = filter.split(',').map(str => str.trim());

            /*
            SELECT article.id as id, article.title, article.content, article.is_public, tag.id as tagId, tag.name
            FROM article LEFT JOIN article_tags_tag ON article_tags_tag.articleId = article.id
            LEFT JOIN tag ON article_tags_tag.tagId = tag.id
            WHERE article.id IN ((SELECT articleId FROM article_tags_tag
            WHERE tagId IN ((SELECT id FROM tag WHERE tag.name IN ('${filterArray}'))))) */

            const tagsIdSubQuery = tagRepository.createQueryBuilder('tag')
                .select('tag.id')
                .where('tag.name IN (:...tagNames)')
                .getQuery();
            const articleIdSubQuery = articleRepository.createQueryBuilder('article')
                .select('article.id')
                .leftJoin('article.tags', 'tag')
                .where(`tag.id IN (${tagsIdSubQuery})`);
            if (!isAuthorized) articleIdSubQuery.andWhere('article.isPublic = true');
            return await articleRepository.createQueryBuilder('article')
                .leftJoinAndSelect('article.tags', 'tag')
                .where(`article.id IN (${articleIdSubQuery.getQuery()})`, {tagNames: filterArray})
                .getMany();
        }

        const query = articleRepository.createQueryBuilder('article').leftJoinAndSelect('article.tags', 'tag');
        if (!isAuthorized) query.where('article.isPublic = true');
        return query.getMany();
    }

    public checkAuth(authorization: string | undefined): boolean {
        if (!authorization) return false;
        const jwtToken = authorization.split(' ')[1];

        if (!jwtToken) return false;
        try {
            const payload = jwt.verify(jwtToken, process.env.JWT_SECRET ? process.env.JWT_SECRET : '');
            if (!payload) return false;
        } catch (error) {
            return false;
        }
        return true;
    }

    private async crateOrFindTags(tags: string[] | undefined): Promise<Tag[]> {
        if (!tags) return [];
        const tagArray: Tag[] = [];
        for (let i = 0; i < tags.length; i++) {
            const tag = await tagRepository.findOne({where: {name: tags[i]}});

            if (tag) {
                tagArray.push(tag);
            } else {
                const newTag: Tag = await tagRepository.save({name: tags[i]});
                tagArray.push(newTag);
            }
        }
        return tagArray;
    }
}

export default new ArticleService();
