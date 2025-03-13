import { getTwilioClient } from "@/config/twilio";
import logger from "@/config/winston";

const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = getTwilioClient();

const sendSMS = async (to: string, body: string) => {
    try {
        const info = await twilioClient.messages.create({ from: twilioPhone, to, body });

        logger.info(`SMS sent: ${info.accountSid}`);
    } catch (err) {
        throw new Error(`Failed to send otp: ${(err as Error).message}`);
    }
}

export const sendSMSOTP = async (to: string, otp: string) => {
    await sendSMS(to, `Your CaterCrue OTP is: ${otp}`);
}