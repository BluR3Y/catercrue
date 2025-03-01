import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import { passportAuthenticationMiddleware } from "./middlewares/auth";
import errorMiddleware from "./middlewares/error.middleware";
import logger from "../../config/winston";
import router from "./routes";

export default function(): [string, string] {
    try {
        const app: Application = express();
        app.set("trust proxy", true);

        const { NODE_ENV, REST_MODULE_CLIENT, REST_MODULE_PORT } = process.env;
        const server_client = (NODE_ENV === 'development' ? 'localhost' : REST_MODULE_CLIENT);
        const server_port = (NODE_ENV === 'development' ? '3001' : REST_MODULE_PORT);
        if (!server_client || !server_port) {
            throw new Error("Missing server Environment variables");
        }

        app.use(
            cors({
                origin: `http://${server_client}:${server_port}`,
                credentials: true
            })
        );
        app.use(compression());
        app.use(cookieParser("cookie_secret_key"));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        passportAuthenticationMiddleware(app);

        app.use('/', router);

        app.use(errorMiddleware);

        app.listen(server_port, () => logger.info(`REST Server running on http://${server_client}:${server_port}`));
        return [server_client, server_port]
    } catch (error) {
        logger.error("REST Server startup error", { error });
        throw new Error(`Failed to startup REST Server: ${error}`);
    }
}