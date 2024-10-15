import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { passportAuthenicationMiddleware } from "../auth";
import router from "../router";
import errorHandler from "../middlewares/errorHandler";

export default function() {
    try {
        const { NODE_ENV, COOKIE_PARSER_KEY } = process.env;
        const app: Application = express();
        app.set('trust proxy', true);
        app.use(cors({
            origin: NODE_ENV === 'development'
                ? 'http://localhost:3001'
                : 'http://client:3000',
                credentials: true
        }));

        app.use(compression());
        // For parsing cookies
        app.use(cookieParser(COOKIE_PARSER_KEY));
        // For parsing application/json
        app.use(bodyParser.json());
        // For parsing application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        // Setup Authentication
        passportAuthenicationMiddleware(app);
        // Set the router entry point
        app.use('/', router);
        // Setup Error Handler Middleware
        app.use(errorHandler);
        // Start the web server
        app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
    } catch (err) {
        console.error('An error occured while configuring express server', err);
    }
}