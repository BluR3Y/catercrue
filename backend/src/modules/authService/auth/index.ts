import passport from "passport";
import { Application, RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Import Login Strategies
import localLoginStrategy from "./localLoginStrategy";
import db from "../models";
import User from "../models/user.model";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Login Strategies
    localLoginStrategy(passport);
    
    app.use(passport.initialize());
}

const generateJWT = (payload: object) => {
    const {
        JWT_KEY,
        JWT_DURATION
    } = process.env;
    return jwt.sign(payload, JWT_KEY!, { expiresIn: JWT_DURATION ? Number(JWT_DURATION) : '1h' });
}

const authenticationStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return (err: string | null, user: User, info: any) => {
        if (err) return res.status(401).json({ message: err });
        const userId = user.id;
        // Generate new refresh token
        db.RefreshToken.create({ userId })
        .then((refreshToken) => {
            // Generate a new access token
            const accessToken = generateJWT({ userId });
            // Last Here
            res.status(201).json({ accessToken, refreshToken: refreshToken.id });
        })
        .catch((err) => {
            next(err);
        });
    }
}

// Pass through the Auth routes
export const authenticate = {
    // Email/Password
    localLogin: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('local-login', authenticationStrategyCallback(req, res, next))(req, res, next);
    }
}