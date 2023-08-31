import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../config/api-error.js';

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return next(ApiError.Unauthorized());
        }
        const jwtToken = authorization.split(' ')[1];

        if (!jwtToken) {
            return next(ApiError.Unauthorized());
        }
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET ? process.env.JWT_SECRET : '');

        if (!payload) {
            return next(ApiError.Unauthorized());
        }
        next();
    } catch (error) {
        return next(ApiError.Unauthorized());
    }
}
