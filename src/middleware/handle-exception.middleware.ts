import { NextFunction, Request, Response } from 'express';
import ApiError from '../config/api-error.js';

export default (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ApiError) {
        return res.status(error.status).json({message: error.message});
    }
    if (error instanceof Error) {
        return res.status(500).json({message: error.message});
    }
}
