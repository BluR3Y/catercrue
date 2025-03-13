import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "@/utils/manageJWT";

export default async function(req: Request, res: Response, next: NextFunction) {
    try {
        const otpHeader = req.headers["x-otp-token"] as string;
        if (!otpHeader || !otpHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "OTP token is required" });
            return;
        }
        
        // Extract token from "Bearer <token>"
        const token = otpHeader.split(" ")[1];

        // Verify JWT
        const payload = verifyJWT(token) as any;
        req.otpData = payload;

        next();
    } catch (err) {
        next(err);
    }
}