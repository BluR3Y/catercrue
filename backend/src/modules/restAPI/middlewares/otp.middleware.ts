import { NextFunction, Request, Response } from "express";
import { redisClient } from "../../../config/redis";
import { orm } from "@/models";

export default async function(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const otpSessionToken = req.headers["x-otp-session-token"] as string;
        if (!otpSessionToken) {
            res.status(401).json({ message: "OTP verification required" });
            return;
        }
        const storedSessionToken = await redisClient!.get(`otp-session:${otpSessionToken}`);
        if (!storedSessionToken) {
            res.status(401).json({ message: "OTP session expired or invalid" });
            return;
        }

        const contactMethod = await orm.ContactMethod.findByPk(storedSessionToken);
        if (!contactMethod) {
            res.status(404).json({ message: "Contact method could not be found" });
            return;
        }
        
        if (contactMethod.userId !== user.id) {
            res.status(401).json({ message: "OTP does not pertain to user" });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}