import express, { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer, Server } from 'http';

import { postgresReady, closePostgresConnection, getSequelizeInstance } from './config/postgres';
import { redisReady, closeRedisConnection } from './config/redis';
import { twilioReady } from './config/twilio';
import restAPI from './modules/restAPI';
import logger from './config/winston';

postgresReady
redisReady
twilioReady
.then(_ => {
    // Start REST API
    const [rest_api_client, rest_api_port] = restAPI();
    const app: Application = express();
    const httpServer: Server = createServer(app);   // Needed for websocket (future feature)
    
    const {
        BACKEND_CLIENT,
        BACKEND_PORT,
        NODE_ENV
    } = process.env;
    const backend_client = (NODE_ENV === "development" ? 'localhost' : BACKEND_CLIENT);
    const backend_port = (NODE_ENV === 'development' ? '3000' : BACKEND_PORT);
    if (!backend_client || !backend_port) {
        throw new Error("Missing server environment variables");
    }

    // Proxy REST API
    app.use('/api', createProxyMiddleware({
        target: `http://${rest_api_client}:${rest_api_port}`,
        changeOrigin: true
    }));
    // Proxy GraphQL api
    // Proxy ws api

    // Start the gateway
    const proxyClient = backend_client;
    const proxyPort = backend_port;
    httpServer.listen(proxyPort, () => logger.info(`API Gateway running on http://${proxyClient}:${proxyPort}`));
})
.then(async () => {
    const sequelize = getSequelizeInstance();
    if (sequelize && process.env.NODE_ENV === 'development') {
        await sequelize.sync({force: false});
        logger.info("Postgres tables synchronized with sequelize models.");
    }
})
.catch(async (error) => {
    logger.error("Error occured while starting the server: ", { error });
    await closePostgresConnection();
    await closeRedisConnection();
    process.exit(1);
});