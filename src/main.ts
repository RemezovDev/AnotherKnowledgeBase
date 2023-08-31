import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'reflect-metadata'
import appDataSource from './config/data-source.js';
import userRouter from './routes/user.router.js';
import articleRouter from './routes/article.router.js';
import handleExceptionMiddleware from './middleware/handle-exception.middleware.js';

dotenv.config();

const PORT: number = process.env.API_PORT ? +process.env.API_PORT : '' || 80;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use(handleExceptionMiddleware);

const start = () => {
    appDataSource.initialize().then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }).catch((err) => {
        throw new Error('Database is not configured');
    });
}

start();
