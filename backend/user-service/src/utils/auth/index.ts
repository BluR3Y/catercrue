import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import RefreshToken from "../../models/refreshToken.model";
import AppError from "../appError";
import { Application } from "express";
import jwt from 'jsonwebtoken';

// Import Login Strategies:
import localLoginStrategy from "./localLoginStrategy";

// Configure passport authentication middleware 
export const passportAuthenicationMiddleware = (app: Application) => {
    // Serialize user to store in JWT
    passport.serializeUser((user: any, done: Function) => {
        done(null, user.id);
    });
    // Deserialize user from JWT
    passport.deserializeUser(async (id: string, done: Function) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // Install Login Strategies:
    localLoginStrategy(passport);

    app.use(passport.initialize());
}

export const generateJWToken = (payload: object) => {
    const {
        JWT_KEY,
        JWT_DURATION
    } = process.env;
    return jwt.sign(payload, JWT_KEY!, { expiresIn: JWT_DURATION ?? '1h' });
}

const authenticationStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return (err: any, user: User, info: any) => {
        if (err) return next(err);

        req.login(user, { session: false }, async (err) => {
            if (err) return next(err);

            try {
                // Generate a new refresh token
                const refreshToken = await RefreshToken.create({ userId: user.id });
                // Generate a new access token
                const accessToken = generateJWToken({ userId: user.id });

                res.json({
                    accessToken,
                    refreshToken: refreshToken.token
                });
            } catch (err) {
                return next(err);
            }
        });
    }
}

// Pass through the Auth routes:
export const authenticate = {
    // Email/Password:
    localLogin: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('local-login', authenticationStrategyCallback(req, res, next))(req, res, next);
    }
}

// Middleware to authenticate token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AppError(401, 'UNAUTHORIZED', 'Unauthorized request');
    }

    jwt.verify(token, process.env.JWT_KEY!, (err: any, payload: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError(403, 'Forbidden', 'Token expired');
            }
            throw new AppError(403, 'Forbidden', 'Failed to authenticate token');
        }
        (req as any).userAccessToken = payload;
        next();
    });
}