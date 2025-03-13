import { twilioClient } from "../../config/twilio";
import { redisClient } from "../../config/redis";

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = async (phoneNumber: string, otp: string = generateOTP()) => {
    try {
        await twilioClient!.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        redisClient!.setex(`otp:${phoneNumber}`, 300, otp);
    } catch (err) {
        console.log(`Twilio Error: ${err}`);
        throw new Error(`Failed to send message: ${err}`);
    }
}

export const verifyOTP = (phoneNumber: string, enteredOTP: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        redisClient!.get(`otp:${phoneNumber}`, (err, storedOTP) => {
            if (err) reject(err);
            resolve(storedOTP === enteredOTP);
        });
    });
}