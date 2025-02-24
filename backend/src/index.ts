import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer } from 'http';

import { postgresReady, closePostgresConnection, getSequelizeInstance } from './config/postgres';
import { redisReady, closeRedisConnection } from './config/redis';
import authService from './modules/authService';
import logger from './config/winston';

postgresReady
redisReady
// Auth Module
authService()
// Other module apis
.then(_ => {
    const app = express();
    const httpServer = createServer(app);   // Needed for websocket (future feature)
    const {
        BACKEND_CLIENT,
        BACKEND_PORT,
        AUTH_MODULE_CLIENT,
        AUTH_MODULE_PORT
    } = process.env;

    // Proxy User-Auth requests
    app.use("/auth", createProxyMiddleware({
        target: `http://${AUTH_MODULE_CLIENT}:${AUTH_MODULE_PORT}`,
        changeOrigin: true
    }));

    // ** Proxy additional modules:

    // Start the gateway
    const proxyClient = BACKEND_CLIENT || "localhost";
    const proxyPort = BACKEND_PORT || "3000";
    httpServer.listen(proxyPort, () => logger.info(`API Gateway running on http://${proxyClient}:${proxyPort}`));
})
.then(async () => {
    const sequelize = getSequelizeInstance();
    if (sequelize && process.env.NODE_ENV === 'development') {
        await sequelize.sync({force: true});
        logger.info("Postgres tables synchronized with sequelize models.");
    }
})
.catch(async (error) => {
    logger.error("Error occured while starting the server: ", { error });
    await closePostgresConnection();
    await closeRedisConnection();
    process.exit(1);
});