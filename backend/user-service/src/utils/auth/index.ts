import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
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

function authenticationStrategyCallback(req: Request, res: Response, next: NextFunction) {
    return (err: any, user: User, info: any) => {
        if (err) return next(err);
        req.login(user, { session: false }, function(err) {
            if (err) return next(err);
            const { JWT_SECRET_KEY } = process.env;
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET_KEY!, { expiresIn: '1h' });
            console.log(token);
            res.json({ token });
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
    const { JWT_SECRET_KEY } = process.env;

    if (token) {
        jwt.verify(token, JWT_SECRET_KEY!, (err: any, user: any) => {
            if (err) throw new AppError(403, 'Forbidden', 'Forbidden request');
            req.user = user;
            next();
        });
    } else {
        throw new AppError(401, 'UNAUTHORIZED', 'Unauthorized request');
    }
}