import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../../../config/redis";

// Extend Express Request type to include 'user'
declare module 'express' {
    interface Request {
        user?: JwtPayload
    }
}

const authenticateToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the 'authorization' property from the request header
        const token = req.headers['authorization'];
        // // Extract the access token from the header
        // const token = authHeader?.split(' ')[1];

        // Check if the access token was provided
        if (!token) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }

        // Verify the JWT
        let jwtPayload: JwtPayload | null;
        try {
            jwtPayload = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
        } catch(err: any) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({ message: "Token expired" });
                return
            }
            return next(err);
        }

        // Check if the token is blacklisted
        let isBlackListed = await redisClient!.get(`blacklist:${token}`);

        if (isBlackListed) {
            res.status(403).json({ message: "Token is blacklisted" });
            return
        }

        // Store jwt payload in request body
        req.user = jwtPayload;

        next();
    } catch (err) {
        next(err);
    }
}

export default authenticateToken;