import express from 'express';
import { createServer } from 'http';
import cors from "cors";

import { postgresReady, closePostgresConnection } from './config/postgres';
import { closeMongooseConnection, mongooseReady } from './config/mongoose';
import { redisReady, closeRedisConnection } from './config/redis';
import { twilioReady } from './config/twilio';
import { mailerReady } from './config/nodemailer';
import { passportAuthMiddleware } from './auth';
import restAPI from './modules/restAPI';
import logger from './config/winston';
import websocket from './modules/websocket';
import graphql from './modules/graphql';
import testDB from './testDB';
import { orm } from './models';

const devConfig = async () => {
    const force = false;
    await orm.sequelize.sync({force});
    logger.info("Postgres tables synchronized with sequelize models.");
    // await testDB();
}

async function startServer() {
    try {
        await Promise.all([postgresReady, redisReady, mongooseReady, twilioReady, mailerReady]);

        const {
            BACKEND_CLIENT,
            BACKEND_PORT,
            NODE_ENV
        } = process.env;

        const backend_client = NODE_ENV === "development" ? 'localhost' : BACKEND_CLIENT;
        const backend_port = Number(NODE_ENV === 'development' ? '3001' : BACKEND_PORT);
        if (!backend_client || !backend_port) {
            throw new Error("Missing server environment variables");
        }
        const app = express();
        // app.set('trust proxy', true)
        app.use(cors({
            origin: `http://${backend_client}:${backend_port}`,
            credentials: true
        }));
        passportAuthMiddleware(app);
        restAPI(app);
        // Dev Test Data
        // if (NODE_ENV === 'development') await devConfig();

        const httpServer = createServer(app);
        // websocket(httpServer);
        await graphql(app, httpServer);

        httpServer.listen(backend_port, backend_client, () => {
            logger.info(`Backend Server running on http://${backend_client}:${backend_port}`);
        });
    } catch (err) {
        logger.error(`Error occurred while starting the server: ${(err as Error).message}`, { stack: (err as Error).stack });
        await closePostgresConnection();
        await closeRedisConnection();
        await closeMongooseConnection();
    }
}
startServer();
