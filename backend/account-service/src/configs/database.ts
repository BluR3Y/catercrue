import Redis from "ioredis";
import { Sequelize } from "sequelize";

let sequelize: Sequelize;
const postgresConnect = async (): Promise<void> => {
    const {
        NODE_ENV,
        POSTGRES_HOST,
        POSTGRES_PORT,
        POSTGRES_ACCESS_USER,
        POSTGRES_ACCESS_PASSWORD,
        POSTGRES_DB_NAME,
    } = process.env;

    if (!POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_ACCESS_USER || !POSTGRES_ACCESS_PASSWORD || !POSTGRES_DB_NAME) {
        throw new Error('Missing required environment variables for Postgres connection');
    }

    try {
        sequelize = new Sequelize(`postgres://${POSTGRES_ACCESS_USER}:${POSTGRES_ACCESS_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB_NAME}`);
        await sequelize.authenticate();

        if (NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
        }

        console.log('Postgres connection established successfully');
    } catch (err) {
        console.error('Failed to connect to Postgres', err);
        throw err;
    }
}


let redisClient: Redis;
const redisConnect = async (): Promise<void> => {
    const {
        REDIS_HOST,
        REDIS_PORT,
        REDIS_ACCESS_USER,
        REDIS_ACCESS_PASSWORD,
        REDIS_DB_INDEX
    } = process.env;

    if (!REDIS_HOST || !REDIS_PORT || !REDIS_ACCESS_PASSWORD) {
        throw new Error('Missing required environment variables for Redis connection');
    }

    const redisConfig = {
        username: REDIS_ACCESS_USER ?? 'default',
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        password: REDIS_ACCESS_PASSWORD,
        db: REDIS_DB_INDEX ? Number(REDIS_DB_INDEX) : 0
    }

    try {
        redisClient = new Redis(redisConfig);
        console.log('Redis connection etablished successfully');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
        throw err;
    }
}

const ready = Promise.all([
    postgresConnect(),
    redisConnect()
]);

const closeDBConnections = async () => {
    if (redisClient) {
        try {
            await redisClient.quit();
            console.log('Redis connection closed');
        } catch (err) {
            console.error('Error closing Redis connection: ', err);
        }
    }

    if (sequelize) {
        try {
            await sequelize.close();
            console.log('Postgres connection closed');
        } catch (err) {
            console.error('Error closing Postgres connection: ', err);
        }
    }
}

export {
    sequelize,
    redisClient,
    ready,
    closeDBConnections
}