import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
// import RefreshToken from "../../models/refreshToken.model";
import AppError from "../utils/appError";
import { Application } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redisClient } from "../configs/database";
import RefreshToken from "../models/refreshToken.model";

// Import Login Strategies:
import localLoginStrategy from "./localLoginStrategy";

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
                const userId = user.id;
                
                // Generate a new refresh token
                const refreshToken = await RefreshToken.create({ userId });
                // Generate a new access token
                const accessToken = generateJWToken({ userId });
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
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the 'authorization' property from the request header
        const authHeader = req.headers['authorization'];
        // Extract the acess token from the header
        const token = authHeader?.split(' ')[1];

        // Check if the acess token was provided
        if (!token) {
            throw new AppError(401, 'UNAUTHORIZED', 'Invalid access token');
        }

        // Verify the JWT token
        let jwtPayload: JwtPayload;
        try {
            jwtPayload = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError(401, 'Unauthorized', 'Token expired');
            }
            throw new AppError(401, 'Unauthorized', 'Failed to authenticate token');
        }
        
        // Check if the token is blacklisted in Redis
        let redisQuery: string | null;
        try {
            redisQuery = await redisClient.get(`token_blacklist_${token}`);
        } catch (err) {
            console.error('Redis lookup failed:', err);
            return next(new AppError(500, 'Internal Server Error', 'Authentication service unavailable'));
        }

        if (redisQuery && redisQuery === jwtPayload.userId) {
            throw new AppError(403, 'Forbidden', 'Token is blacklisted');
        }

        // Store values in request object
        (req as any).userId = jwtPayload.userId;
        (req as any).accessToken = token;
        next();
    } catch (err) {
        next(err);
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
        // Temporarily store in redis the blacklisted access token
        await redisClient.set(`token_blacklist_${token}`, userId, 'PX', timeRemaining);
    }
}