import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import router from './router';
import { ready, closeDBConnections } from './configs/database';
import errorHandler from './middlewares/errorHandler';
import { passportAuthenicationMiddleware } from './utils/auth';
import db from './models';

ready
.then(() => db.sequelize.sync())
.then(_ => {
    try {
        const {
            NODE_ENV
        } = process.env;
    
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
        app.use(cookieParser('cookie_secret_key'));
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
        app.listen(3000, () => console.log(`Server is listening on http://localhost:3000`));
    } catch (err) {
        // Error occured while running application
        closeDBConnections();
    }
});