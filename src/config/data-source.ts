import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Article } from '../entities/article.entity.js';
import { User } from '../entities/user.entity.js';
import { Tag } from '../entities/tag.entity.js';
dotenv.config();
export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Article, User, Tag],
    subscribers: [],
    migrations: ['build/migrations/*.js'],
});

