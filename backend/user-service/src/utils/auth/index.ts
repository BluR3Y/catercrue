import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import RefreshToken from "../../models/refreshToken.model";
import AppError from "../appError";
import { Application } from "express";
import jwt, { Secret } from 'jsonwebtoken';

// Import Login Strategies:
import localLoginStrategy from "./localLoginStrategy";
import { redisClient } from "../../config/database";

// Configure passport authentication middleware 
export const passportAuthenicationMiddleware = (app: Application) => {
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
    // Retrieve the 'authorization' property from the request header
    const authHeader = req.headers['authorization'];
    // Extract the access token from the header
    const token = authHeader && authHeader.split(' ')[1];

    // Check if an access token was provided
    if (!token) {
        return next(new AppError(401, 'UNAUTHORIZED', 'Unauthorized request'));
    }

    // Verify that the jwt is valid
    jwt.verify(token, process.env.JWT_KEY!, (err: any, payload: any) => {
        if (err) {
            // Check if the access token is expired
            if (err.name === 'TokenExpiredError') {
                return next(new AppError(403, 'Forbidden', 'Token expired'));
            }
            return next(new AppError(403, 'Forbidden', 'Failed to authenticate token'));
        }
        // Check if the access token is blacklisted
        redisClient.get(`token_blacklist_${token}`, (err: any, result: any) => {
            if (err) {
                return next(new AppError(403, 'Forbidden', 'Failed to authenticate token'));
            }
            // If token is blacklisted and belonged to the user
            if (result && result === payload.userId) {
                return next(new AppError(403, 'Forbidden', 'Token is blacklisted'));
            }
            (req as any).userId = payload.userId;
            next();
        });
    });
}

// Method for blacklisting Access Tokens
// ** Future Modification: Bind blacklisted tokens to devices/ips rather than users (Important for multiple device use case)
export const blacklistToken = async (token: string) => {
    // Decode jwt to extract contents
    const { userId, iat, exp } = (jwt.decode(token) as any);
    const tokenExpiry = new Date(exp * 1000);
    const currentTime = new Date();
    // Check if the current time has not exceeded the tokens expiry
    if (currentTime < tokenExpiry) {
        // Determine how long before the token expires (seconds)
        const timeRemaining = tokenExpiry.getTime() - currentTime.getTime();
        // Temporarily store in redis the blacklisted access token
        await redisClient.set(`token_blacklist_${token}`, userId, 'PX', timeRemaining);
    }
}