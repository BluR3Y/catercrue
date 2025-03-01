import { NextFunction, Request, RequestHandler, Response } from "express";
import { redisClient } from "../../../config/redis";

export const otpAuthMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const otpSessionToken = req.headers["x-otp-session-token"] as string;

    if (!otpSessionToken) {
        res.status(401).json({ message: "OTP verification required" });
        return
    }

    const phoneNumber = await redisClient!.get(`otp-session:${otpSessionToken}`);

    if (!phoneNumber) {
        res.status(401).json({ message: "OTP session expired or invalid" });
        return;
    }

    next();
}