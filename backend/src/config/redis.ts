import Redis from "ioredis";
import logger from "./winston";

let redisClient: Redis | null = null;
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

        redisClient.on("connect", () => logger.info("Redis connection established successfully."));
        redisClient.on("error", (error) => logger.error("Redis error:", {error}));
        redisClient.on("reconnecting", () => logger.stream("Redis reconnecting..."));
    } catch (err) {
        // console.error('Failed to connect to Redis', err);
        // throw err;
        throw new Error(`Failed to connect to Redis: ${err}`);
    }
}

const closeRedisConnection = async (): Promise<void> => {
    if (redisClient) {
        try {
            await redisClient.quit();
            logger.info("Successfully closed connection to Redis cache.");
        } catch (error) {
            logger.error("Error occured while closing connection to Redis cache: ", {error});
        }
    }
}

const redisReady = redisConnect();

const getRedisInstance = (): Redis => {
    if (!redisClient) {
        throw new Error("Redis has not been initialized.");
    }
    return redisClient;
}

export {
    redisClient,
    redisReady,
    closeRedisConnection,
    getRedisInstance
}