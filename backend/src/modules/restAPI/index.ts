import { Application } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { passportAuthenticationMiddleware } from "./middlewares/auth";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes";

export default function(app: Application) {
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser(process.env.COOKIE_SECRET || "cookie_secret_key"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    passportAuthenticationMiddleware(app);
    app.use('/', router);
    app.use(errorMiddleware);
}