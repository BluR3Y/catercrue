import { randomInt } from "crypto";
import { redisClient } from "../configs/database";

export const generateOneTimePassword = async (payload: string) => {
    const otp = randomInt(100000, 999999);
    const codeDuration = 60 * 15;   // Code lasts 15 minutes
    await redisClient.set(`otp:${otp}`, payload, 'EX', codeDuration);
    return otp;
}

// const registrationCode = randomInt(100000, 999999);
// const codeDuration = 60 * 15;   // Code lasts 15 minutes
// const mailOptions = {
//     recipients: email,
//     subject: 'Registration Code',
//     content: `<h1>The registration code for your BarBak account is: ${registrationCode}</h1>`
// };
// await redisClient.setEx(`registration-code:${sessionId}`, codeDuration, registrationCode.toString());
// await emailQueue(mailOptions);