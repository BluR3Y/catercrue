import { getMailerInstance } from "@/config/nodemailer";
import logger from "@/config/winston";

const mailer = getMailerInstance();

const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const info = await mailer.sendMail({ from: "CaterCrue Platform", to, subject, text });
        logger.info(`Email sent: ${info.messageId}`);
    } catch (err) {
        throw new Error(`Failed to send OTP: ${(err as Error).message}`);
    }
}

export const sendEmailOTP = async (to: string, otp: string) => {
    await sendEmail(to, "OTP", `Your CaterCrue OTP is: ${otp}`);
}