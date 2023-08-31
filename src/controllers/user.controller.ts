import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service.js';

class UserController {
    public async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {email, password} = req.body;
            const token = await userService.registration(email, password);
            res.json(token);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void>  {
        try {
            const {email, password} = req.body;
            const token = await userService.login(email, password);
            res.json(token);
        } catch (error) {
            next(error);
        }
    }

}

export default new UserController();
