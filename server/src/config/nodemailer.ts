import nodemailer, {Transporter} from "nodemailer";
import logger from "./winston";

let mailTransporter: null | Transporter;

const mailerConnect = async () => {
    const {
        EMAIL_USER,
        EMAIL_PASSWORD,
        EMAIL_SERVICE
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_SERVICE) {
        throw new Error("Missing required environment variables for Mailing Service");
    }

    mailTransporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });

    try {
        await mailTransporter.verify();
        logger.info("Successfully connected to mailing service");
    } catch (err) {
        throw new Error(`Failed to establish a connection to mailing service: ${(err as Error).message}`);
    }
}

const getMailerInstance = (): Transporter => {
    if (!mailTransporter) {
        throw new Error("Mailing Service has not been initialized");
    }
    return mailTransporter;
}

const mailerReady = mailerConnect();

export {
    mailerReady,
    getMailerInstance
}