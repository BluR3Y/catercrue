import passport from "passport";
import { Application, RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Import Login Strategies
import localLoginStrategy from "./localLoginStrategy";
import db from "../models";
import User from "../models/user.model";
import { redisClient } from "../../../config/redis";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Login Strategies
    localLoginStrategy(passport);
    
    app.use(passport.initialize());
}

export const generateJWT = (payload: object) => {
    const {
        JWT_KEY,
        ACCESS_TOKEN_DURATION
    } = process.env;
    return jwt.sign(payload, JWT_KEY!, { expiresIn: ACCESS_TOKEN_DURATION ? Number(ACCESS_TOKEN_DURATION) : '1h' });
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

export const blacklistToken = async (token: string) => {
    // Decode jwt to extract contents
    const { exp, userId } = (jwt.decode(token) as any);
    const tokenExpiry = new Date(exp * 1000);
    const currentTime = new Date();
    // Check if the current time has not exceeded the tokens expiry
    if (currentTime < tokenExpiry) {
        // Determine how long before the token expires (seconds)
        const timeRemaining = tokenExpiry.getTime() - currentTime.getTime();
        // Temporarily store the blacklisted token in redis cache
        await redisClient!.set(`blacklist:${token}`, userId, 'PX', timeRemaining);
    }
}