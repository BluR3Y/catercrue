import Redis from "ioredis";
import mongoose from "mongoose";

const getMongoose = mongoose;
const mongoConnect = async (): Promise<void> => {
    const {
        NODE_ENV,
        MONGO_HOST,
        MONGO_ACCESS_USER,
        MONGO_ACCESS_PASSWORD,
        MONGO_PORT,
        MONGO_DATABASE
    } = process.env;

    if (!NODE_ENV || !MONGO_HOST || !MONGO_ACCESS_USER || !MONGO_ACCESS_PASSWORD || !MONGO_DATABASE) {
        throw new Error('Missing required environment variables for MongoDB connection');
    }

    let mongoURI: string;
    switch (NODE_ENV) {
        case 'production':
            mongoURI = `mongodb+srv://${MONGO_ACCESS_USER}:${encodeURIComponent(MONGO_ACCESS_PASSWORD)}@${MONGO_HOST}/${MONGO_DATABASE}`;
            break;
        case 'development':
            if (!MONGO_PORT) {
                throw new Error('Missing MONGO_PORT environment variable for development environment');
            }
            mongoURI = `mongodb://${MONGO_ACCESS_USER}:${encodeURIComponent(MONGO_ACCESS_PASSWORD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
            break;
        default:
            throw new Error('Invalid NODE_ENV value');
    }

    // Set mongoose to throw an error if querying fields aren't defined
    mongoose.set('strictQuery', true);

    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connection established successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
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
    mongoConnect(),
    redisConnect()
]);

export {
    getMongoose,
    redisClient,
    ready
}