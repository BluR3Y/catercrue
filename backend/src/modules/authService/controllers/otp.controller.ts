import { RequestHandler, Request, Response, NextFunction } from "express";
import { twilioClient } from "../../../config/twilio";
import { redisClient } from "../../../config/redis";
import crypto from "crypto";

export const requestOTP: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);   // Debugging
        await twilioClient!.messages.create({
            body: `Your CaterCrue verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        redisClient!.setex(`otp:${phoneNumber}`, 300, otp);

        res.json({ message: "OTP send successfully" });
    } catch (err) {
        next(err);
    }
}

export const verifyOTP: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber, otp } = req.body;
        const storedOtpKey = `otp:${phoneNumber}`;
        const storedOtp = await redisClient!.get(storedOtpKey);

        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        await redisClient!.del(storedOtpKey);

        // Generate a temporary session token for OTP verification
        const optSessionToken = crypto.randomBytes(32).toString("hex");
        await redisClient!.setex(`otp-session:${optSessionToken}`, 600, phoneNumber);

        res.json({ message: "OTP verified", optSessionToken });
    } catch (err) {
        next(err);
    }
}