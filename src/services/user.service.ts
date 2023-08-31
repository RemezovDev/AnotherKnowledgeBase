import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../entities/user.entity.js';
import dataSource from '../config/data-source.js';
import { Repository } from 'typeorm';
import ApiError from '../config/api-error.js';

const userRepository:Repository<User> = dataSource.getRepository(User);

class UserService {
    public async registration(email: string, password: string): Promise<string> {
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (password.length < 5) throw ApiError.BadRequest('Password must be the more than 5 characters');

        if (!EMAIL_REGEXP.test(email)) throw ApiError.BadRequest('Email format wrong');

        const candidate = await this.getUserByEmail(email);

        if (candidate) throw ApiError.BadRequest(`User with email ${email} already exists`);
        const hashPassword = await bcrypt.hash(password, 10);
        const user: User = await userRepository.save({email, password: hashPassword});
        return this.generateToken({id: user.id, email});
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.getUserByEmail(email);

        if (!user) throw ApiError.BadRequest('User not found');
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) throw ApiError.BadRequest(`Incorrect password`);
        return this.generateToken({id: user.id, email});
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return userRepository.findOne({where: {email}});
    }

    private generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : '', {
            expiresIn: process.env.JWT_EXPIRES,
        });
    }
}

export default new UserService();
