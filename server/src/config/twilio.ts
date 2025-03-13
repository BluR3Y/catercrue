import { Twilio } from "twilio";
import logger from "./winston";

let twilioClient: Twilio | null = null;

const twilioConnect = async () => {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        throw new Error("Missing Twilio credentials.");
    }

    twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        await twilioClient.messages.list({ limit: 10 });

        logger.info("Connection to Twilio successfully created");
    } catch (err) {
        throw new Error(`Failed to establish a connection to twilio service: ${err}`);
    }
}

const twilioReady = twilioConnect();

export {
    twilioClient,
    twilioReady
}