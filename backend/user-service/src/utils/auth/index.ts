import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
// import RefreshToken from "../../models/refreshToken.model";
import AppError from "../appError";
import { Application } from "express";
import jwt from 'jsonwebtoken';

// Import Login Strategies:
import localLoginStrategy from "./localLoginStrategy";
import { redisClient } from "../../configs/database";
// import Device from "../../models/device.model";

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
                // Get device associated with user's ip address
                let clientDevice = await Device.findOne({ where: { userId: user.id, ipAddress: req.ip } });

                // Check if device is not registered
                if (!clientDevice) {
                    // Register user's device
                   clientDevice = await Device.create({ userId: user.id, ipAddress: req.ip! });
                }
                
                // Generate a new refresh token
                const refreshToken = await RefreshToken.create({ deviceId: clientDevice.id });
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
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the 'authorization' property from the request header
        const authHeader = req.headers['authorization'];
        // Extract the acess token from the header
        const token = authHeader && authHeader.split(' ')[1];

        // Check if the acess token was provided
        if (!token) {
            throw new AppError(401, 'UNAUTHORIZED', 'Unauthorized request');
        }

        let jwtPayload: any;
        try {
            jwtPayload = jwt.verify(token, process.env.JWT_KEY!);
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError(403, 'Forbidden', 'Token expired');
            }
            throw new AppError(403, 'Forbidden', 'Failed to authenticate token');
        }

        const deviceData = await Device.findOne({
            where: {
                userId: jwtPayload.userId,
                ipAddress: req.ip
            }
        });
        if (!deviceData) {
            throw new AppError(403, 'Forbidden', 'No token is associated with device');
        }
        
        let redisQuery: any;
        try {
            redisQuery = await redisClient.get(`token_blacklist_${token}`);
        } catch (err: any) {
            throw new AppError(403, 'Forbidden', 'Failed to authenticate token');
        }

        if (redisQuery && redisQuery === deviceData.id) {
            throw new AppError(403, 'Forbidden', 'Token is blacklisted');
        }

        (req as any).userId = jwtPayload.userId;
        next();
    } catch (err) {
        next(err);
    }
}

export const blacklistToken = async (token: string, deviceId: string) => {
    // Decode jwt to extract contents
    const { exp } = (jwt.decode(token) as any);
    const tokenExpiry = new Date(exp * 1000);
    const currentTime = new Date();
    // Check if the current time has not exceeded the tokens expiry
    if (currentTime < tokenExpiry) {
        // Determine how long before the token expires (seconds)
        const timeRemaining = tokenExpiry.getTime() - currentTime.getTime();
        // Temporarily store in redis the blacklisted access token
        await redisClient.set(`token_blacklist_${token}`, deviceId, 'PX', timeRemaining);
    }
}