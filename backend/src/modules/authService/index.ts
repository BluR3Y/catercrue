import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import logger from "../../config/winston";
import router from "./routes";

export default async function() {
    try {
        const app: Application = express();
        app.set("trust proxy", true);
        const { AUTH_MODULE_CLIENT, AUTH_MODULE_PORT } = process.env;
        const api_client = AUTH_MODULE_CLIENT || "localhost";
        const api_port = AUTH_MODULE_PORT || "3001";
        app.use(
            cors({
                origin: `http://${api_client}:${api_port}`,
                credentials: true
            })
        );
        app.use(compression());
        app.use(cookieParser("cookie_secret_key"));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use('/', router);

        app.use(errorHandler);

        app.listen(api_port, () => logger.info(`Authentication Server running on http://${api_client}:${api_port}`));
    } catch (error) {
        logger.error("Server startup error", { error })
        throw new Error(`Failed to startup Auth Server: ${error}`);
    }
}