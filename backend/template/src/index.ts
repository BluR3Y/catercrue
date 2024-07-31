import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import router from './router';
import { ready, closeDBConnections } from './config/database';
import errorHandler from './middlewares/errorHandler';

ready.then(_ => {
    try {
        const {
            NODE_ENV,
            EXPRESS_SESSION_SECRET
        } = process.env;
    
        const app: Application = express();
        app.use(cors({
            origin: NODE_ENV === 'development'
                ? 'http://localhost:3001'
                : 'http://client:3000',
            credentials: true
        }));
    
        app.use(compression());
        // For parsing cookies
        app.use(cookieParser(EXPRESS_SESSION_SECRET));
        // For parsing application/json
        app.use(bodyParser.json());
        // For parsing application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));
    
        // Set the router entry point
        app.use('/', router);
        // Setup Error Handler Middleware
        app.use(errorHandler);
        // Start the web server
        app.listen(3000, () => console.log(`Server is listening on http://localhost:3000`));
    } catch (err) {
        // Error occured while running application
        closeDBConnections();
    }
});